const bcrypt = require("bcrypt")
const User = require("../../model/userModel")

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
        req.session.user_id = userData._id
        res.render('home')

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

const loadHome = async(req,res)=>{
  try {

    const userData = await User.findById(req.session.user_id)
    if(userData){
      res.render('home',{admin:userData})
    }else{
      res.status(404).send("User not found")
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