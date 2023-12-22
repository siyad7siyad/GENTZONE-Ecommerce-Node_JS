const User = require("../model/userModel");

const isLogin = async(req,res,next)=>{
    const userData = await User.findOne({ _id:req.session.admin_id });
    try{

        if(req.session.admin_id && userData.isAdmin==1){
            next();
        }else{
            res.redirect('/admin');
        }
    }catch(error){
        console.log(error.message);
    }
   
}

const isLogout = async(req,res,next)=>{
    const userData = await User.findOne({ _id:req.session.admin_id });
    try{
        if(req.session.admin_id && userData.isAdmin==1){
             res.redirect('/admin/home');
        }
        else{
            next()
        }
    }catch(error){
        console.log(error.message);
    }
}


module.exports ={
    isLogin,
    isLogout
}