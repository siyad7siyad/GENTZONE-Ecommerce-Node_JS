const Product = require("../../model/productModel")
const Category = require("../../model/categoryModel")
const Offer = require("../../model/offerModel")


const loadOfferAdd = async(req,res)=>{
  
  try {
    const admin = req.session.userData
    const product = await Product.find().sort({date:-1})
    console.log(product,"product");
    const category = await Category.find().sort({date:-1})
    res.render("offerAdd",{admin,product,category})
    


  } catch (error) {
    console.log(error.message);
  }
}

// add offer

const addOffer = async(req,res)=>{
  try {

    const admin = req.session.user_id

    const{
      name,
      discountOn,
      discountType,
      discountValue,
      maxAmt,
      startDate,
      endDate,
      discountedProduct,
      discountedCategory
    } = req.body

console.log(req.body,"req.body");

    const existingNameOffer = await Offer.findOne({ name });

    const existingProductOffer = discountedProduct && (await Offer.findOne({discountedProduct}))
    const existingCategoryOffer = discountedCategory && (await Offer.findOne({discountedCategory}))

    if(existingNameOffer){
      res.status(400).json({success:false,error:"Duplicate name offer is not allowed"})
    }

    if(existingProductOffer){
      res.status(400).json({success:false,error:"this product offer is alraedy exist"})
    }

    if(existingCategoryOffer){
      res.status(400).json({success:false,error:"this Catgory offer is alraedy exist"})
    }

    const newOffer = new Offer({
      name,
      discountOn,
      discountType,
      discountValue,
      maxAmt,
      startDate,
      endDate,
      discountedProduct:discountedProduct?discountedProduct:null,
      discountedCategory:discountedCategory?discountedCategory:null
    })

    const data=await newOffer.save()

    if(discountedProduct){

      const discountedProductData = await Product.findById(discountedProduct)
      console.log(discountedProductData,"discountedProductData");

      let discount = 0

      if(discountType === "percentage"){
        discount = (discountedProductData.price*discountValue)/100
      }
      else if(discountType === "fixed Amount"){
        discount = discountValue
      }
console.log(discount);
      await Product.updateOne({_id:discountedProduct},{
        $set:{

          discountPrice:calculateDiscountPrice(
            discountedProductData.price,
            discountType,
            discountValue
          ),
          discount,
          discountStart:startDate,
          discountEnd:endDate,
          discountStatus:true

        }
      })

    }
    else if(discountedCategory){
console.log(discountedCategory,"discountedCategory");
      const categoryData = await Category.findById(discountedCategory)

      const data = await Category.updateOne({_id:discountedCategory},{
        $set:{

          discountType,
          discountValue,
          discountStart: startDate,
          discountEnd: endDate,
          discountStatus: true,
          

        }
      })
      const discountedProductData = await Product.find({category:categoryData._id})
console.log,(discountedProductData,"discountedProductData");
     for(const product of discountedProductData){

      let discount = 0

      if(discountType === "percentage"){
        discount = (product.price*discountValue)/100
      }
      else if(discountType === "fixed Amount"){
        discount = discountValue
      }

 const productvalue=await Product.updateOne({_id:Product._id},{
        $set:{
          discountPrice:calculateDiscountPrice(product.price,discountType,discountValue),
          discount,
          discountStart:startDate,
          discountEnd:endDate,
         
          discountStatus:true
        }
      })

     }


    }
    return res.status(200).json({success:true,message:"offer added succesfully"})



    
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({success:false,error:"error occured while add the offer"})
  }
}

// helper function

function calculateDiscountPrice(price,discountValue,discountType){

  let discountedPrice = price

  if(discountType === "percentage"){
    discountedPrice -=(price*discountValue)/100
  }
  else if(discountType === "fixed Amount"){
    discountedPrice -= discountValue
  }

  return discountedPrice


}




const loadOfferList = async(req,res)=>{
  try {
    const admin = req.session.userData
    const page = parseInt(req.query.page) || 1;

    let query = {}
    const limit = 7
    const totalCount = await Offer.countDocuments(query)
    const totalPages = Math.ceil(totalCount / limit);

    if(req.query.discountOn){
      if(req.query.discountOn==="product"){
        query.discountOn = "product"
      }else if(req.query.discountOn){
        if(req.query.discountOn==="category"){
          query.discountOn = "category"
        }
      }
    }
    const offer = await Offer.find(query)
    .populate("discountedProduct")
    .populate("discountedCategory")
    .skip((page - 1) * limit)
      .limit(limit)
      .sort({ startDate: -1 });

      res.render("OfferList",{offer,admin:admin,totalPages,currentPage:page})

    
  } catch (error) {
    console.log(error.message);
  }
}

const loadOfferEdit = async(req,res)=>{
  try {

    const product = await Product.find().sort({date:-1})
    const category = await Category.find().sort({date:-1})
    const offerId = req.query.offerId
    const admin = req.session.userData

    const offer = await Offer.findById(offerId)
    .populate("discountedProduct")
    .populate("discountedCategory")

    const startDate = new Date(offer.startDate).toISOString().split("T")[0];
    const endDate = new Date(offer.endDate).toISOString().split("T")[0];

    res.render("editOffer",{admin,offer,product,category,startDate,endDate})

    
  } catch (error) {
    console.log(error.message);
  }
}


module.exports = {
  // loadOfferAdd,
  // addOffer,
  // loadOfferList,
  // loadOfferEdit
}