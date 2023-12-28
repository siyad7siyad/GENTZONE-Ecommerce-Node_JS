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
userRoute.post('/register',userAuth.isLogout,userController.insertUser)
userRoute.get('/otp',userAuth.isLogout,userController.loadOtp)
userRoute.post('/otp',userAuth.isLogout,userController.verifyOtp)
userRoute.get('/resendOtp',userAuth.isLogout,userController.resendOTP)

// user login
userRoute.get('/login',userAuth.isLogout,userController.loadLogin);
userRoute.post('/login',userController.verifyLogin);

// home page
userRoute.get('/',userController.loadHome);
userRoute.get("/about",userAuth.isLogin,userController.loadAbout)
userRoute.get("/items",userAuth.isLogin,userController.loadItems)
userRoute.get("/single-items",userAuth.isLogin,userController.singleItems)
userRoute.post("/filterPrice",userAuth.isLogin,userController.filterByPrice)
userRoute.get("/loadContact",userAuth.isLogin,userController.loadContact)


// user profile
userRoute.get("/user-profile",userAuth.isLogin,userController.userProfile)
userRoute.get("/addressForm",userAuth.isLogin,addressController.loadAddAddress)
userRoute.post("/addAddress",userAuth.isLogin,addressController.addAddress)
userRoute.get("/editAddress",userAuth.isLogin,addressController.editAddress)
userRoute.post("/updateAddress",userAuth.isLogin,addressController.updateAddress)
userRoute.get("/deleteAddress/:id",userAuth.isLogin,addressController.deleteAddress)
userRoute.get("/editUser",userAuth.isLogin,userController.loadEditUser)
userRoute.post("/updateUser",userAuth.isLogin,userController.updateUser)
userRoute.get("/changePassword",userAuth.isLogin,userController.changePassword)
userRoute.post("/editPassword",userAuth.isLogin,userController.editPassword)
userRoute.post("/updateProfile",userAuth.isLogin,userController.updateProfile)
userRoute.post("/updateProfilePic",userAuth.isLogin,multer.uploadProfile.single('croppedImage'),userController.updateUserProfilepic)


// cart
userRoute.get("/cart",userAuth.isLogin,cartController.loadCartPage)
userRoute.post("/cart",userAuth.isLogin,cartController.addToCart)
userRoute.put("/updateCart",userAuth.isLogin,cartController.updateCartCount)
userRoute.delete("/removeCartItem",userAuth.isLogin,cartController.removeFromCart)

// checkout
userRoute.get("/checkOut",userAuth.isLogin,orderController.loadCheckOut)
userRoute.post("/checkOut",userAuth.isLogin,orderController.checkOutPost)
userRoute.post("/razorPay",userAuth.isLogin,orderController.razorPayLoad)
userRoute.get("/orderSuccess",userAuth.isLogin,orderController.loadOrderDetails)
userRoute.get("/orderDetails/:id",userAuth.isLogin,orderController.loadOrderHistory)
userRoute.get("/orderCancel",userAuth.isLogin,orderController.cancelOrder)
userRoute.get("/returnOrder",userAuth.isLogin,orderController.returnOrder)

// wishlist

userRoute.get("/loadWishList",userAuth.isLogin,wishlistController.loadWishlist)
userRoute.post("/addWishList",userAuth.isLogin,wishlistController.addToWishList)
userRoute.delete("/removeWishlist",userAuth.isLogin,wishlistController.removeWishlist)


// COUPON
userRoute.post("/validateCoupon",userAuth.isLogin,orderController.applyCoupon)


// forget password

userRoute.get("/loadForget",userAuth.isLogin,userController.loadForgetPassword)
userRoute.post("/forgetOtp",userAuth.isLogin,userController.sendOtp)
userRoute.get("/forgetOtp",userAuth.isLogin,userController.loadOtpForget)
userRoute.get("/loadOtpForget",userAuth.isLogin,userController.enterOtp)
userRoute.get("/resetPassword",userAuth.isLogin,userController.loadReset)
userRoute.post("/resetPassword",userAuth.isLogin,userController.updatePassword)
userRoute.post("/verifyOtp",userAuth.isLogin,userController.verifyForget)



// // logout 

userRoute.get('/logout',userController.userLogout)






module.exports = userRoute