import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header = ({ runCode, setCode }) => {
  return (
    <AppBar position="static" sx={{ bgcolor: "#333" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          React Code Editor
        </Typography>
        <Button color="success" variant="contained" onClick={runCode} sx={{ mr: 2 }}>
          Run
        </Button>
        <Button color="error" variant="contained" onClick={() => setCode("// Write JavaScript code here...")}> 
          Clear
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
