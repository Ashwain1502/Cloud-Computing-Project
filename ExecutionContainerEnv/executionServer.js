/* eslint-disable no-unused-vars */
import express, { json } from "express";
import { VM } from "vm2";
import fs from "fs";



const app = express();
app.use(json());

let containerId = null;

const getContainerId = () => {
    if (containerId !== null) return containerId; // Use cached value

    try {
        const cgroup = fs.readFileSync('/proc/self/cgroup', 'utf8');
        const match = cgroup.match(/docker\/([a-f0-9]{64})/);
        containerId = match ? match[1] : '';
    } catch (error) {
        containerId = '';
    }

    return containerId;
};


app.post("/execute", (req, res) => {
    try {
        const code = req.body.code;
        if (!code) {
            return res.status(400).json({ error: "No code provided" });
        }

        let logs = [];
        const vm = new VM({
            timeout: 1000,
            sandbox: {
                console: {
                    log: (...args) => logs.push(args.join(" ")), // Capture logs
                },
            },
        });

        const result = vm.run(`${code}`);
        const containerId = getContainerId();
        res.json({ output: result, logs, containerId });

    } catch (error) {
        console.error("Execution Error:", error);
        const containerId = getContainerId();
        res.status(400).json({ error: error.message, containerId });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
