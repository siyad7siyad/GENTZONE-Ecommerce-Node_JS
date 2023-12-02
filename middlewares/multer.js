const multer = require("multer")
const path =require("path")
// category image stored
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{

    cb(null,'public/assets/imgs/category')

  },
  filename:(req,file,cb)=>{

    const filName = Date.now()+file.originalname
    cb(null,filName)

  }
})
// product image 

const storeProductImg = multer.diskStorage({
  destination:(req,file,cb)=>{

    cb(null,'public/assets/imgs/productIMG')

  },
  filename:(req,file,cb)=>{
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null,fileName)
  }

})

// user profile 

const storeUserProfile = multer.diskStorage({
  destination:(req,file,cb)=>{

    cb(null,'public/userassets/images')

  },
  filename:(req,file,cb)=>{
    const fileName = Date.now()+path.extname(file.originalname)
    cb(null,fileName)
  }
})

module.exports = {
  uploadCategory:multer({storage:storage}),
  uploadProduct:multer({storage:storeProductImg}),
  uploadProfile:multer({storage:storeUserProfile})
}