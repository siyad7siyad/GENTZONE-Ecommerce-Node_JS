const User = require("../../model/userModel")
const Product = require("../../model/productModel")
const Cart = require("../../model/cartModel")
const Address = require("../../model/addressModel")
const Order = require("../../model/orderModel")
const dateFun = require("../../config/saleData")






// load order list

const loadOrders = async (req, res) => {
    try {

        const admin = req.session.userData

        const orders = await Order.find().populate("user")
            .populate({
                path: "address",
                model: "Address",
            }).populate({
                path: "items.product",
                model: "Product"
            })

        res.render("allOrder", { order: orders })


    } catch (error) {
        console.log(error.message);
    }
}


const listOrder = async (req, res) => {
    try {

        const orderId = req.query.id

        const order = await Order.findById(orderId).populate("user")
            .populate({
                path: "address",
                model: "Address",
            }).populate({
                path: "items.product",
                model: "Product"
            })

        console.log(order);

        res.render("orderDetails", { order })


    } catch (error) {
        console.log(error.message);
    }
}


const orderStatusChange = async (req, res) => {
    try {

        const orderId = req.query.id

        const status = req.query.status

      
        
        


        const order = await Order.findOne({
            _id: orderId
        }).populate("user")
            .populate({
                path: "address",
                model: "Address",
            }).populate({
                path: "items.product",
                model: "Product"
            })

           const userId = order.user

           const user = await User.findById(userId)

           
        if(status==="Cancelled"){

            user.walletBalance += order.totalAmount

            await user.save()
            
        }


        const orderData = await Order.findByIdAndUpdate({ _id: orderId }, {
            $set: {
                status: status
            }
        })
    
        res.status(200).json({ success: true })



    } catch (error) {
        console.log(error.message);
    }
}

// load sales report
const loadSalesReport = async (req, res) => {
    
    // Initialize an empty query object
    let query = {};

    // Check if a status parameter is provided in the query
    if (req.query.status) {
        if (req.query.status === "Delivered" || req.query.status === "Shipped" || req.query.status === "Confirmed") {
            query.status = req.query.status;
        } else if (req.query.status === "Daily") {
            query.orderDate = dateFun.getDailyDateRange();
        } else if (req.query.status === "Weekly") {
            query.orderDate = dateFun.getWeeklyDateRange();
        } else if (req.query.status === "Monthly") {
            query.orderDate = dateFun.getMonthlyDateRange();
        } else if (req.query.status === "Yearly") {
            query.orderDate = dateFun.getYearlyDateRange();
        } else if (req.query.status === "All") {
            query = {}
        }
    }

    if (req.query.start && req.query.end) {
        console.log("bchjbfdhgfiug");
        let start = req.query.start;
        let end = req.query.end;
        console.log(start, end, "djgfdkfdg");

        query.orderDate = { $gte: start, $lt: end }
    }

    try {
        // Use the query object to filter orders
        const orders = await Order.find(query)
            .populate("user")
            .populate({
                path: "address",
                model: "Address"
            })
            .populate({
                path: "items.product",
                model: "Product"
            })
            .sort({ orderDate: -1 });

        // calculate total revenue
        const totalRevanue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // calculate total sales count
        const totalSales = orders.length;

        // calculate total product sold
        const totalProductSold = orders.reduce((acc, order) => acc + order.items.length, 0);

        res.render("salesReport", { totalRevanue, totalSales, totalProductSold, orders });



    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Error fetching orders");
    }
};


const dateFilter = async (req, res) => {
    const start = req.params.start;
    const end = req.params.end;

    let query = {};

    if (start && end) {
        console.log('hello');
        query.orderDate = { $gte:start,
        $lt:end };
    }

    try {
        const orders = await Order.find(query)
            .populate("user")
            .populate({
                path: "address",
                model: "Address"
            })
            .populate({
                path: "items.product",
                model: "Product"
            })
            .sort({ orderDate: -1 });

            console.log(orders,"aaaaaaaaaaaaaa");

        const totalRevanue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalSales = orders.length;
        const totalProductSold = orders.reduce((acc, order) => acc + order.items.length, 0);

        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.orderDate).toLocaleDateString();
            const deliveryDate = new Date(order.deliveryDate).toLocaleDateString();
        
            // Check if orderDate is greater than or equal to start
            // and deliveryDate is less than or equal to end
            return orderDate >= start && deliveryDate <= end;
        });
        

       

        res.status(200).json({ success: true, totalProductSold, totalSales, totalRevanue, orders, message: "return successfully" });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, error: "Error fetching orders" });
    }
};


module.exports = {
    loadOrders,
    listOrder,
    orderStatusChange,
    loadSalesReport,
    dateFilter

}