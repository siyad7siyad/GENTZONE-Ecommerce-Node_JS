const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const Product = require("../model/productModel")
const message = require("../config/nodeMailer");
const Category = require('../model/categoryModel');
const Address = require("../model/addressModel")
const { AwsPage } = require("twilio/lib/rest/accounts/v1/credential/aws");
const multer = require("../middlewares/multer")
const Cart = require("../model/cartModel")
const Banner = require('../model/bannerModel')
const Wishlist = require("../model/wishListModel")


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
    
   const referral = req.query.referralCode
    res.render("user/register",{referral});
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

    req.session.referralCode = req.body.referralCode || null

    const referralCode = req.session.referralCode

    

    const existMail = await User.findOne({ email: email });
    // const existnumber = await User.findOne({ email: email });


    if(referralCode){
      referror = await User.findOne({referralCode})

      if(!referror){
        res.render("user/register",{message:"invalid referal code"})
      }

      if(referror.userRefered.includes(req.body.email)){
        res.render("user/register",{message:"this referal code is already exist"})

      }

    }



    if (existMail) {
      res.render("user/register", { message: "this user already exists" });
    } else {
   
      req.session.userData = req.body;
      req.session.email = email;
      if (  req.session.email ) {
        res.redirect("/otp");
      }
     
    }
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
    res.render("user/otp",);
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
      
      const userDataSave = await user.save();
      if (userDataSave &&userDataSave.isAdmin === 0) {

        if(req.session.referralCode){
          const userData = await User.findOne({ _id: userDataSave._id});
          if(userData){
            userData.walletBalance +=50
            await userData.save()
          }
        
        }

        const referror = await User.findOne({
          referralCode :req.session.referralCode
        })
        const userData = await User.findOne({ _id: req.session.user_id });
        referror.userRefered.push(user.email) 
        referror.walletBalance +=100
        await referror.save()

      




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
    const banner = await Banner.find()

    const cartCount = await Cart.find({user:userData})

    const wishList = await Wishlist.find({user:userData})

console.log(wishList,"wishList");
    res.render("user/home", {  products:productData, userData,banner,wishList,cartCount});
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


const loadItems = async (req, res) => {
  try {
      const userData = req.session.user_id;

      
      const categoryData = await Category.find();

     
      const selectedCategory = req.query.categoryName;

     
      const categoryFilter = selectedCategory ? { category: selectedCategory } : {};

      const wishList = await Wishlist.find({user:userData})

      const cartCount = await Cart.find({user:userData})
       
      
      
      
      const sort = req.query.sort
      let sortOption = {};
      if (sort === 'asc') {
          sortOption = { offerPrice: 1 }; 
      } else if (sort === 'dsc') {
          sortOption = { offerPrice: -1 }; 
      } else {
          
          sortOption = {};
      }
      const page = req.query.page ||1
      const itemsPerPage=6
      const totalProducts=await Product.countDocuments({...categoryFilter})
      const totalPages =Math.ceil(totalProducts/itemsPerPage)
      
      const options = {
          page : page,
          limit :itemsPerPage,
          sort:sortOption
      }


      
      const productData = await Product.paginate({...categoryFilter},options);
      

      res.render('user/items', {
          user: userData,
          products: productData.docs,
          category: categoryData,
          selectedCategory: selectedCategory, 
          totalPages:totalPages,
          currentPage:productData.page,
          wishList,
          cartCount
      });
  } catch (error) {
      console.log(error);
  }
};



//Load the product list at userside 

 // Adjust the number based on your preference

// const loadItems = async (req, res) => {
//   try {
//     const userData = req.session.user_id;


//     const page = parseInt(req.query.page) || 1;




//     const totalProducts = await Product.countDocuments();
//     const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

//     const productData = await Product.find()
//       .skip((page - 1) * ITEMS_PER_PAGE)
//       .limit(ITEMS_PER_PAGE);

//     const categoryData = await Category.find();

//     res.render("user/items", {
//       user: userData,
//       products: productData,
//       category: categoryData,
//       currentPage: page,
//       totalPages: totalPages,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };






// load single product details

const singleItems = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id })
    const id = req.query.id
    const productData = await Product.findById({ _id: id })

    const wishList = await Wishlist.find({user:userData})
    const cartCount = await Cart.find({user:userData})

    let existingCartItem = false;

    const existingCart = await Cart.findOne({ user: req.session.user_id }) // Use req.session.user_id to find the cart for the current user
    if (existingCart) {
       existingCartItem = existingCart.items.find((item) => item.product.toString() === id)
      if (existingCartItem) {
        // If the item exists in the cart, set existingCartItem to true
        existingCartItem = true;
      }
    }

    res.render("user/singleItems", { user: userData, products: productData, existingCartItem,wishList,cartCount })
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

    const wishList = await Wishlist.find({user:id})
    const cartCount = await Cart.find({user:id})

    
    
    
    res.render("user/userProfile",{user:userData,address:addressData,wishList,cartCount})
    
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

    const wishList = await Wishlist.find({user:userId})
    const cartCount = await Cart.find({user:userId})

    if(userData){
      res.render("user/editUserProfile",{userData,wishList,cartCount})
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

    

    




      const userData = await User.findByIdAndUpdate({_id:id},{
        $set:{
          name:req.body.name,
          email:req.body.email,
          mobile:req.body.mobile
        }
      })

    

    res.redirect("/user-profile")




  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

  const updateUserProfilepic = async (req, res) => {
    try{

      console.log("AAAAAAAAAAAAAAAAA");

      const userData = await User.findById({ _id: req.session.user_id });
      const productData = await Product.find(); 
      const addressData = await Address.find();
      
      const croppedImage = req.file.filename;
      
      await User.findByIdAndUpdate({ _id: userData.id },{
        $set: {
          image: croppedImage,
        },
      })
      res.status(200).json({ success: true, message: 'Profile Picture changed' });
    } catch (error) {
      console.log(error);
    }
  }


  const loadAbout = async(req,res)=>{
    try {


      const userId = req.session.user_id
      const userData = await User.findById(userId)

      const cartCount = await Cart.find({user:userId})

      const wishList = await Wishlist.find({user:userId})

      res.render("user/about",{cartCount,wishList})

      
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadContact = async(req,res)=>{
    try {
      
      const userId = req.session.user_id
      const userData = await User.findById(userId)

      const cartCount = await Cart.find({user:userId})

      const wishList = await Wishlist.find({user:userId})

      res.render("user/contact",{cartCount,wishList})



    } catch (error) {
      console.log(error.message);
    }
  }

  const filterByPrice = async(req, res) => {
    try {
      // Retrieve the selected price range from the form data

      const user = await User.findById(req.session.user_id)
      const products = await Product.find({})

      const wishList = await Wishlist.find({user:user})
      const cartCount = await Cart.find({user:user})



      const selectedRange = req.body.price_range;

      console.log(selectedRange);
  
      // Implement logic to filter data based on the selectedRange
      let filteredData = [];
  
      switch (selectedRange) {
        case 'range1':
          filteredData = products.filter(item => item.offerPrice <= 1000);
          break;
        case 'range2':
          filteredData = products.filter(item => item.offerPrice > 1000 && item.offerPrice <= 2000);
          break;
        case 'range3':
          filteredData = products.filter(item => item.offerPrice > 2000 && item.offerPrice <= 5000);
          break;
        case 'range4':
          filteredData = products.filter(item => item.offerPrice > 5000);
          break;
        default:
          // Handle other cases or set a default behavior
          break;
      }
console.log(filteredData,"aaaaaa");
  
      // Send the filtered data back to the client
      res.json(filteredData);
      // res.render("user/items",{filteredData,wishList,cartCount})
    
    } catch (error) {
      console.error('Error filtering data:', error);
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
  updateUserProfilepic,
  loadAbout,
  filterByPrice,
  loadContact
 
};
