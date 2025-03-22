import axios from 'axios';
import { statsArray, containerPortMap } from './dockerStatService/dockerStats.js'

const premiumQueue = [];
const regularQueue = [];
let isProcessing = false;

// async function redirectRequest(req, res) {
//     try {
//         if (statsArray.length === 0) {
//             return res.status(503).json({ error: "No available containers." });
//         }

//         const lowestCpuContainer = statsArray[0];
//         const containerPort = containerPortMap[lowestCpuContainer.containerId];

//         if (!containerPort) {
//             return res.status(503).json({ error: "Container port not found." });
//         }

//         const targetUrl = `http://localhost:${containerPort}/execute`;
//         const response = await axios.post(targetUrl, req.body);

//         res.json({ result: response.data });
//     } catch (error) {
//         if (error.response?.data?.error) {
//             res.status(200).json({
//                 error: error.response.data.error
//             });
//         } else {
//             res.status(500).json({
//                 error: "Internal Server Error"
//             });
//         }
//     }
// }


async function processQueue() {
    if (isProcessing) return; // Prevent multiple concurrent executions
    isProcessing = true;

    while (premiumQueue.length > 0 || regularQueue.length > 0) {
        if (statsArray.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for containers to be available
            continue;
        }

        const lowestCpuContainer = statsArray[0];
        const cpuUsage = parseFloat(lowestCpuContainer.cpuUsage);
        const containerPort = containerPortMap[lowestCpuContainer.containerId];

        // if (!containerPort || cpuUsage >= 95) continue;
        if (!containerPort) continue;

        let requestObj;
        if (premiumQueue.length > 0) {
            requestObj = premiumQueue.shift();
        } else if (regularQueue.length > 0) {
            requestObj = regularQueue.shift();
        }

        if (requestObj) {
            try {
                const targetUrl = `http://localhost:${containerPort}/execute`;
                const response = await axios.post(targetUrl, requestObj.req.body);
                requestObj.res.json({ result: response.data });
            } catch (error) {
                if (error.response?.data?.error) {
                    requestObj.res.json({
                        error: error.response.data.error
                    });
                } else {
                    requestObj.res.status(500).json({
                        error: "Internal Server Error"
                    });
                }
            }
        }
    }

    isProcessing = false; // Reset flag when queue is empty
}


async function queueRequest(req, res) {
    const { premium = false } = req.body;

    if (premium) {
        premiumQueue.push({ req, res });
    } else {
        regularQueue.push({ req, res });
    }

    if (!isProcessing) processQueue();
}
export { queueRequest };
