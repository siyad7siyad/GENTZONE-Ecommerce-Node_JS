const Order = require("../model/orderModel")
const Product = require("../model/productModel")
const Address = require("../model/addressModel")
const Cart = require("../model/cartModel")
const User = require("../model/userModel")
const {calculateSubtotal,calculateProductTotal} = require("../config/cartFunctions")

// load checkout page

const loadCheckOut = async(req,res)=>{

    try {

        const userId = req.session.user_id

        
        const userData = await User.findById(userId)

        const cart = await Cart.findOne({user:userId}).populate({
            path:"items.product",
            model:"Product"
        }).exec()

       

        if(!cart){
            console.log("cart is not found");
        }

        const cartItems = cart.items||[]
        const subtotal = calculateSubtotal(cartItems)
        const productTotal = calculateProductTotal(cartItems)
        const subtotalWithShipping = subtotal

        const addressData = await Address.find({user:userId})

        res.render("user/checkOut",{userData,addressData,subtotalWithShipping,productTotal,cart:cartItems})

        
        
    } catch (error) {
        console.log(error,"error in fetching user data and address");
    }
}


// post order list

const checkOutPost = async (req, res) => {
    try {
      const userId = req.session.user_id;

   
      const { address, paymentMethod } = req.body;

      const user = await User.findById(userId);
  
     
      const cart = await Cart.findOne({ user: userId })
        .populate({
          path: "items.product",
          model: "Product",
        })
        .populate("user");
  console.log(cart);
        if (!user || !cart) {
          return res
            .status(500)
            .json({ success: false, error: "User or cart not found." });
        }
  
      if (!address) {
        return res.status(400).json({ error: 'Billing address not selected' });
      }
  
      const cartItems = cart.items || [];

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.product.discount_Price * item.quantity || 0),
    0
  );
     
  
      const order = new Order({
        user: userId,
        address: address,
        orderDate: new Date(),
        status: "Pending",
        paymentMethod: paymentMethod,
        paymentStatus: "Pending",
        deliveryDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        totalAmount: totalAmount,
        items: cartItems.map((cartItem) => ({
          product:  cartItem.product._id,
          quantity: cartItem.quantity,
          price: cartItem.product.discount_price,
        })),
      });

      await order.save();
  
      
  

      cart.items = []; 
      cart.totalAmount = 0; 
  
      await cart.save(); 
  
      res.status(200).json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// load order details

const loadOrderDetails = async(req,res)=>{
    try {

        const userId = req.session.user_id
        const userData = await User.findById(userId)

        const order = await Order.find({user:userData._id}).populate('user')
        .populate({
            path:"items.product",
            model:"Product",
        })

        if(userData){
            res.render("user/order",{userData,order})
        }else{
            res.redirect("/login")
        }


        
    } catch (error) {
        console.log(error.message);
    }
}

// order history

const loadOrderHistory = async(req,res)=>{
    try {

        const userId = req.session.user_id
        const orderId = req.params.id
        const userData = await User.findById(userId)
        const order = await Order.findById(orderId)
        .populate("user")
        .populate({
            path:"address",
            model:"Address",
        }).populate({
            path:"items.product",
            model:"Product"
        })

        res.render("user/OrderDetails",{userData,order})


        
    } catch (error) {
        console.log(error.message);
    }
}

// cancel order

const cancelOrder = async(req,res)=>{
    try {
        const userId  = req.session.user_id
        const orderId = req.query.id
        const userData = await User.findById(userId)

        const order = await Order.find({_id:orderId})
        .populate("user")
        .populate({
            path:"address",
            model:"Address",
        }).populate({
            path:"items.product",
            model:"Product"
        })

        const updateOrder = await Order.findByIdAndUpdate({_id:orderId},{
            $set:{
                status:"cancelled"
            }
        })

        res.redirect("/orderSuccess")


        
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
  
    loadCheckOut,
    checkOutPost,
    loadOrderDetails,
    loadOrderHistory,
    cancelOrder

}