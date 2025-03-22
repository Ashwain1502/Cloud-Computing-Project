import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FreeEditor = () => {
  const [code, setCode] = useState("// Free editor: Limited functionality");
  const [output, setOutput] = useState("");
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [timeTaken, setTimeTaken] = useState(-1);


  const runCode = () => {
    let initialTime = new Date().getTime();
    
    setIsRunning(true);
    try {
      fetch("http://localhost:8080/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, premium: false }),
      })
        .then((response) => response.json())
        .then((data) => {
          setOutput(data.result !== undefined ? data.result : "");
          setTimeTaken(new Date().getTime() - initialTime);
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
      bgcolor="#f5f5f5"
      color="#000"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        p={2}
        bgcolor="#1e1e1e"
        color="#fff"
      >
        <Typography variant="h6">Free Editor</Typography>
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
            {timeTaken >= 0 && (
              <Box
                component="pre"
                sx={{
                  color: "#FFEB3B",
                  fontSize: "1rem",
                  whiteSpace: "pre-wrap",
                  mt: 2,
                }}
              >
                {`Time taken: ${timeTaken} ms`}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" p={2} bgcolor="#1e1e1e">
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

export default FreeEditor;
