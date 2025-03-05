require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get("/weather", async (req, res) => {
    const { city } = req.query;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
