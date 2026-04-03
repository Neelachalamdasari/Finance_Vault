import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            if (payload.exp * 1000 < Date.now()) {
                logout(); 
            } else {
                setUser(payload.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Invalid token:", error);
            logout(); 
        }
    }
    setLoading(false);
  }, [token]);

  const signup = async (formData) => {
    try {
      const res = await api.post('/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
      toast.success('Signup successful! Welcome.');
      navigate('/dashboard');
    } catch (err) {
     
      if (err.response) {
        
        console.error(err.response.data);
        toast.error(err.response.data.msg || 'Signup failed.');
      } else {
        
        console.error('Error:', err.message);
        toast.error('Cannot connect to the server.');
      }
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
  
      if (err.response) {
        
        console.error(err.response.data);
        toast.error(err.response.data.msg || 'Login failed.');
      } else {
        // The server is not running or there was a network error
        console.error('Error:', err.message);
        toast.error('Cannot connect to the server.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;