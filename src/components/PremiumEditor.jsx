import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PremiumEditor = () => {
  const [code, setCode] = useState(
    "// Premium editor: Full functionality and enhanced UI"
  );
  const [output, setOutput] = useState("");
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    try {
      fetch("http://localhost:8080/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, premium: true }),
      })
        .then((response) => response.json())
        .then((data) => {
          setOutput(data.result !== undefined ? data.result : "");
          // if()
          setIsRunning(false);
        })
        .catch((error) => {
          setOutput(error.toString());
          setIsRunning(false);
        });
    } catch (error) {
      setOutput(error.toString());
      setIsRunning(false);
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="#000"
      color="#fff"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        p={2}
        bgcolor="#FFD700"
        color="#000"
      >
        <Typography variant="h6">Premium Editor</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </Box>
      <Box display="flex" flex={1}>
        <Box width="50%" p={2}>
          <Paper
            elevation={3}
            sx={{ height: "100%", bgcolor: "#333", color: "#fff" }}
          >
            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(newCode) => setCode(newCode)}
            />
          </Paper>
        </Box>
        <Box width="50%" p={2}>
          <Paper
            elevation={3}
            sx={{ height: "100%", p: 2, bgcolor: "#1e1e1e" }}
          >
            <Box
              component="pre"
              sx={{
                color: "#2196F3",
                fontSize: "1rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {output.logs?.join("\n")}
            </Box>
            <Box
              component="pre"
              sx={{
                color: "#4CAF50",
                fontSize: "1rem",
                whiteSpace: "pre-wrap",
                mt: 2,
              }}
            >
              {output.output || "Run the code to see the output"}
            </Box>
          </Paper>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" p={2} bgcolor="#FFD700">
        <Button
          variant="contained"
          color="primary"
          onClick={runCode}
          disabled={isRunning}
        >
          Run
        </Button>
      </Box>
    </Box>
  );
};

export default PremiumEditor;
