import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Проверка, является ли пользователь админом
  return isAdmin ? children : <Navigate to="/" />; // Перенаправление на главную, если не админ
};

export default AdminRoute;
