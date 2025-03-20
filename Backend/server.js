/* eslint-disable no-unused-vars */
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { getContainerStats } from './dockerStatService/dockerStats.js';
import { redirectRequest } from "./redirectRequestService.js"

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());

app.post("/execute", (req, res) => {
    try {
        const code = req.body.code;
        if (!code) {
            return res.status(400).json({ error: "No code provided" });
        }

        redirectRequest(req, res);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = 8080;
app.listen(PORT, async () => {
    await getContainerStats();

    console.log(`Server running on http://localhost:${PORT}`);
});
