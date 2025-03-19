import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#121212' }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: 'center', bgcolor: '#1e1e1e', color: '#fff' }}>
        <Typography variant="h4" gutterBottom>Choose Your Plan</Typography>
        <Box display="flex" justifyContent="space-around" mt={4} gap={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/free')}
            sx={{ p: 2, minWidth: 150 }}
          >
            Free Plan
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/premium')}
            sx={{ p: 2, minWidth: 150, bgcolor: '#FFD700', color: '#000' }}
          >
            Premium Plan
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LandingPage;