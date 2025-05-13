require("dotenv").config()
const mongoose = require("mongoose")
const URI = process.env.MONGOURI

const connectDB = async () => {
    try {
        await mongoose.connect(URI)
        console.log(`✅ MongoDB Connected Successfully`)
    } catch (error) {
        console.log(`❌ MongoDB is not Connected ${error.message}`)
    }
}

module.exports = connectDB