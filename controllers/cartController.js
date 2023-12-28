const Cart = require('../model/cartModel')
const User = require("../model/userModel")
const { calculateSubtotal, calculateProductTotal } = require('../config/cartFunctions')
const Wishlist = require("../model/wishListModel")

const loadCartPage = async (req, res) => {
    try {

        const userId = req.session.user_id

        const userData = await User.findById(userId)

        const wishList = await Wishlist.find({ user: userData })
        const cartCount = await Cart.find({ user: userData })

        if (userData) {

            const userCart = await Cart.findOne({ user: userId }).populate("items.product")

            if (userCart) {

                const cart = userCart ? userCart.items : []

                const subtotal = calculateSubtotal(cart)
                const productTotal = calculateProductTotal(cart)

                const subtotalWithShipping = subtotal

                // error 

                let outOfStockError = false

                if (cart.length > 0) {
                    for (const cartItems of cart) {
                        const product = cartItems.product

                        if (product.quantity < cartItems.length) {
                            outOfStockError = true
                            break
                        }
                    }
                }

                let maxQuantityError = false
                if (cart.length > 0) {
                    for (const cartItems of cart) {
                        const product = cartItems.product

                        if (cartItems.quantity > 2) {
                            maxQuantityError = true
                            break
                        }
                    }
                }
               
                res.render("user/cart", { userData, productTotal, subtotalWithShipping, outOfStockError, maxQuantityError, cart, wishList, cartCount })



            } else {
                res.render("user/cart", { userData, cart: null })
            }

        } else {
            res.redirect('/login');
        }


    } catch (error) {
        console.log("error loading cart", error);
        res.status(500).send("error loading cart")
    }
}

// add to cart method
const addToCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const productId = req.body.productData_id;
        const { qty } = req.body;

        // Check if the product is in the wishlist
        const wishList = await Wishlist.findOne({ 'items.product': productId, user: userId });

      
            // Product is in the wishlist, proceed to add it to the cart

            const existingCart = await Cart.findOne({ user: userId });

            if (existingCart) {
                const existingCartItem = existingCart.items.find((item) => item.product.toString() === productId);

                if (existingCartItem) {
                    existingCartItem.quantity += parseInt(qty);
                } else {
                    existingCart.items.push({
                        product: productId,
                        quantity: parseInt(qty)
                    });
                }

                existingCart.total = existingCart.items.reduce((total, item) => total + (item.quantity || 0), 0);

                await existingCart.save();
                
                if (wishList) {
                // Remove the product from the wishlist
                await Wishlist.findOneAndUpdate(
                    { user: userId },
                    { $pull: { items: { product: productId } } },
                    { new: true }
                );
            }

            // Redirect to the cart page after adding the product
            res.redirect("/cart");
        } else {
            // Product is not in the wishlist
            console.log('Product is not in the wishlist');
            // Handle accordingly (e.g., show an error message)
        }
    } catch (error) {
        console.log("Adding cart product error", error);
        // Handle the error accordingly
        res.status(500).send('Internal Server Error');
    }
};


// update the count of cart 

const updateCartCount = async (req, res) => {
    try {

        const userId = req.session.user_id
        const productId = req.query.productId
        const newQuantity = parseInt(req.query.quantity)

        const exixtingCart = await Cart.findOne({ user: userId })

        if (exixtingCart) {
         
            const exixtingCartItem = exixtingCart.items.find((item) => item.product.toString() === productId)


            if (exixtingCartItem) {
                exixtingCartItem.quantity = newQuantity
                exixtingCart.total = exixtingCart.items.reduce((total, item) =>
                    total + (item.quantity || 0),
                    0)


                await exixtingCart.save()

            }
            res.json({ success: true })

        } else {
            res.json({ susccess: false, error: "cart not found" })
        }




    } catch (error) {
        console.log("error in updating cart", error);
        res.json({ success: false, error: "internal server error" })
    }
}

// delete cart

const removeFromCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        //   console.log(userId);
        const productId = req.query.productId;

        // Use findOne with the appropriate query
        const existingCart = await Cart.findOne({ user: userId });

        if (existingCart) {
            const updatedItems = existingCart.items.filter(
                (item) => item.product.toString() !== productId
            );

            existingCart.items = updatedItems;
            existingCart.total = updatedItems.reduce(
                (total, item) => total + (item.quantity || 0),
                0
            );

            await existingCart.save();
            res.json({ success: true, toaster: true });
        } else {
            res.json({ success: false, error: "Cart not found" });
        }
    } catch (error) {
        console.log("Error removing cart", error);
        res.json({ success: false, error: "Internal server error" });
    }
};





module.exports = {
    loadCartPage,
    addToCart,
    updateCartCount,
    removeFromCart
}