const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))
app.set("view engine", "ejs");


// Serve landing page at "/"
app.get("/", (req, res) => {
    res.render("index", { title: "Energy Usage Tracker" });
});


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");


app.use("/auth", authRoutes);
app.use("/home", homeRoutes);
connectDB();
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
