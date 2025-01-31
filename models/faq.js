const mongoose=require("mongoose")
const sanitizeHtml=require("sanitize-html")
const translate=require("google-translate-api-x")

const faqSchema=new mongoose.Schema({
    question:{type:String,required:true},
    translations:{type:Map,of:String}, 
    answer:{
        type:String,
        required:true,
        set:(v)=>sanitizeHtml(v)
    }
})

//dynamically lana hae
faqSchema.methods.getTranslation=function(lang){
    return this.translations.get(lang)||this.question
}

faqSchema.methods.autoTranslate=async function(){
    const languages=["hi","bn","gu","mr"] 

    for(let lang of languages){
        if(!this.translations.get(lang)){ 
            try{
                let result=await translate(this.question,{to:lang})
                this.translations.set(lang,result.text)
            }catch(err){
                console.error(`Translation failed for ${lang}:`,err.message)
            }
        }
    }
}

faqSchema.pre("save",async function(next){
    await this.autoTranslate()
    next()
})

const FAQ=mongoose.model("FAQ",faqSchema)
module.exports=FAQ