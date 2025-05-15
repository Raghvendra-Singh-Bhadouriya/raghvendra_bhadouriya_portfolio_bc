require("dotenv").config()
const express = require('express')
const PORT = process.env.PORT || 3000
const server = express();
const cors = require("cors")
const Connection = require("./config/db")

const projectRouter = require("./Routes/projectsRoute")
const skillRouter = require("./Routes/skillsRoute")

server.use(cors({
    origin: 'https://raghvendra-bhadouriya-portfolio.vercel.app/',
    credentials: true
  }))
server.use(express.json())
server.use("/", projectRouter)
server.use("/", skillRouter)

server.listen(PORT, async (req, res) => {
    try {
        await Connection()
        console.log(`✅ Server is running on port ${PORT}`)
    } catch (error) {
        console.log(`❌ Server is running failed ${error.message}`)
    }
})