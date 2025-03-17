import { Box, Paper, Typography } from "@mui/material";

const Output = ({ output }) => {
  return (
    <Box width="50%" p={2}>
      <Paper elevation={3} sx={{ height: "100%", p: 2, bgcolor: "#1e1e1e" }}>
        <Typography variant="h6" gutterBottom>Output:</Typography>
        <Box component="pre" sx={{ color: "#4CAF50", fontSize: "1rem", whiteSpace: "pre-wrap" }}>
          {output || "Run the code to see output here..."}
        </Box>
      </Paper>
    </Box>
  );
};

export default Output;
