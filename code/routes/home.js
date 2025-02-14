const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const axios = require("axios");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// GET - Home Page
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

router.get("/", (req, res) => {
    res.render("home", { userId: "user", days: daysOfWeek, analysis: null });
});

// POST - Home Form Submission
let lastAnalysis = "";
router.post("/", async (req, res) => {
    try {
        const { usageData } = req.body;
        const userPrompt = `
        Analyze the following weekly energy usage and provide a summary with tips:
        ${JSON.stringify(usageData)}
        Suggest ways to reduce energy consumption effectively.
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            { "contents": [{ "parts": [{ "text": userPrompt }] }] }
        );

        console.log(response.data);
        const analysisText = response.data.candidates[0].content.parts[0].text;

        // Parse the analysis text into structured data
        const analysis = parseAnalysis(analysisText);

        // Store the analysis in lastAnalysis
        lastAnalysis = analysis;

        // Send a flag for redirection
        res.json({ redirect: true, url: "/home/result" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error analyzing energy data");
    }
});

router.get("/result", (req, res) => {
    res.render("result", { analysis: lastAnalysis });
});

module.exports = router;

// Helper function to parse the analysis text into structured data
function parseAnalysis(text) {
    const summaryStart = text.indexOf("**Summary:**");
    const reasonsStart = text.indexOf("**Possible Reasons for High Weekend Usage:**");
    const tipsStart = text.indexOf("**Tips to Reduce Energy Consumption:**");

    const summary = text.substring(summaryStart + 12, reasonsStart).trim();
    const reasonsText = text.substring(reasonsStart + 38, tipsStart).trim();
    const tipsText = text.substring(tipsStart + 34).trim();

    const reasons = reasonsText.split("\n").map(reason => reason.replace("*", "").trim());
    const tips = tipsText.split("\n").map(tip => tip.replace("*", "").trim());

    return {
        summary,
        reasons,
        tips
    };
}