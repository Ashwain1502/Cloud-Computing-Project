import express, { json } from "express";
import { VM } from "vm2";

const app = express();
app.use(json());

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

        console.log("Executing Code:", code);
        const result = vm.run(`${code}`);
        console.log("Execution Result:", result);

        res.json({ output: result, logs });

    } catch (error) {
        console.error("Execution Error:", error);
        res.status(400).json({ error: error.message});
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
