import axios from 'axios';
import { statsArray, containerPortMap } from './dockerStatService/dockerStats.js'

async function redirectRequest(req, res) {
    try {
        if (statsArray.length === 0) {
            return res.status(503).json({ error: "No available containers." });
        }

        const lowestCpuContainer = statsArray[0];
        const containerPort = containerPortMap[lowestCpuContainer.containerId];

        if (!containerPort) {
            return res.status(503).json({ error: "Container port not found." });
        }

        const targetUrl = `http://localhost:${containerPort}/execute`;
        const response = await axios.post(targetUrl, req.body);

        res.json({ result: response.data });
    } catch (error) {
        if (error.response?.data?.error) {
            res.status(200).json({
                error: error.response.data.error
            });
        } else {
            res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }
}

export { redirectRequest };
