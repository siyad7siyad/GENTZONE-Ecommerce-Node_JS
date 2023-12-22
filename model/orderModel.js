const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  shipping:{
    type:String,
    default:'Free Shipping'
},
  status: {
    type: String,
    default: 'pending',
  },
  reason:{
    type:String
  },
  totalAmount :{
    type:Number,
    require:true,
  },
  paymentMethod: {
    type:String,
    require:true,
  },
  paymentStatus:{
    type:String,
    default:'Pending'
  },

  randomId:{
    type:String,
    default:randomOrderId,
   
  }
 ,
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
      price: Number,
    },
  ],
});

function randomOrderId() {

  const characters = '1234567890';
  const codeLength = 4;
  let referralCode = '';
  for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      referralCode += characters.charAt(randomIndex);
  }
  return referralCode;
  }



module.exports = mongoose.model('Order', orderSchema);
