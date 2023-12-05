const Brand = require("../../model/brandModel")


const loadBrand= async(req,res)=>{
    try {

        const brandData = await Brand.find()

      res.render("brand",{brandData})
    } catch (error) {
      console.log(error.message);
    }
  }

//    load brandform

  const loadBrandForm = async(req,res)=>{
    try {
      res.render("addBrand")
    } catch (error) {
      console.log(error.message);
    }
  }

// add brand
const addBrand = async (req, res) => {
    try {
        console.log("llkjhjkl");
      let { name, description } = req.body;
      let image = '';
  

      if (req.file) {
        image = req.file.filename;
      }
  console.log("jjjjj");
      const existingBrand = await Brand.findOne({ name: name });
      console.log(existingBrand,"kkkkkk");
  
      if (existingBrand) {
        return res.render('addBrand', { error: "Brand with the same name already exists" });
      } else {
        const brand = new Brand({
          name: name,
          image: image,
          description: description,
          is_listed: true
        });
  
        const brandData = await brand.save();
        res.redirect('/admin/brand');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

//   load edit form

const loadEditBrand = async(req,res)=>{
    try {
      const id = req.query.id
      
      const brandData = await Brand.findById(id)
  
      res.render('editBrand',{brand:brandData})
  
      
    } catch (error) {
      console.log(error.message);
    }
  }
  
//   update brand

const updateBrand = async(req,res)=>{
    try {
      const id = req.body.brand_id
      const updateData = await Brand.findById(id)
  
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
      res.redirect('/admin/brand') 
      
    } catch (error) {
      console.log(error.message);
    }
  }

//   unlist brand

const unlistBrand = async (req, res) => {
    try {
      const id = req.query.id;
  
      const brandData = await Brand.findByIdAndUpdate(
        { _id: id },
        { $set: { is_listed: false } },
        { new: true } // Return the modified document
      );
      res.redirect("brand")
  
      
    } catch (error) {
      console.log(error.message);
    }
  }

  const listBrand = async (req, res) => {
    try {
      const id = req.query.id;
  
      const brandData = await Brand.findByIdAndUpdate(
        { _id: id },
        { $set: { is_listed: true } },
        { new: true } // Return the modified document
      );
      res.redirect("brand")
  
      
    } catch (error) {
      console.log(error.message);
    }
  }
  

  module.exports = {
    loadBrand,
    loadBrandForm,
    addBrand,
    loadEditBrand,
    updateBrand,
    listBrand,
    unlistBrand
  }