import { useState } from "react";
import Editor from "./components/Editor";
import Output from "./components/Output";
import Header from "./components/Header";
import { Box } from "@mui/material";

const App = () => {
  const [code, setCode] = useState("// Write JavaScript code here...");
  const [output, setOutput] = useState("Run the code to see output here...");

  const runCode = () => {
    try {
      const result = new Function(code)(); // Executes the code
      
      setOutput(result !== undefined ? result.toString() : ""); // Display result
    } catch (error) {
      setOutput(error.toString()); // Show errors in output
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" bgcolor="#121212">
      <Header runCode={runCode} setOutput={setOutput} />
      <Box display="flex" flex={1}>
        <Editor code={code} setCode={setCode} />
        <Output output={output} />
      </Box>
    </Box>
  );
};

export default App;