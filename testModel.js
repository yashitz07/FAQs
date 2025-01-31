const mongoose=require("mongoose")
const connectDB=require("./db")
const FAQ=require("./models/faq")

async function test(){
    await connectDB()

    // Create a new FAQ
    const faq=new FAQ({
        question:"What is BharatFD?",
        translations:new Map([["hi","भारतएफडी क्या है?"],["bn","ভারতএফডি কি?"]]),
        answer:"BharatFD is a financial platform."
    })

    await faq.save()
    console.log("FAQ Saved:",faq)

    // Fetch and display the translated question
    const fetchedFaq=await FAQ.findOne()
    console.log("Hindi Translation:",fetchedFaq.getTranslation("hi"))

    mongoose.connection.close()
}

test()
