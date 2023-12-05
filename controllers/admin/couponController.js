const Coupon = require("../../model/couponModel")
const User = require("../../model/userModel")

// load coupon 

const loadCoupon = async(req,res)=>{
    try {
        const coupon = await Coupon.find()
        res.render("coupon",{coupon})
        
    } catch (error) {
        console.log("error to load coupon page",error);
    }
}

// load ADD coupon


const loadAddCoupon = async(req,res)=>{
    try {

      
        res.render("addCoupon")
        
    } catch (error) {
        console.log(error.message);
    }
}


// post coupon

const addCoupon = async (req, res) => {
    try {
        if (!req.body.couponId || !req.body.description || !req.body.offerPrice) {
            return res.render("addCoupon");
        }
        console.log("dhgfgghjghjg");

        let customExpiryDate = new Date(req.body.expiryDate);

        if (isNaN(customExpiryDate.getTime())) {
            const currentMonth = new Date().getMonth();
            const newExpiryDate = new Date();
            newExpiryDate.setMonth(currentMonth + 1);
            customExpiryDate = newExpiryDate;
        }   

        const coupon = new Coupon({
            couponId: req.body.couponId,
            description: req.body.description,
            offerPrice: req.body.offerPrice,
            minimumAmount: req.body.minimumAmount,
            createdOn: Date.now(),
            expiryDate: customExpiryDate,
        });

        const couponData = await coupon.save();
        console.log(coupon,"aaa");
        res.redirect("/admin/loadCoupon");
    } catch (error) {
        console.log(error.message);
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
            const coupon = await Coupon.findByIdAndUpdate(
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