const Product = require("../../model/productModel")
const Category = require("../../model/categoryModel")
const fs = require("fs")
const path=require('path')
const sharp = require("sharp")
// const express = require("express")




// load products
const gender = ["gents","ladies"]

const loadProducts = async(req,res)=>{

try {
  const products = await Product.find()
  const categories = await Category.find({},{_id:1,name:1})
  res.render("product.ejs",{categories,products})
  
} catch (error) {
  console.log(error.message);
}
 
}

// load product form

const loadProductForm = async(req,res)=>{
 try {
   
  let categories = await Category.find({})
  res.render('addProduct',{categories,gender})

 } catch (error) {
  console.log(error.message);
 }
}

// add product
const addProduct = async(req,res)=>{
  try {
      
      const image = req.files.map((x)=>x.filename)
      
      const {name,categoryData,price,discountPrice,productColor,gender,brand,description}=req.body
      const existingProduct = await Product.findOne({name:name})
      if(existingProduct){
        res.render('addCategory',{error:"Product with same name is already exist"})}else{
          const category=Category.find({category:categoryData})
          const addProducts =new Product({
              name:name,
              category:categoryData,
              price:price,
              offerPrice:discountPrice,
              productColor:productColor,
              gender:gender,
              brand:brand,
              description:description,
              image
          })
          await addProducts.save()
    
    
    
          res.redirect('/admin/products')
        }
      
  } catch (error) {
      console.log(error.message)
  }
}

// edit product

const loadEditProduct = async(req,res)=>{
  try {
    const id = req.query.id
    const product = await Product.findById(id)
    let categories = await Category.find({})
    res.render("editProduct",{categories,gender,product})
    
  } catch (error) {
    console.log(error.message);
  }
}

// update product

const updateProduct = async(req,res)=>{
  try {

    
    const product = await Product.findOne({ _id: req.body.product_id  });
    let images=[],deleteData=[]

    const {
      name,
      category,
      price,
      discoutPrice,
      productColor,
      gender,
      brand,
      description,
    } = req.body;

    if (req.body.deletecheckbox) {
   
      deleteData.push(req.body.deletecheckbox); 
     
     
      
      deleteData = deleteData.flat().map(x=>Number(x))
      
      images = product.image.filter((img, idx) => !deleteData.includes(idx));
    }else{
      images = product.image.map((img)=>{return img});
    }
    if(req.files.length!=0){
      for (const file of req.files) {
        console.log(file, "File received");
  
        const randomInteger = Math.floor(Math.random() * 20000001);
        const imageDirectory = path.join('public', 'assets', 'imgs', 'productIMG');
        const imgFileName = "cropped" + randomInteger + ".jpg";
        const imagePath = path.join(imageDirectory, imgFileName);
  
        console.log(imagePath, "Image path");
  
        const croppedImage = await sharp(file.path)
          .resize(580, 320, {
            fit: "cover",
          })
          .toFile(imagePath);
  
        if (croppedImage) {
          images.push(imgFileName);
        }
      }
  
    }

 




    await Product.findByIdAndUpdate(
      { _id: req.body.product_id },
      {
        $set: {
          name,
          category,
          price,
          offerPrice: discoutPrice,
          productColor,
          gender,
          brand,
          description,
          image:images,
        },
      }
    );
    

    res.redirect('/admin/products')
    
  } catch (error) {
    console.log(error.message);
  }
}


// delete product

const deleteProduct = async(req,res)=>{
  try {
    
    const productId = req.params.id
    
    const result = await Product.findByIdAndDelete(productId)

    if(result && result.image !== ''){
      try {
        result.image.map((value)=> fs.unlinkSync("public/assets/imgs/productIMG" + value))
        
      } catch (error) {
        console.log(error.message);
      }
    }
    res.redirect("/admin/products")
    
  } catch (error) {
    console.log(error.message);
  }
}

// const deleteProduct = async (req, res) => {
//   try {
//     const id = req.params.id;
//     console.log(id, "kkkkkk");
//     const productData = await Product.findByIdAndUpdate(
//       { _id: id },
//       {
//         $set: {
//           is_listed: false,
//         },
//       }
//     );
//     res.redirect("/admin/products");
//   } catch (error) {
//     console.log(error.message);
//   }
// };



module.exports = {
  loadProducts,
  loadProductForm,
  addProduct,
  loadEditProduct,
  updateProduct,
  deleteProduct
}