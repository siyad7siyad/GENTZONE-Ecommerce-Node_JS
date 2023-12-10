const express = require("express")
const userRoute = express()
const addressController = require("../controllers/addressController")
const userController = require("../controllers/userController")
const userAuth = require('../middlewares/userAuth')
const multer = require("../middlewares/multer")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")
const wishlistController = require("../controllers/whishlistController")
const couponController = require("../controllers/admin/couponController")
// registration

userRoute.get('/register',userAuth.isLogout,userController.loadRegister)
userRoute.post('/register',userController.insertUser)
userRoute.get('/otp',userAuth.isLogout,userController.loadOtp)
userRoute.post('/otp',userController.verifyOtp)
userRoute.get('/resendOtp',userAuth.isLogout,userController.resendOTP)

// user login
userRoute.get('/login', userController.loadLogin);
userRoute.post('/login', userController.verifyLogin);

// home page
userRoute.get('/', userController.loadHome);

userRoute.get("/items",userAuth.isLogin,userController.loadItems)
userRoute.get("/single-items",userAuth.isLogin,userController.singleItems)
userRoute.get("/sortAsc",userAuth.isLogin,userController.sortedAscending)
userRoute.get("/sortDes",userAuth.isLogin,userController.sortDescending)

// user profile
userRoute.get("/user-profile",userAuth.isLogin,userController.userProfile)
userRoute.get("/addressForm",addressController.loadAddAddress)
userRoute.post("/addAddress",addressController.addAddress)
userRoute.get("/editAddress",addressController.editAddress)
userRoute.post("/updateAddress",addressController.updateAddress)
userRoute.get("/deleteAddress/:id",addressController.deleteAddress)
userRoute.get("/editUser",userController.loadEditUser)
userRoute.post("/updateUser",userController.updateUser)
userRoute.get("/changePassword",userController.changePassword)
userRoute.post("/editPassword",userController.editPassword)
userRoute.post("/updateProfile",multer.uploadProfile.single('image'),userController.updateProfile)


// cart
userRoute.get("/cart",cartController.loadCartPage)
userRoute.post("/cart",cartController.addToCart)
userRoute.put("/updateCart",cartController.updateCartCount)
userRoute.delete("/removeCartItem",cartController.removeFromCart)

// checkout
userRoute.get("/checkOut",orderController.loadCheckOut)
userRoute.post("/checkOut",orderController.checkOutPost)
userRoute.post("/razorPay",orderController.razorPayLoad)
userRoute.get("/orderSuccess",orderController.loadOrderDetails)
userRoute.get("/orderDetails/:id",orderController.loadOrderHistory)
userRoute.get("/orderCancel",orderController.cancelOrder)
userRoute.get("/returnOrder",orderController.returnOrder)

// wishlist

userRoute.get("/loadWishList",wishlistController.loadWishlist)
userRoute.post("/addWishList",wishlistController.addToWishList)
userRoute.delete("/removeWishlist",wishlistController.removeWishlist)


// COUPON
userRoute.post("/validateCoupon",orderController.applyCoupon)


// forget password

userRoute.get("/loadForget",userController.loadForgetPassword)
userRoute.post("/forgetOtp",userController.sendOtp)
userRoute.get("/forgetOtp",userController.loadOtpForget)
userRoute.get("/loadOtpForget",userController.enterOtp)
userRoute.get("/resetPassword",userController.loadReset)
userRoute.post("/resetPassword",userController.updatePassword)
userRoute.post("/verifyOtp",userController.verifyForget)



// // logout 

userRoute.get('/logout',userAuth.isLogin,userController.userLogout)






module.exports = userRoute