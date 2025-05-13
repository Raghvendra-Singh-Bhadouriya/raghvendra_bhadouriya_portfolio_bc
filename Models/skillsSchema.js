const mongoose = require("mongoose")

const skillSchema = new mongoose.Schema({
    img: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
},{
    versionKey: false
})

const skillModel = mongoose.model("skill", skillSchema)

module.exports = skillModel ;