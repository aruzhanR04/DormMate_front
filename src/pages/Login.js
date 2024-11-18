import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Login.css';

const Login = () => {
  const [s, setS] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('custom_token/', { s, password });

      if (response.status === 200) {
        const { access, refresh } = response.data;
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        const userTypeResponse = await api.get('usertype/');
        const { user_type } = userTypeResponse.data;
        
        localStorage.setItem('isAdmin', user_type === 'admin');
        
        navigate(user_type === 'admin' ? '/admin' : '/profile');
      }
    } catch (err) {
      const errorData = err.response?.data || {};
      setError(errorData.detail || 'Ошибка авторизации');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>NARXOZ UNIVERSITY</h1>
        <p>Dorm Mate</p>
      </div>
      <div className="login-right">
        <form onSubmit={handleSubmit}>
          <h2 className="login-header">Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="text"
            placeholder="User ID (s)"
            value={s}
            onChange={(e) => setS(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn">Войти</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
