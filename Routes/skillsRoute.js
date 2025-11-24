const express = require("express")
const route = express.Router()

const skillModel = require("../Models/skillsSchema")

route.post("/add_skill", async (req, res) => {
    try {
        const { title } = req.body

        const skillExists = await skillModel.findOne({ title })

        if(skillExists){
            return res.status(500).json({
                message: `Skill already exists`
            })
        }

        const newSkill = new skillModel(req.body)
        newSkill.save()

        res.status(201).json({
            message: `Skill successfully added`,
            skill: newSkill
        })
    } catch (error) {
        res.status(500).json({
            message: `Error in add Skill ${ error.message }`
        })
    }
})

let cachedSkills = null;
let lastFetchTime = 0;

const CACHE_TIME = 10 * 60 * 1000;

route.get("/skills", async (req, res) => {
    const now = Data.now();

    if (cachedSkills && (now - lastFetchTime < CACHE_TIME)) {
        return res.json(cachedSkills);
    }

    try {
        const allSkills = await skillModel.find()

        cachedSkills = allSkills;
        lastFetchTime = now;
        
        res.status(200).json({
            message: `All Skills successfully fetched`,
            projects: allSkills
        })
    } catch (error) {
        res.status(500).json({
            message: `Error in fetched Skills ${error.message}`
        })
    }
})

route.get("/skill/:category", async (req, res) => {
    try {
        const { category } = req.params;

        const skillByCategory = await skillModel.find({ category })

        if(!skillByCategory){
            return res.status(404).json({
                message: `Category not found or not exists`
            })
        }

        res.status(200).json({
            message: `Skill successfully fetched by category`,
            data: skillByCategory
        })
    } catch (error) {
        res.status(500).json({
            message: `Error in fetched skill by category ${error.message}`
        })
    }
})

route.put("/update_skill/:id", async (req, res) =>{
    try {
        const { id } = req.params;

        const updateSkill = await skillModel.findByIdAndUpdate(id, req.body, { new: true })

        if(!updateSkill){
            return res.status(404).josn({
                message: `Skill not found or Skill is not in the data base`
            })
        }

        res.status(200).json({
            message: `Skill Successfully Updated`,
            skill : updateSkill
        })
    } catch (error) {
        res.status(500).josn({
            message: `Error in update skill ${error.message}`
        })
    }
})

route.delete("/delete_skill/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteSkill = await skillModel.findByIdAndDelete(id)

        if (!deleteSkill) {
            return res.status(404).json({
                message: `Skill not found or already deleted`
            });
        }

        res.status(200).json({
            message: `Skill Successfully Deleted`,
            skill : deleteSkill
        })
    } catch (error) {
        res.status(500).json({
            message : `Error in delete skill ${error.message}`
        })
    }
})

module.exports = route ;