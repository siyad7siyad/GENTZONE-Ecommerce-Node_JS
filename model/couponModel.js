const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        // unique: true,
    },
    discountPercentage: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: Date,
        default:Date.now()
    },
    status: {
        type: String,
        default:"Active"
     
    },
 

 
});




module.exports = mongoose.model("Coupon",couponSchema)