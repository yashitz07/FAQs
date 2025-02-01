const express=require("express")
const router=express.Router()
const FAQ=require("../models/faq") 


router.get("/",async(req,res)=>{
    const faqs=await FAQ.find()
    res.render("admin/index",{faqs})
})

router.get("/new",(req,res)=>{
    res.render("admin/new")
})

router.post("/",async(req,res)=>{
    const {question,answer}=req.body
    await FAQ.create({question,answer,translations:{}})
    res.redirect("/admin")
})

router.get("/:id/edit",async(req,res)=>{
    const faq=await FAQ.findById(req.params.id)
    res.render("admin/edit",{faq})
})

router.put("/:id",async(req,res)=>{
    const {question,answer}=req.body
    await FAQ.findByIdAndUpdate(req.params.id,{question,answer})
    res.redirect("/admin")
})

router.delete("/:id",async(req,res)=>{
    await FAQ.findByIdAndDelete(req.params.id)
    res.redirect("/admin")
})

module.exports=router
