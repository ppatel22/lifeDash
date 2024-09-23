import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DatabaseView from './components/DatabaseView';
import ProductivitySummary from './components/ProductivitySummary';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC',
    },
    secondary: {
      main: '#03DAC6',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 400,
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          '&:before': {
            display: 'none',
          },
          borderRadius: '16px',
          marginBottom: '16px',
          overflow: 'hidden',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C2C2C',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Productivity Dashboard
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/database">
              Database
            </Button>
            <Button color="inherit" component={Link} to="/productivity-summary">
              Productivity Summary
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/database" element={<DatabaseView />} />
          <Route path="/productivity-summary" element={<ProductivitySummary />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
