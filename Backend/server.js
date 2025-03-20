import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { getContainerIDandPorts } from './dockerStatService/dockerContainerIDs.js';


let containerInfo;
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
        var result = "";
        axios.post('http://localhost:3000/execute', { code })
            .then(response => {
                result = response.data;
                res.json({ result });
            })
            .catch(error => {

                let output = error.response.data.error;

                res.json({ result: { output } });
            });


    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    getContainerIDandPorts().then(info => {
        containerInfo = info;
        console.log(containerInfo);
    });

    console.log(`Server running on http://localhost:${PORT}`);
});
