const express=require("express")
const router=express.Router()
const FAQ=require("../models/faq")
const redisClient=require("../redisClient")

router.get("/",async(req,res)=>{
    try{
        let lang=req.query.lang||"en"
        let cacheKey=`faqs:${lang}`

        // cached hua
        let cachedFAQs=await redisClient.get(cacheKey)
        if(cachedFAQs){
            console.log("Serving from cache")
            return res.json(JSON.parse(cachedFAQs))
        }

        let faqs=await FAQ.find()
        faqs=faqs.map(faq=>({
            question:faq.getTranslation(lang),
            answer:faq.answer
        }))

        await redisClient.setEx(cacheKey,3600,JSON.stringify(faqs))

        res.json(faqs)
    }catch(err){
        res.status(500).json({error:err.message})
    }
})

router.post("/",async(req,res)=>{
    try{
        const{question,translations,answer}=req.body
        const faq=new FAQ(
            {question,translations:new Map(Object.entries(translations)),answer

            }
        )
        await faq.save()
        // Clear 
        await redisClient.del("faqs:en")
        await redisClient.del("faqs:hi")
        await redisClient.del("faqs:gj")
        res.status(201).json(faq)
    }catch(err){
        res.status(400).json({error:err.message})
    }
})

router.delete("/:id",async(req,res)=>{
    try{
        await FAQ.findByIdAndDelete(req.params.id)
        res.json({message:"FAQ deleted"})
    }catch(err){
        res.status(400).json({error:err.message})
    }
})

module.exports=router
