const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const Product =new mongoose.Schema({

  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  image:[{
    type:String,
    required:true
  }],
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:true,
  },
  brand:{
    type:String,
    required:true
  },
  
  discount_Price: {
    type: Number,
    required: true,
  },
    
  price: {
    type: Number,
    required: true,
  },
  sizes:[{
    size:String,
    stock:Number
  }],
  productColor:{
    type:String,
    required:true
  },
  gender:{
    type:String,
    required:true
  },
  productAddDate:{
    type:Date,
    default:Date.now()
  },
  is_listed:{
    type:Boolean,
    default:true
  },
  couponApplied:{
    type:Boolean,
    default:false
  },
  


})

module.exports = mongoose.model("Product",Product)