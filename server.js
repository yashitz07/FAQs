const express=require("express")
const dotenv=require("dotenv")
const cors=require("cors")
const connectDB=require("./db")
const faqRoutes=require("./routes/faqRoutes")

dotenv.config()
connectDB()

const app=express()

app.use(cors())
app.use(express.json())

//  break---faqRoutes mei redis se continue 
app.use("/api/faqs",faqRoutes)

const PORT=process.env.PORT||5000
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
