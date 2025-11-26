const express = require("express");
const route = express.Router();

const projectModel = require("../Models/projectsSchema");

/* ============================================================
   1️⃣ ADD PROJECT
============================================================ */
route.post("/add_project", async (req, res) => {
    try {
        const { title } = req.body;

        const existsProject = await projectModel.findOne({ title });

        if (existsProject) {
            return res.status(400).json({
                message: "Project already exists"
            });
        }

        const newProject = new projectModel(req.body);
        await newProject.save();

        res.status(201).json({
            message: "Project successfully added",
            project: newProject
        });

    } catch (error) {
        res.status(500).json({
            message: `Error in adding project: ${error.message}`
        });
    }
});

/* ============================================================
   2️⃣ GET ALL PROJECTS WITH CACHING
============================================================ */
let cachedProjects = null;
let lastFetchTime = 0;
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

route.get("/projects", async (req, res) => {
    const now = Date.now();

    // Serve from cache if valid
    if (cachedProjects && (now - lastFetchTime < CACHE_TIME)) {
        return res.status(200).json(cachedProjects);
    }

    try {
        const allProjects = await projectModel.find();

        // Cache full response
        cachedProjects = {
            message: "All projects successfully fetched",
            projects: allProjects
        };

        lastFetchTime = now;

        res.status(200).json(cachedProjects);

    } catch (error) {
        res.status(500).json({
            message: `Error in fetching projects: ${error.message}`
        });
    }
});

/* ============================================================
   3️⃣ UPDATE PROJECT
============================================================ */
route.put("/update_project/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updateProject = await projectModel.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true }
        );

        if (!updateProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Invalidate cache after update
        cachedProjects = null;

        res.status(200).json({
            message: "Project successfully updated",
            project: updateProject
        });

    } catch (error) {
        res.status(500).json({
            message: `Error updating project: ${error.message}`
        });
    }
});

/* ============================================================
   4️⃣ DELETE PROJECT
============================================================ */
route.delete("/delete_project/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteProject = await projectModel.findByIdAndDelete(id);

        if (!deleteProject) {
            return res.status(404).json({
                message: "Project not found or already deleted"
            });
        }

        // Invalidate cache
        cachedProjects = null;

        res.status(200).json({
            message: "Project successfully deleted",
            project: deleteProject
        });

    } catch (error) {
        res.status(500).json({
            message: `Error deleting project: ${error.message}`
        });
    }
});

module.exports = route;
