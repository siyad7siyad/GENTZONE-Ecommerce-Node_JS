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
  salePrice:{
    type: Number,
   
  },
  offerPrice:{
    type:Number,
  
  },
  discountStatus:{
    type:Boolean,
    default:false
  },
  discount:Number,
  discountStart:Date,
  discountEnd:Date
  


})
Product.plugin(mongoosePaginate)
module.exports = mongoose.model("Product",Product)