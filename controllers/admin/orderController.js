const User = require("../../model/userModel")
const Product = require("../../model/productModel")
const Cart = require("../../model/cartModel")
const Address = require("../../model/addressModel")
const Order = require("../../model/orderModel")






// load order list

const loadOrders = async(req,res)=>{
    try {

        const admin = req.session.userData
        
        const orders = await Order.find().populate("user")
        .populate({
            path:"address",
            model:"Address",
        }).populate({
            path:"items.product",
            model:"Product"
        })

        res.render("allOrder",{order:orders})

        
    } catch (error) {
        console.log(error.message);
    }
}


const listOrder = async(req,res)=>{
    try {

        const orderId = req.query.id

        const order = await Order.findById(orderId).populate("user")
        .populate({
            path:"address",
            model:"Address",
        }).populate({
            path:"items.product",
            model:"Product"
        })

        console.log(order);

        res.render("orderDetails",{order})

        
    } catch (error) {
        console.log(error.message);
    }
}


const orderStatusChange = async(req,res)=>{
    try {

        const orderId = req.query.id

        const status = req.query.status

        const order = await Order.findOne({
            _id:orderId
        }).populate("user")
        .populate({
            path:"address",
            model:"Address",
        }).populate({
            path:"items.product",
            model:"Product"
        })

        const orderData = await Order.findByIdAndUpdate({_id:orderId},{
            $set:{
                status:status
            }
        })
        console.log(order,"jkjkjljlkjl");
        res.render("orderDetails",{order})


        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadOrders,
    listOrder,
    orderStatusChange
}