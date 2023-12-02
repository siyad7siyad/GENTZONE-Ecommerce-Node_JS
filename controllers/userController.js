const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const Product = require("../model/productModel")
const message = require("../config/nodeMailer");
const Category = require('../model/categoryModel');
const Address = require("../model/addressModel")
const { AwsPage } = require("twilio/lib/rest/accounts/v1/credential/aws");
const multer = require("../middlewares/multer")


const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;rs

  } catch (error) {
    console.log(error.message);
  }
};

// get register
const loadRegister = async (req, res) => {
  try {
    res.render("user/register");
  } catch (error) {
    console.log(error.message);
  }
};

// post register
const insertUser = async (req, res) => {
  try {
  

    const email = req.body.email;
    const mobile = req.body.mobile;
    const name = req.body.name;

    const password = req.body.password;
    if (!email || !mobile || !name || !password) {
      return res.render("user/register", {
        message: "Please fill in all the fields",
      });
    }

    const existMail = await User.findOne({ email: email });
    // const existnumber = await User.findOne({ email: email });

    // if (existMail) {
    //   res.render("user/register", { message: "this user already exists" });
    // } else {
   
      req.session.userData = req.body;
      req.session.email = email;
      if (  req.session.email ) {
        res.redirect("/otp");
      }
     
    // }
  } catch (error) {
    console.log(error.message);
  }
};

// GET OTP PAGE
const loadOtp = async (req, res) => {


  try {
    const userData = req.session.userData;
    const email = userData.email;
    const data=await message.sendVarifyMail(req,email);
    res.render("user/otp");
  } catch (error) {
    console.log(error.message);
  }
};
// VERIFYOTP
const verifyOtp = async (req, res) => {
  try {
    const userData = req.session.userData;
    const firstDigit = req.body.otp;
    // const secondDigit = req.body.second;
    // const thirdDigit = req.body.third;
    // const fourthDigit = req.body.fourth;
    // const fullOTP = firstDigit + secondDigit + thirdDigit + fourthDigit;

console.log(firstDigit)
    if (firstDigit==req.session.otp ) {
      const secure_password = await securePassword(userData.password);
      const user = new User({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: secure_password,
        isAdmin: 0,
        is_blocked:1,
      });
      console.log(user);
      const userDataSave = await user.save();
      if (userDataSave &&userDataSave.isAdmin === 0) {
        res.redirect("/");
      } else {
        res.render("user/otp", { message: "Registration Failed" });
      }
    } else {
      res.render("user/otp", { message: "invailid otp" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


 const resendOTP = async (req, res) => {
  try {
    

    // Retrieve user data from session storage
    const userData = req.session.userData;

    if (!userData) {
      res.status(400).json({ message: "Invalid or expired session" });
    }

    // Generate and send new OTP using Twilio

    await message.sendVarifyMail(req,userData.email);

    res.render("user/otp", { message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.render("user/otp", { message: "Failed to send otp" });
  }
};


// GET LOGIN
const loadLogin = async (req, res) => {
  try {
    
    res.render("user/login");
  } catch (error) {
    console.log(error.message);
  }
};
// POST LOGIN
const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("gdhdg");

    if (!email ||!password) {
      return res.render("user/login", {
        message: "Please fill in all the fields",
      });
    }


    const userData = await User.findOne({ email: email });
// console.log(userData,"kkkkkllkk");
    if (userData) {
      
      const passwordMatch = await bcrypt.compare(password, userData.password);
      
      if (passwordMatch && userData.isAdmin === 0) {
        if(userData.isBlocked === 1){
          res.render("user/login",{message:"Your Account is Blocked!"})
        }
        // console.log(userData);
        req.session.user_id = userData._id;
        res.redirect("/");
      } else {
        res.render("user/login", {
          message: "email and password is incorrect",
        });
      }
    } else {
      res.render("user/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const loadHome = async (req, res) => {
  try {
    const userData =  req.session.user_id;
    const productData= await Product.find(); 
    res.render("user/home", {  products:productData, userData });
  } catch (error) {
    console.log(error.message);
  }
};




const userLogout = async (req, res) => {
  try {
    req.session.destroy();
// req.session.user_id = null
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};

//Load the product list at userside 

const loadItems = async(req,res)=>{
  try {
    const userData = req.session.user_id
    const productData = await Product.find()
    const categoryData = await Category.find()

    res.render("user/items",{user: userData,products:productData,category:categoryData})
    
  } catch (error) {
    console.log(error.message);
  }
}

const sortedAscending = async(req,res)=>{
  try {
    const userData = req.session.user_id
    const productData = await Product.find().sort({discount_Price:1})
    const categoryData = await Category.find()

    res.render("user/items",{user: userData,products:productData,category:categoryData})
    
  } catch (error) {
    console.log(error.message);
  }
}

const sortDescending = async(req,res)=>{
  try {
    const userData = req.session.user_id
    const productData = await Product.find().sort({discount_Price:-1})
    const categoryData = await Category.find()

    res.render("user/items",{user: userData,products:productData,category:categoryData})
    
  } catch (error) {
    console.log(error.message);
  }
}

// load single product details

const singleItems = async(req,res)=>{
  try {
    const userData = await User.findById({_id:req.session.user_id})
    const id = req.query.id
    const productData = await Product.findById({_id:id})

    res.render("user/singleItems",{user:userData,products:productData})


    
  } catch (error) {
    console.log(error.message);
  }
}

// user profile

const userProfile = async(req,res)=>{
  try {

    const id = req.session.user_id
    // console.log(id,"kkkkk

    const userData = await User.findById({_id:id})
    const addressData = await Address.find({user:id})

    
    
    
    res.render("user/userProfile",{user:userData,address:addressData})
    
  } catch (error) {
    console.log(error.message);
  }
}


//load forget password 

const loadForgetPassword = async(req,res)=>{
  try {

    res.render("user/forget")
    
  } catch (error) {
    console.log(error.message);
  }
}

// load otp of forget password

const loadOtpForget = async(req,res)=>{
  try {
    
    res.render("user/otpForgot")

  } catch (error) {
    console.log(error.message);
  }
}

// post otp forget

const sendOtp = async(req,res)=>{
  try {
    const {email} = req.body

    const existingUser = await User.findOne({email:email})

    if(existingUser){

      req.session.user_id = existingUser.id

      const data = await message.sendVarifyMail(req,email)

      res.redirect("/forgetOtp")

    }
    
  } catch (error) {
    console.log(error.message);
  }
}

// load enter otp

const enterOtp = async(req,res)=>{
  try {
    res.render("otpForget")
    
  } catch (error) {
    console.log(error.message);
  }
}

//load reset password

const loadReset = async(req,res)=>{
  try {
    res.render("user/resetPassword")
    
  } catch (error) {
    console.log(error.message);
  }
}

// update password

const updatePassword = async(req,res)=>{
  try {
    const user_id = req.session.user_id

    const password = req.body.password

    const secure_password = await securePassword(password)
    
    const updateData = await User.findByIdAndUpdate({_id:user_id},
      {$set:{
        password:secure_password
      }})

      if(updateData){
        res.redirect('/login')
      }

    
  } catch (error) {
    console.log(error.message);
  }
}

// verify forget password

const verifyForget = async(req,res)=>{
  try {
    

    const otp = req.body.otp

    if(otp==req.session.otp){
    
      res.redirect("/resetPassword")
    }

    
  } catch (error) {
    console.log(error.message);
  }
}

// load edit user

const loadEditUser = async(req,res)=>{
  try {

    const userId = req.session.user_id
    const userData = await User.findById(userId)

    if(userData){
      res.render("user/editUserProfile",{userData})
    }else{
      res.render("user/login")
    }

   
    
  } catch (error) {
    console.log(error.message);
  }
}

// update edit user
const updateUser = async (req, res) => {
  try {
    let id = req.body.user_id;
   
    const userId = req.session.user_id;

    const userData = await User.findById(id);

    const { name, mobile } = req.body;

    // Check if a file is uploaded before updating the image
    const updateEdit = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          mobile,
          ...(req.file && { image: req.file.filename }), // only update image if file is uploaded
        },
      },
      { new: true } // return the updated document
    );

    
    

    res.redirect("/user-profile");
  } catch (error) {
    console.log(error.message);
   
  }
};

// change user password

const changePassword = async(req,res)=>{
  try {

    res.render("user/passwordChange")
    
  } catch (error) {
    console.log(error.message);
  }
}

// edit password
const editPassword = async (req, res) => {
  try {
    console.log(req.session,"akakaka");
    const user_id = req.session.user_id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    console.log('User ID:', user_id);

    const user = await User.findById(user_id);

    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User is not found' });
    }

    console.log('User found:', user);

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      console.error('Invalid old password');
      return res.status(401).json({ error: 'Invalid old password' });
    }

    const secureNewPassword = await securePassword(newPassword);

    const updatePassword = await User.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: {
          password: secureNewPassword,
        },
      }
    );

    if (updatePassword) {
      console.log('Password updated successfully');
      res.redirect('/user-profile');
    } else {
      console.error('Password update failed');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// upload profile

const updateProfile = async (req, res) => {
  try {
   
    const id = req.query.id

    

    if(!req.file){




      const userData = await User.findByIdAndUpdate({_id:id},{
        $set:{
          name:req.body.name,
          email:req.body.email,
          mobile:req.body.mobile
        }
      })

    }else{
      const userData = await User.findByIdAndUpdate({_id:id},{
        $set:{
          image:req.file.filename
        }
      })
    }

    res.redirect("/user-profile")




  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  loadLogin,
  insertUser,
  loadRegister,
  loadHome,
  userLogout,
  loadOtp,
  verifyOtp,
  verifyLogin,
  resendOTP,
  loadItems,
  singleItems,
  userProfile,
  loadForgetPassword,
  loadOtpForget,
  sendOtp,
  enterOtp,
  loadReset,
  updatePassword,
  verifyForget,
  loadEditUser,
  updateUser,
  changePassword,
  editPassword,
  updateProfile,
  sortedAscending,
  sortDescending
 
};
