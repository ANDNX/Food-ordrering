import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { io } from 'socket.io-client';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import { P2PProvider } from './context/P2PContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4B2B',
    },
    secondary: {
      main: '#FFB800',
    },
  },
});

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <P2PProvider socket={socket}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </P2PProvider>
    </ThemeProvider>
  );
}

export default App; 