require("dotenv").config()
const express = require("express")
const PORT = process.env.PORT || 3000
const server = express();
const cors = require("cors")
const Connection = require("./config/db")

const projectRouter = require("./Routes/projectsRoute")
const skillRouter = require("./Routes/skillsRoute");
const { default: axios } = require("axios");

const allowedOrigins = [
  'http://localhost:5173',
  'https://raghvendra-bhadouriya-portfolio.vercel.app'
];

server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

app.get("/ping", (_, res) => {
  res.send("Server is awake!")
})

setInterval(() => {
  axios.get("https://raghvendra-bhadouriya-portfolio-bc-api.onrender.com")
  .then(() => console.log("Pinged server to keep awake"))
  .catch(() => console.log("Ping failed"))
}, 5 * 60 *1000);

server.use(express.json())
server.use("/", projectRouter)
server.use("/", skillRouter)

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

server.listen(PORT, async (req, res) => {
    try {
        await Connection()
        console.log(`✅ Server is running on port ${PORT}`)
    } catch (error) {
        console.log(`❌ Server is running failed ${error.message}`)
    }
})
