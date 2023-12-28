const Product = require("../../model/productModel")
const Category = require("../../model/categoryModel")
const User = require("../../model/userModel")

const loadProductOffer = async(req,res)=>{
  try {

    const product = await Product.find()
    const adminData = await User.findById({_id:req.session.admin_id})

    res.render("productOffer",{product,admin:adminData})

    
  } catch (error) {
    console.log(error,"error loading product offer page");
  }
}
const updateProductOffer = async (req, res) => {
  try {
    let { id, offerPrice } = req.body;
    const userId = req.session.user_id;

    // Parse offerPrice to an integer
    offerPrice = parseInt(offerPrice, 10);

    // Find the product by its id
    const product = await Product.findById(id);
    if (!product) {
      // Handle the case where the product with the given id is not found
      return res.status(404).json({ error: 'Product not found' });
    }

    let users = await User.find({});
    const cappedPercentage = Math.min(offerPrice);
    const percentage = (product.price * cappedPercentage) / 100;
    
    // Calculate and set the offerPrice and offerPercentage for the product
    product.offerPrice = Math.round(product.price - percentage);
    product.offerPercentage = cappedPercentage;

    // Update users' carts with the new offerPrice for the product
    users.forEach(async (user) => {
      user.cart?.forEach((cart) => {
        // Use strict equality check to match product IDs
        if (cart.productId.toString() === product._id.toString()) {
          cart.product.offerPrice = product.offerPrice;
        }
      });

      // Update the user's cart in the database
      await User.findByIdAndUpdate(user._id, {
        $set: {
          cart: user.cart,
        },
      });
    });

    // Save the updated product
    await product.save();

    res.redirect("/admin/loadProductOffer");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const loadCategoryoffer = async(req,res)=>{
  try {

    const categories = await Category.find()
    const adminData = await User.findById({_id:req.session.admin_id})

    const itemsperpage = 8;
    const currentpage = parseInt(req.query.page) || 1;
    const startindex = (currentpage - 1) * itemsperpage;
    const endindex = startindex + itemsperpage;
    const totalpages = Math.ceil(categories.length / 8);
    const currentproduct = categories.slice(startindex, endindex);

    res.render("categoryOffer",{
      categories: currentproduct,
      totalpages,
      currentpage,
      admin: adminData
    })


    
  } catch (error) {
    console.log(error.message);
  }
}

const updateCategoryOffer = async(req,res)=>{
  try {
    let {id,offerPercentage} = req.body

    const category = await Category.findById(id)
    offerPercentage = parseInt(offerPercentage,10)

    const products = await Product.find({category:category._id})

    products.forEach(async(product)=>{
      const discountAmount = (offerPercentage/100)* product.price
      const newOfferPrice = Math.round(product.price - discountAmount)

      await Product.findByIdAndUpdate(product._id,{
        offerPrice:newOfferPrice
      })

    })

    res.redirect("/admin/loadProductOffer")

    
  } catch (error) {
    console.log(error.message);
  }
}




module.exports = {
  loadProductOffer,
  updateProductOffer,
  loadCategoryoffer,
  updateCategoryOffer
}
