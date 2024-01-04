const Order = require("../model/orderModel")
const Product = require("../model/productModel")
const Address = require("../model/addressModel")
const Cart = require("../model/cartModel")
const User = require("../model/userModel")
const Coupon = require("../model/couponModel")
const swal = require('sweetalert2');
const Wishlist = require("../model/wishListModel")
require("dotenv").config()


const {calculateSubtotal,calculateProductTotal} = require("../config/cartFunctions")
const razorPay = require("razorpay")

var instance = new razorPay({
    key_id:"rzp_test_44UydPbnSvDtHK",
    key_secret:"lKgZbdAkb13mq0UzhkJ4178f",       
})

// load checkout page

const loadCheckOut = async(req,res)=>{

    try {

        const userId = req.session.user_id

        
        const wishList = await Wishlist.find({user:userId})
        const cartCount = await Cart.find({user:userId})
        const coupon  = await Coupon.find()
        const userData = await User.findById(userId)

        const cart = await Cart.findOne({user:userId}).populate({
            path:"items.product",
            model:"Product"
        }).exec()

       

        if(!cart){
            console.log("cart is not found");
        }

        const cartItems = cart.items||[]
        console.log(cartItems,"cartItems");
        const subtotal = calculateSubtotal(cartItems)
        const productTotal = calculateProductTotal(cartItems)
        const subtotalWithShipping = subtotal

        const addressData = await Address.find({user:userId})

        res.render("user/checkOut",{userData,addressData,subtotalWithShipping,productTotal,cart:cartItems,coupon,wishList,cartCount})

        
        
    } catch (error) {
        console.log(error,"error in fetching user data and address");
    }
}

// razorpay integration
const razorPayLoad = async(req,res)=>{
    try {

        const id = req.session.user_id
        const{address,paymentMethod} = req.body

        const user = await User.findById(id)

        const cart = await Cart.findOne({user:id})
        .populate({
            path:"items.product",
            model:"Product"
        }).populate("user")
        
        if(!cart||!user){
            return res.status(500).json({success:false,error:"user or cart is not found"})
        }
        if(!address){
            return res.status(400).json({error:"billing address not selected"})
        }
        const cartItems = cart.items || []
      
        
        const totalAmount = cartItems.reduce(
          (acc, item) =>
              acc +
              ((item.product.salePrice !== 0 ? item.product.salePrice : item.product.offerPrice) *
                  item.quantity ||
                  0),
          0
      );


        const options = {
            amount:  Math.round(totalAmount * 100), // Razorpay accepts amount in paisa
            currency: 'INR',
            receipt: `order_${Date.now()}`, // Use a timestamp as a receipt
            payment_capture: 1,
          };

          instance.orders.create(options, async (err, razorpayOrder) => {
            if (err) {
              console.error("Error creating Razorpay order:", err);
              return res
                .status(400)
                .json({ success: false, error: "Payment Failed", user });
            } else {
          
              res.status(201).json({success: true,
                message: "Order placed successfully.",
                order: razorpayOrder,
              });
            }
          });
      

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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
          (acc, item) =>
              acc +
              ((item.product.salePrice !== 0 ? item.product.salePrice : item.product.offerPrice) *
                  item.quantity ||
                  0),
          0
      );

    if (paymentMethod === "onlinePayment") {
      // Create a Razorpay order
      
      // Update the order with the Razorpay order ID
      const order = new Order({
        user: userId,
        address: address,
        orderDate: new Date(),
        status: "Confirmed",
        paymentMethod: paymentMethod,
        paymentStatus: "success", // Set paymentStatus to pending initially
        deliveryDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        totalAmount: totalAmount,
        items: cartItems.map((cartItem) => ({
          product: cartItem.product._id,
          quantity: cartItem.quantity,
          price: cartItem.product.offerPrice,
        })),
      });
    
      for (const cartItem of cartItems) {
        const product = cartItem.product;
        console.log(product, "aaa");
        product.stock -= cartItem.quantity;
        await product.save();
      }

      await order.save();
  
    // Redirect the user to the Razorpay checkout page

  } else if (paymentMethod=="CashOnDelivery")  {
    const order = new Order({
      user: userId,
      address: address,
      orderDate: new Date(),
      status: "Confirmed",
      paymentMethod: paymentMethod,
      paymentStatus: "Pending",
      deliveryDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
      totalAmount: totalAmount,
      items: cartItems.map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
     
        price: cartItem.product.offerPrice,
      })),
    });
  

    for (const cartItem of cartItems) {
      const product = cartItem.product;
      console.log(product, "aaa");
      product.stock -= cartItem.quantity;
      await product.save();
    }
  await order.save();
 

  }else if(paymentMethod=="wallet"){

    if(totalAmount<=user.walletBalance){

      user.walletBalance -= totalAmount
      await user.save()
      const order = new Order({
        user: userId,
        address: address,
        orderDate: new Date(),
        status: "Confirmed",
        paymentMethod: paymentMethod,
        paymentStatus: "success",
        deliveryDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        totalAmount: totalAmount,
        items: cartItems.map((cartItem) => ({
          product: cartItem.product._id,
          quantity: cartItem.quantity,
       
          price: cartItem.product.offerPrice,
        })),
      });


      for (const cartItem of cartItems) {
        const product = cartItem.product;
        console.log(product, "aaa");
        product.stock -= cartItem.quantity;
        await product.save();
      };

    await order.save()


    }else{
      return res.status(500).json({ success: false, error: "insuficient balance." });
    }



  }

  cart.items.forEach(cartItem => {
    const product = cartItem.product;


    // Set sale_price to zero
    product.salePrice = 0;

    // Save the product
    product.save();
    });

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

        const wishList = await Wishlist.find({user:userId})
        const cartCount = await Cart.find({user:userId})

        const order = await Order.find({user:userData._id}).populate('user')
        .populate({
            path:"items.product",
            model:"Product",
        })

        if(userData){
            res.render("user/order",{userData,order,wishList,cartCount})
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

        const wishList = await Wishlist.find({user:userId})
        const cartCount = await Cart.find({user:userId})

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

        res.render("user/orderDetails",{userData,order,wishList,cartCount})


        
    } catch (error) {
        console.log(error.message);
    }
}

// cancel order

const cancelOrder = async (req, res) => {
    try {
      
     
        const orderId = req.query.id;
        const userId = req.session.user_id
        const userData = await User.findById(userId)
        const order = await Order.findById({ _id: orderId })
            .populate("user")
            .populate({
                path: "address",
                model: "Address",
            })
            .populate({
                path: "items.product",
                model: "Product",
            });
           

            const user = order.user

           

            if(order.paymentStatus=="wallet"||(order.paymentStatus=="onlinePayment")){
              
              user.walletBalance += order.totalAmount
              await user.save()
              order.paymentStatus = "refunded"
            }else{
              order.paymentStatus = "declined"
            }


// In cancelOrder function
if (order.status == "Confirmed") {


  const updateOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      {
          $set: {
              status: "cancelled",
          },
      }
  );

  // Send success JSON response
  res.status(200).json({ success: true, message: ' cancel Order successfully' });
}



 

    } catch (error) {
        console.log(error.message);

        // Send error JSON response
        res.status(500).json({ success: false, error: error.message });
    }
};

// return order

const returnOrder = async(req,res)=>{
  try {

    const orderId = req.query.id
    const{reason} = req.body

    const order = await Order.findOne({_id:orderId}).populate("user").populate({
      path:"items.product",
      model:Product
    })
    
    const user = order.user
    user.walletBalance += order.totalAmount
    await user.save()


    order.status = "return Successfull"
    order.paymentStatus = "Refunded"
    await user.save()
    await order.save()

      res.status(200).json({ success: true, message: "return sucessfully" });
  } catch (error) {
    console.log(error.message);
  }
}

// apply coupon 
const applyCoupon = async (req, res) => {
  try {
      const couponCode = req.body.couponCode;
      const existCoupon = await Coupon.findOne({ couponCode });

      if (!existCoupon || existCoupon.status !== "Active") {
        
          return res.status(400).json({ error: "Invalid or inactive coupon code" });
      }
console.log(!existCoupon);
      const userId = req.session.user_id;

      // Check if the user has already applied the coupon
      if (existCoupon.appliedUsers.includes(userId)) {
          return res.status(400).json({ error: "Coupon is already applied by the user" });
      }

      const cart = await Cart.findOne({ user: userId }).populate({
          path: "items.product",
          model: "Product",
          
      }).exec();

      if (!cart) {
          return res.status(400).json({ error: "Cart not found" });
      }

      // Update products with the coupon discount
      // const discountAmount = (existCoupon.discountPercentage / 100) *product.discount_price ;

      for (const cartItem of cart.items) {
          const product = await Product.findById(cartItem.product._id);
          const discountAmount = (existCoupon.discountPercentage / 100) *product.offerPrice
          // Ensure that 'product' is a mongoose document
          product.salePrice = product.offerPrice - discountAmount 
          await product.save();
      }
      

      // Save the coupon ID to the Coupon model
      existCoupon.appliedUsers.push(userId);
      await existCoupon.save();

      // Save the coupon ID in the cart
      cart.coupon = existCoupon._id;
      await cart.save();
      console.log(cart.items);

      res.status(200).json({ success: true });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  
    loadCheckOut,
    checkOutPost,
    loadOrderDetails,
    loadOrderHistory,
    cancelOrder,
    razorPayLoad,
    returnOrder,
    applyCoupon

}