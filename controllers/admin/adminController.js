const bcrypt = require("bcrypt")
const User = require("../../model/userModel")
const Order = require("../../model/orderModel")
const Product = require("../../model/productModel")
const Category = require("../../model/categoryModel")
const {getMonthlyDataArray,getDailyDataArray,getYearlyDataArray} = require("../../config/chartData")
const { get } = require("mongoose")

// load admin login

const loadAdminLogin = async(req,res)=>{
  try {
    res.render('login')
    
  } catch (error) {
    console.log(error.message);
  }
}

// verify admin login

const verifyLogin = async(req,res)=>{
  try {
    const {email,password} = req.body

    const userData = await User.findOne({email:email})

    if(userData){
      const passwordMatch = await bcrypt.compare(password,userData.password)

      if(passwordMatch && userData.isAdmin === 1){
        req.session.admin_id = userData._id
        res.redirect('admin/home')

      }else{
        res.render('login',{message:"invailid password and username"})
      }

    }else{
      res.render('login')
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

// load home

// const loadHome = async(req,res)=>{
//   try {

//     const userData = await User.findById(req.session.user_id)
//     if(userData){
//       res.render('home',{admin:userData})
//     }else{
//       res.status(404).send("User not found")
//     }

//   } catch (error) {
//     console.log(error.message);
//   }
// }
const loadHome = async (req, res) => {
  try {
    let query = {}
    const userData = await User.findById(req.session.user_id)

    let totalRevanue = await Order.aggregate([
      { $match: { paymentStatus: "success" } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
    ])

    // Ensure totalRevanue is always an array, even if the aggregation fails
    totalRevanue = totalRevanue || [];

    console.log(totalRevanue);

    const totalUsers = await User.countDocuments({ isBlocked: 1 })
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalCategories = await Category.countDocuments()
    const orders = await Order.find().populate("user").limit(10).sort({ orderDate: -1 })
    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          paymentStatus: "success",
          orderDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, monthlyAmount: { $sum: "$totalAmount" } } },
    ])

    console.log(monthlyEarnings);
    console.log(monthlyEarnings);
    const totalRevanueValue = totalRevanue.length > 0 ? totalRevanue[0].totalAmount : 0
    const monthlyEarningValue = monthlyEarnings.length > 0 ? monthlyEarnings[0].monthlyAmount : 0
    const newUsers = await User.find({ isBlocked: 1, isAdmin: 0 }).sort({ date: -1 }).limit(5)

    // get monthly data
    const monthlyDataArray = await getMonthlyDataArray()
    // get daily Data
    const dailyDataArray = await getDailyDataArray()
    // get yearly data
    const yearlyDataArray = await getYearlyDataArray()

    const monthlyOrdersCount = monthlyDataArray.map((item) => item.count)
    const dailyOrdersCount = dailyDataArray.map((item) => item.count)
    const yearlyOrdesCount = yearlyDataArray.map((item) => item.count)
    
    if (dailyDataArray && monthlyDataArray && yearlyDataArray )
    {
      res.render("home", {
        admin: userData,
        totalUsers,
        totalOrders,
        totalProducts,
        totalCategories,
        totalRevanueValue,
        orders,
        newUsers,
        monthlyEarningValue,
        monthlyOrdersCount,
        dailyOrdersCount,
        yearlyOrdesCount,
      })

    }else{
      console.log("error")
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

// load user page

const loadUserPage = async(req,res)=>{
  try {
    const userData = await User.find({isAdmin:0})
    res.render("userDashboard",{users:userData})
    
  } catch (error) {
    console.log(error.message);
  }
}

// list user

const listUser = async (req, res) => {
  try {
    const id = req.query.id;
// console.log(id,"lll444");

const UserData = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { isBlocked: 0 } },
      { new: true } // Return the modified document
    );
    res.redirect("/admin/userData")

    
  } catch (error) {
    console.log(error.message);
  }
}
// unlist user

const unlistUser = async (req, res) => {
  try {
    const id = req.query.id;
    // console.log(id,"lll");
    const userData = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { isBlocked: 1 } },
      { new: true } // Return the modified document
    );
    res.redirect("/admin/userData")

    
  } catch (error) {
    console.log(error.message);
  }
}




// logout

const adminLogout = async(req,res)=>{
  try {
    req.session.destroy()
    // req.session.isAdmin == null
    res.redirect('/admin')
    
  } catch (error) {
    console.log(error.message);
  }
}



module.exports = {
  loadAdminLogin,
  verifyLogin,
  loadHome,
  adminLogout,
  loadUserPage,
  listUser,
  unlistUser
}