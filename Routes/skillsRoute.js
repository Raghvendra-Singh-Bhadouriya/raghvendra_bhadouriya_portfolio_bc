const express = require("express");
const route = express.Router();

const skillModel = require("../Models/skillsSchema");

/* ============================================================
   1️⃣ ADD SKILL
============================================================ */
route.post("/add_skill", async (req, res) => {
    try {
        const { title } = req.body;

        const skillExists = await skillModel.findOne({ title });

        if (skillExists) {
            return res.status(400).json({
                message: "Skill already exists"
            });
        }

        const newSkill = new skillModel(req.body);
        await newSkill.save();

        res.status(201).json({
            message: "Skill successfully added",
            skill: newSkill
        });

    } catch (error) {
        res.status(500).json({
            message: `Error adding skill: ${error.message}`
        });
    }
});


/* ============================================================
   2️⃣ GET ALL SKILLS (With Cache)
============================================================ */
let cachedSkills = null;
let lastFetchTime = 0;
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

route.get("/skills", async (req, res) => {
    const now = Date.now();   // ❗ FIXED: "Data.now" → "Date.now"

    // Serve from cache
    if (cachedSkills && (now - lastFetchTime < CACHE_TIME)) {
        return res.status(200).json(cachedSkills);
    }

    try {
        const allSkills = await skillModel.find();

        cachedSkills = {
            message: "All skills fetched successfully",
            skills: allSkills
        };

        lastFetchTime = now;

        res.status(200).json(cachedSkills);

    } catch (error) {
        res.status(500).json({
            message: `Error fetching skills: ${error.message}`
        });
    }
});


/* ============================================================
   3️⃣ GET SKILLS BY CATEGORY (With Cache)
============================================================ */
let cachedSkillsByCategory = null;
let lastSkillFetchTime = 0;
const CACHE_SKILL_TIME = 10 * 60 * 1000;

route.get("/skill/:category", async (req, res) => {
    const now = Date.now();

    if (
        cachedSkillsByCategory &&
        (now - lastSkillFetchTime < CACHE_SKILL_TIME)
    ) {
        return res.status(200).json(cachedSkillsByCategory);
    }

    try {
        const { category } = req.params;
        const skills = await skillModel.find({ category });

        if (!skills || skills.length === 0) {
            return res.status(404).json({
                message: "No skills found for this category"
            });
        }

        cachedSkillsByCategory = {
            message: "Skills fetched successfully by category",
            skills
        };

        lastSkillFetchTime = now;

        res.status(200).json(cachedSkillsByCategory);

    } catch (error) {
        res.status(500).json({
            message: `Error fetching skills by category: ${error.message}`
        });
    }
});


/* ============================================================
   4️⃣ UPDATE SKILL
============================================================ */
route.put("/update_skill/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updateSkill = await skillModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updateSkill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        // Invalidate all caches
        cachedSkills = null;
        cachedSkillsByCategory = null;

        res.status(200).json({
            message: "Skill updated successfully",
            skill: updateSkill
        });

    } catch (error) {
        res.status(500).json({
            message: `Error updating skill: ${error.message}`
        });
    }
});


/* ============================================================
   5️⃣ DELETE SKILL
============================================================ */
route.delete("/delete_skill/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteSkill = await skillModel.findByIdAndDelete(id);

        if (!deleteSkill) {
            return res.status(404).json({
                message: "Skill not found or already deleted"
            });
        }

        // Invalidate cache
        cachedSkills = null;
        cachedSkillsByCategory = null;

        res.status(200).json({
            message: "Skill deleted successfully",
            skill: deleteSkill
        });

    } catch (error) {
        res.status(500).json({
            message: `Error deleting skill: ${error.message}`
        });
    }
});


module.exports = route;
