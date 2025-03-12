// src/components/AdminDormitoriesPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../styles/AdminActions.css';

const AdminDormitoriesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Работа с общежитиями</h1>
        <div className="actions-list">
          <button onClick={() => navigate('/admin/dormitories/add')}>Добавить общежитие</button>
          <button onClick={() => navigate('/admin/dormitories/operations')}>Изменение</button>
          <button onClick={() => navigate('/admin/dormitories/delete')}>Удаление</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDormitoriesPage;
