import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Upload from './components/Upload';
import StylistUpload from './components/StylistUpload';
import ProductPurchase from './components/ProductPurchase';
import OutfitSuggestion from './components/OutfitSuggestion';


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Login handler to save token
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // Logout handler to remove token
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Register Route */}
          <Route path="/register" element={<Register />} />

          {/* Login Route */}
          <Route
            path="/login"
            element={token ? <Navigate to="/upload" /> : <Login setToken={handleLogin} />}
          />

          {/* Upload Route (Protected) */}
          <Route
            path="/upload"
            element={token ? <Upload token={token} handleLogout={handleLogout} /> : <Navigate to="/login" />}
          />

          {/* Default Route, redirects to login if no specific route matches */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* StylistUpload Route */}
          <Route
            path="/stylist/upload"
            element={<StylistUpload handleLogout={handleLogout} />}
          />

          {/* ProductPurchase Route */}
          <Route path="/purchase" element={<ProductPurchase />} />

          <Route path="/outfit-suggestion" element={<OutfitSuggestion />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
