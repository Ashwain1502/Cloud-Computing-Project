import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FreeEditor = () => {
  const [code, setCode] = useState("// Free editor: Limited functionality");
  const [output, setOutput] = useState("");
  const navigate = useNavigate();

  const runCode = () => {
    try {
      const log = [];
      const consoleLog = (msg) => log.push(msg);
      const result = new Function("console", code)(consoleLog);
      setOutput(log.length > 0 ? log.join("\n") : result !== undefined ? result.toString() : "");
    } catch (error) {
      setOutput(error.toString());
    }
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column" bgcolor="#f5f5f5" color="#000">
      <Box display="flex" justifyContent="space-between" p={2} bgcolor="#1e1e1e" color="#fff">
        <Typography variant="h6">Free Editor</Typography>
        <Button variant="contained" color="secondary" onClick={() => navigate("/")}>Back</Button>
      </Box>
      <Box display="flex" flex={1}>
        <Box width="50%" p={2}>
          <Paper elevation={3} sx={{ height: "100%" }}>
            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-light"
              value={code}
              onChange={(newCode) => setCode(newCode)}
            />
          </Paper>
        </Box>
        <Box width="50%" p={2}>
          <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
            <Typography variant="h6">Output:</Typography>
            <Box component="pre" sx={{ color: "#4CAF50", fontSize: "1rem", whiteSpace: "pre-wrap" }}>
              {output || "Run the code to see output here..."}
            </Box>
          </Paper>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" p={2} bgcolor="#1e1e1e">
        <Button variant="contained" color="primary" onClick={runCode}>Run</Button>
      </Box>
    </Box>
  );
};

export default FreeEditor;
