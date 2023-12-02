const Category = require("../../model/categoryModel")
const User = require("../../model/userModel")

// load category

const loadCategoryForm = async(req,res)=>{
  try {
    res.render("addCategory")
  } catch (error) {
    console.log(error.message);
  }
}


const loadCategory = async(req,res)=>{
  try {
    // console.log("Hellloooooooooy")
    // const userData = await User.findById({_id:req.session.user_id})
    const categoryData = await Category.find()
    // console.log(categoryData)
    res.render("category",{ categoryData, message: "" })
    
  } catch (error) {
    console.log(error.message);
  }
}

// add category

const addCategory = async(req,res)=>{
  try {
    let {name,description} = req.body
    let image = ''
    if(req.file){
      image = req.file.filename
    }

    const existingCategory = await Category.findOne({name:name})
   

    // console.log(existingCategory,"tttt");

    if(existingCategory){
      res.render('addCategory',{error:"category with same name is already exist"})
    }else{
      const category = new Category({
        name:name,
        image:image,
        description:description
      })
      console.log(category,"akkkkkk");
      const categorydata = await category.save() 
      res.redirect('/admin/category')
    }

  } catch (error) {
    console.log(error.message);
  }
}

// edit category

const loadEditCategory = async(req,res)=>{
  try {
    const id = req.query.id
    console.log(id);
    const categoryData = await Category.findById(id)

    res.render('editCategory',{category:categoryData})

    
  } catch (error) {
    console.log(error.message);
  }
}

// update category

const updateCategory = async(req,res)=>{
  try {
    const id = req.body.category_id
    const updateData = await Category.findById(id)

    if(req.body.name){
      updateData.name = req.body.name
    }
    if(req.body.description){
      updateData.description = req.body.description
    }
    if(req.file){
      updateData.image = req.file.filename
    }

    await updateData.save()
    res.redirect('/admin/category') 
    
  } catch (error) {
    console.log(error.message);
  }
}

// unlist category

const unlistCategory = async (req, res) => {
  try {
    const id = req.query.id;

    const categoryData = await Category.findByIdAndUpdate(
      { _id: id },
      { $set: { is_listed: false } },
      { new: true } // Return the modified document
    );
    res.redirect("category")

    
  } catch (error) {
    console.log(error.message);
  }
}

// list category
const listCategory = async (req, res) => {
  try {
    const id = req.query.id;

    const categoryData = await Category.findByIdAndUpdate(
      { _id: id },
      { $set: { is_listed: true } },
      { new: true } // Return the modified document
    );
    res.redirect("category")

    
  } catch (error) {
    console.log(error.message);
  }
}






module.exports = {
  loadCategory,
  loadCategoryForm,
  addCategory,
  loadEditCategory,
  updateCategory,
  unlistCategory,
  listCategory
}

