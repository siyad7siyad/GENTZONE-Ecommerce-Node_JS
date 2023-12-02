const Product=require('../../model/productModel')

const Category = require("../../model/categoryModel");



const gender=['gents','ladies']
const loadProducts = async (req, res) => {
    try {
       const products=await Product.find() 
       const categories = await Category.find();
      res.render("admin/products",{products,categories});
    } catch (error) {
      console.log(error.message);
    }
  };
  
const loadPorductForm=async(req,res)=>{
    try{
     
        let categories = await Category.find({});
   
        res.render('admin/addProduct',{categories,gender})
    }
    catch(error){
   console.log(error.message);
    }
}
const addProduct=async(req,res)=>{
  try{
    
    const image = req.files.map((x) => x.filename);

     const {name,category,price,discoutPrice,productColor,gender,brand,description}=req.body;
    
  
    const sizedata=req.body.sizes
     const addProducts =new Product({
      name,
      category,
      price,
      discount_price:discoutPrice,
      productColor,
      gender,
      brand,
      description,
      sizes:sizedata,
     image
    })

    
    await addProducts.save();

    res.redirect("/admin/products");  
  }
  catch(error){
 console.log(error.message);
  }
}


const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    const result = await Product.findByIdAndDelete(productId);

    if (result && result.images !== '') {
      try {
        result.images.map((value)=> fs.unlinkSync("public/assets/images/productIMG/" + value))
       
      } catch (err) {
        console.log(err);
      }
    }

    res.redirect('/admin/products');
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditPorductForm=async(req,res)=>{
  try{
    const id = req.query.id;
    const product = await Product.findOne({ _id: id });
      let categories = await Category.find({});
      res.render('admin/editProduct',{categories,gender,product})
  }
  catch(error){
 console.log(error.message);
  }
}

const storeEditProduct = async (req, res) => {
  try {

    const image = req.files.map((x) => x.filename);

const {name,category,price,discoutPrice,productColor,gender,brand,description}=req.body;

const sizedata=req.body.sizes

    await Product.findByIdAndUpdate(
      { _id: req.body.product_id },
      {
        $set: {

          name,
          category,
          price,
          discount_price:discoutPrice,
          productColor,
          gender,
          brand,  
          description,
          sizes:sizedata,
         image
        },
      }
    );
    res.redirect('/admin/products')

  } catch (error) {
    console.log(error.message);
  }
}


module.exports = {
  
    loadProducts,
    loadPorductForm,
    addProduct,
    deleteProduct,
    loadEditPorductForm,
    storeEditProduct
  };
  