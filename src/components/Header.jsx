import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header = ({ runCode, setOutput, isRunning }) => {
  return (
    <AppBar position="static" sx={{ bgcolor: "#333" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          React Code Editor
        </Typography>
        <Button
          color="success"
          variant="contained"
          onClick={runCode}
          sx={{ mr: 2 }}
          disabled={isRunning}
        >
          Run
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => setOutput("")}
        >
          Clear
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
