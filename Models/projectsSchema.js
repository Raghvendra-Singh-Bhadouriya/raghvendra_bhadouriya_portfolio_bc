const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    img:{
        type: String
    },
    title:{
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    language: {
        type: [String],
        required: true
    },
    liveSite: {
        type: String,
        required: true
    },
    github: {
        type: String,
        required: true
    }
},{
    versionKey: false
})

const projectModel = mongoose.model("project", projectSchema)

module.exports = projectModel;