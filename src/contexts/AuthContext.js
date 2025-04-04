import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('isAuthenticated');
    return stored === 'true';
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [isAuthenticated, currentUser]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
      console.log('Login response:', data); // Debug log
  
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }
  
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      return true;
    } catch (err) {
      console.error('Login error:', err.message);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};