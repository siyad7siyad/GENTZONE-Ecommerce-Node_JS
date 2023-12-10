const User = require("../model/userModel")
const Address = require("../model/addressModel")

// load add address form

const loadAddAddress = async(req,res)=>{
  try {
    const userId = req.session.user_id

    const userData = await User.findById(userId)

    if(userData){
      res.render("user/addAddress",{})
    }else{
      res.redirect("/login")
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

// add address post

const addAddress = async(req,res)=>{
  try {

    const userId = req.session.user_id

    const{houseName,street,city,state,pincode} = req.body

    const address = new Address({
      user:userId,
      houseName,
      street,
      city,
      state,
      pincode

    })

    const addressData = await address.save()

    res.redirect("/user-profile") 

    
  } catch (error) {
    console.log(error.message);
  }
}

// edit address 

const  editAddress = async(req,res)=>{
  try {
    
    const userId = req.session.user_id
    const userData = await User.findById(userId)

    const id = req.query.id
    const address = await Address.findById(id)
   
    res.render("user/editAddress",{userData,Address:address})



  } catch (error) {
    console.log(error.message);
  }
}

// update edit address 

const updateAddress = async(req,res)=>{
  try {

    const id = req.body.address_id

    const {houseName,street,city,state,pincode} = req.body

    const updateAddress = await Address.findByIdAndUpdate({_id:id},{
      $set:{
        houseName,
        street,
        city,
        state,
        pincode
      }
    })

    res.redirect("/user-profile")

    
  } catch (error) {
    console.log(error.message);
  }
}

// delete address
const deleteAddress = async (req, res) => {
  try {
      const id = req.params.id;

      const addressData = await Address.findByIdAndUpdate(
          { _id: id },
          {
              $set: {
                  is_listed: false,
              },
          }
      );

      // Send a 204 No Content status indicating success without a response body
      res.status(200).json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: 'Error occurred while deleting address' });
  }
};





module.exports = {
  loadAddAddress,
  addAddress,
  editAddress,
  updateAddress,
  deleteAddress
  
}