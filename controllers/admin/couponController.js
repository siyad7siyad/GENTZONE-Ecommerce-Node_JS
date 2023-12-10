const Coupon = require("../../model/couponModel")
const User = require("../../model/userModel")

// load coupon 

    const loadCoupon = async (req, res) => {
        try {
            const coupons = await Coupon.find();
            res.render("coupon", { coupons: coupons }); // Change 'coupon' to 'coupons'
        } catch (error) {
            console.log("error to load coupon page", error);
        }
    };

// load ADD coupon


const loadAddCoupon = async(req,res)=>{
    try {
        const coupon= await Coupon.find()
      
        res.render("addCoupon")
        
    } catch (error) {
        console.log(error.message);
    }
}


// post coupon

    const addCoupon = async (req, res) => {
        try {
            const { couponCode, discountPercentage, expiryDate } = req.body;

            // Check if the coupon code already exists
            const existingCoupon = await Coupon.findOne({ couponCode });

            if (existingCoupon) {
                // Coupon code already exists, respond with an error
                return res.status(400).json({ success: false, message: 'Coupon code already exists.' });
            }

            // Coupon code does not exist, proceed with adding the coupon
            const coupon = new Coupon({
                couponCode,
                discountPercentage,
                expiryDate
            });

            await coupon.save();

            // Respond with success
            return res.status(200).json({ success: true, message: 'Coupon added successfully.' });
        } catch (error) {
            console.log(error.message);
            // Handle other errors
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
// load edit Coupon

const loadEditCoupon = async(req,res)=>{
    try {

        const id = req.query.id
        const coupon = await Coupon.findById(id)

        res.render("editCoupon",{coupon})

        
    } catch (error) {
        console.log(error.message);
    }
}

// update Coupon 

const updateCoupon = async(req,res)=>{
    try {

        const id = req.body.coupon_id
        const updateCoupon = await Coupon.findById(id)

        if(req.body.couponId){
            updateCoupon.couponId = req.body.couponId
        }
        if(req.body.description){
            updateCoupon.description = req.body.description
        }
        if(req.body.offerPrice){
            updateCoupon.offerPrice = req.body.offerPrice
        }
        if(req.body.minimumAmount){
            updateCoupon.minimumAmount = req.body.minimumAmount
        }
        if(req.body.expiryDate){
            updateCoupon.expiryDate = req.body.expiryDate
        }

        await updateCoupon.save()

        res.redirect("/admin/loadCoupon")

        
    } catch (error) {
        console.log(error.message);
    }
}

// delete coupon

    const deleteCoupon = async(req,res)=>{
        try {

            const id = req.params.id
            console.log(id);
            const coupon = await Coupon.findByIdAndDelete(
                {_id:id}, { $set: { is_listed: false } });


            
            res.status(200).json({ success: true, message: 'Order placed successfully' });
            


            
        } catch (error) {
            console.log('Error:', error);
            res.status(500).json({ success: false, error: 'Error occurred while deleting address' });
        
        }
    }




module.exports = {
    loadCoupon,
    loadAddCoupon,
    addCoupon,
    loadEditCoupon,
    updateCoupon,
    deleteCoupon
    
}