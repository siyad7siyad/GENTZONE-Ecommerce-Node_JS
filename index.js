const path = require("path")
const session = require("express-session")
const dbConnection = require('./config/dbConnect')
const dotenv = require("dotenv").config()


const express = require("express")
const userRoute = require("./routes/userRoute")
const adminRoute = require('./routes/adminRoute')


// const categoryRoute = require('./routes/categoryRoute')

const app = express()

const PORT = process.env.PORT||4000
dbConnection()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// session creation

app.use(session({
  secret:process.env.SESSION_SECRET || "mysessionsecret", 
  resave:false,
  saveUninitialized:true
}))

// app.use((req, res, next) => {
//   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
//   res.setHeader('Pragma', 'no-cache');
//   res.setHeader('Expires', '0');
//     next();
// });

app.set("view engine","ejs")
app.set("views","./views")

// serve staic folder

app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'/public/userAssets')))
app.use(express.static(path.join(__dirname,'/public/assets')))
app.use(express.static(path.join(__dirname,'/public/itemsStyle')))


// for user route
app.use('/',userRoute)
// for admin route
app.use('/admin',adminRoute)








app.listen(PORT,()=>console.log("Server is Running on http://localhost:4000"))
