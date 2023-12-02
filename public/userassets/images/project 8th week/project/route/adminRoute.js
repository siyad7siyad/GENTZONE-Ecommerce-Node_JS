const express = require("express");
const adminRoute = express();
const multer=require('../middleware/multer')
const adminController = require("../controller/admin/adminController");
const categoryController=require("../controller/admin/categoryController");
const productController=require('../controller/admin/productController')
const adminAuth = require("../middleware/adminAuth");
// LOGIN
adminRoute.get("/", adminAuth.isLogout, adminController.loadAdminLogin);
adminRoute.get("/logout", adminController.adminLogout);
adminRoute.post("/", adminController.verifyLogin);

// HOME
adminRoute.get("/home", adminAuth.isLogin, adminController.loadHome);

// Add Category
adminRoute.get("/category", adminAuth.isLogin, categoryController.loadCategory);
adminRoute.get("/addCategory", adminAuth.isLogin, categoryController.loadCategoryform);
adminRoute.post("/addCategory",multer.uploadCategory.single('image'), categoryController.addCategory);
adminRoute.get("/editCategory", categoryController.loadEditCategory);
adminRoute.post("/editCategory",multer.uploadCategory.single('image'), categoryController.CategoryEdit);
adminRoute.get('/unlistCategory',categoryController.unlistCategory)
adminRoute.get('/listCategory',categoryController.listCategory)
// Add Products
adminRoute.get("/products", adminAuth.isLogin, productController.loadProducts);
adminRoute.get("/addproduct", adminAuth.isLogin, productController.loadPorductForm);
adminRoute.post("/addproduct", adminAuth.isLogin,multer.uploadProduct.array('image'), productController.addProduct);
adminRoute.get("/editProduct", productController.loadEditPorductForm);
adminRoute.get("/deleteProduct/:id", productController.deleteProduct);
adminRoute.post("/editProduct",multer.uploadProduct.array('image'), productController.storeEditProduct);
module.exports = adminRoute;
