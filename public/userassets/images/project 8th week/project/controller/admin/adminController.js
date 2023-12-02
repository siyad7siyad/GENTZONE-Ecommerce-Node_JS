const bcrypt = require("bcrypt");
const User = require("../../model/userModel");


const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin/login");
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  console.log("hellloo");
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch && userData.isAdmin === 1) {
        req.session.user_id = userData._id;
        res.redirect("/admin/home");
      } else {
        res.render("admin/login", {
          message: "Email and password are incorrect",
        });
      }
    } else {
      res.render("admin/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    const userData = await User.findById(req.session.user_id);
    if (userData) {
      res.render("admin/adminHome", { admin: userData });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
  }
};



const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
  }
};

module.exports = {
  loadAdminLogin,
  verifyLogin,
  loadHome,
  adminLogout,

  

};
