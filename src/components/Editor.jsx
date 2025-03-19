// not being used anywhere for now. Just here for testing.

import MonacoEditor from "@monaco-editor/react";
import { Box, Paper } from "@mui/material";

const Editor = ({ code, setCode }) => {
  return (
    <Box width="50%" p={2}>
      <Paper elevation={3} sx={{ height: "100%", overflow: "hidden" }}>
        <MonacoEditor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(newCode) => setCode(newCode)}
        />
      </Paper>
    </Box>
  );
};

export default Editor;
