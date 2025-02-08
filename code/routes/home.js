const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// GET - Home Page
router.get("/", authMiddleware, (req, res) => {
    res.json({ message: `Welcome User ${req.user.userId}, You are authenticated!` });
});
// POST - Home Form Submission
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { usageData } = req.body;  // Expecting an object with electricity, gas, etc.

        const userPrompt = `
        Analyze the following weekly energy usage and provide a summary with tips:
        ${JSON.stringify(usageData)}
        Suggest ways to reduce energy consumption effectively.2
        `;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {

                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            }
        );

        res.json({ analysis: response.data.candidates[0].content.parts[0].text });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error analyzing energy data" });
    }
});

module.exports = router;
