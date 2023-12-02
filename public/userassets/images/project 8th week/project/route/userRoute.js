const express=require('express');
const userRoute=express();
const userControler=require('../controller/user/userController')
const userAuth=require('../middleware/userAuth')

//  registeration
userRoute.get('/register',userAuth.islogout,userControler.loadRegister );
userRoute.post('/register',userControler.insertUser );
userRoute.get('/otp',userControler.loadOtp );
userRoute.post('/otp',userControler.verifyOtp );
userRoute.get('/resendOTP',userControler.resendOTP );
userRoute.get('/logout',userControler.userLogout );




// user login
userRoute.get('/login',userAuth.islogout,userControler.loadLogin );
userRoute.post('/login',userControler.verifyLogin );
// userRoute.post('/',userControler.verifyLogin );
// home
userRoute.get('/',userControler.loadHome );
userRoute.get('/shop',userControler.loadShop );
userRoute.get('/singleProduct/:id',userControler.loadSingleShop );
// userRoute.get('/logout',userAuth.islogin,userControler.userLogout );


module.exports=userRoute