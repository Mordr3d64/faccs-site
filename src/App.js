import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react';

// Components
import NavPanel from './components/NavPanel';
import ProtectedRoute from './components/ProtectedRoute';
import AddAnnouncement from './components/AddAnnouncement'; // Add this import

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Announcements from './components/Announcements';
import Contact from './components/Contact';
import Weather from './components/Weather';
import FAQs from './components/FAQs';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavPanel />
          <header className="App-header">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route 
                path="/add-announcement" 
                element={
                  <ProtectedRoute>
                    <AddAnnouncement />
                  </ProtectedRoute>
                } 
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </header>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;