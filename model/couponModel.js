const mongoose = require("mongoose")

const couponSchema = mongoose.Schema({

  couponId:{
    type:String,
    required:true,
    unique:true
  },
  description:{
    type:String,
    required:true
  },
  offerPrice:{
    type:Number,
    required:true
  },
  minimumAmount:{
    type:Number,
    required:true
  },
  createdOn:{
    type: Date,
    default: () => Date.now()
  },
  
  expiryDate:{
    type:Date,
    required:true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   
    },
    is_listed:{
      type:Boolean,
      default:true
    }
   
  }

)

module.exports = mongoose.model("Coupon",couponSchema)