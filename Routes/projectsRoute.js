const express = require("express")
const route = express.Router()

const projectModel = require("../Models/projectsSchema")

route.post("/add_project", async (req, res) => {
    try {
        const { title } = req.body;

        const existsProject = await projectModel.findOne({ title })

        if(existsProject){
            return res.status(500).json({
                message: `Project already exists`
            })
        }

        const newProject = new projectModel(req.body)
        newProject.save()

        res.status(201).json({
            message: `Project successfully added`,
            project: newProject
        })
    } catch (error) {
        res.status(500).json({
            message: `Error in add Project: ${error.message}`
        })
    }
})

let cachedProjects = null;
let lastFetchTime = 0;

const CACHE_TIME = 10 * 60 * 1000;

route.get("/projects", async (req, res) => {
    const now = Date.now();

    if (cachedProjects && (now - lastFetchTime < CACHE_TIME)) {
        return res.json(cachedProjects);
    }
    try {
        const allProjects = await projectModel.find()

        cachedProjects = allProjects;
        lastFetchTime = now;

        res.status(200).json({
            message: `AllProjects successfully fetched`,
            projects: allProjects
        })
    } catch (error) {
        res.status(500).json({
            message: `Error in fetching Product ${error.message}`
        })
    }
})

route.put("/update_project/:id", async (req, res) =>{
    try {
        const { id } = req.params;

        const updateProject = await projectModel.findByIdAndUpdate(id, req.body, { new: true })

        if(!updateProject){
            return res.status(404).josn({
                message: `project not found or project is not in the data base`
            })
        }

        res.status(200).json({
            message: `project Successfully Updated`,
            project : updateProject
        })
    } catch (error) {
        res.status(500).josn({
            message: `Error in update project ${error.message}`
        })
    }
})

route.delete("/delete_project/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteProject = await projectModel.findByIdAndDelete(id)

        if (!deleteProject) {
            return res.status(404).json({
                message: `project not found or already deleted`
            });
        }

        res.status(200).json({
            message: `project Successfully Deleted`,
            project : deleteProject
        })
    } catch (error) {
        res.status(500).json({
            message : `Error in delete project ${error.message}`
        })
    }
})

module.exports = route ;