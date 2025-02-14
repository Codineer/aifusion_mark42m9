const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))
app.set("view engine", "ejs");
const axios = require("axios");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");


app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
// GET - Home Page



// Serve landing page at "/"

// POST - Home Form Submission

app.get("/result", (req, res) => {
    res.render("result", { analysis: lastAnalysis });
});



connectDB();
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
