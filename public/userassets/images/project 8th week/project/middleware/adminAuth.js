const User = require("../model/userModel");



const isLogin = async (req, res, next) => {
  
    try {
        console.log(req.session.user_id,"lll2");
        const userData = await User.findOne({ _id: req.session.user_id });
        console.log(userData,"llllllx");
        if (req.session.user_id  && userData.isAdmin==1 ) {
         
              next();

        } else {
            res.redirect('/admin');
        }
      

    } catch (error) {
        console.log(error.message);
    }

}



const isLogout = async (req, res, next) => {
    try {

        const userData = await User.findOne({ _id: req.session.user_id });
   
        if (req.session.user_id && userData.isAdmin==1  ) {
            res.redirect('/admin/home');
        }else{

         

              next();

        }
       

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    isLogin,
    isLogout,
}