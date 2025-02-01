const express=require("express")
const dotenv=require("dotenv")
const bodyParser=require("body-parser")
const methodOverride=require("method-override")
const cors=require("cors")
const connectDB=require("./db")
const faqRoutes=require("./routes/faqRoutes")
const adminRoutes=require("./routes/adminRoutes")
dotenv.config()
connectDB()

const app=express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.set("view engine","ejs")

//  break---faqRoutes mei redis se continue 
app.use("/api/faqs",faqRoutes)
app.use("/admin",adminRoutes)


const PORT=process.env.PORT||5000
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
