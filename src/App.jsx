import { useState } from "react";
import Editor from "./components/Editor";
import Output from "./components/Output";
import Header from "./components/Header";
import { Box } from "@mui/material";

const App = () => {
  const [code, setCode] = useState("// Write JavaScript code here...");
  const [output, setOutput] = useState("Run the code to see output here...");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true); 
    try {
      
      fetch("http://localhost:8080/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          setOutput(data.result !== undefined ? data.result : "");
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
    <Box display="flex" flexDirection="column" height="100vh" bgcolor="#121212">
      <Header
        runCode={runCode}
        setOutput={setOutput}
        isRunning={isRunning}
      />
      <Box display="flex" flex={1}>
        <Editor code={code} setCode={setCode} />
        <Output output={output} />
      </Box>
    </Box>
  );
};

export default App;
