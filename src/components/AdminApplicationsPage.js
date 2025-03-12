import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/AdminActions.css';
import AdminSidebar from './AdminSidebar';

const AdminApplicationsPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    try {
      const response = await api.get('/students/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_data.xlsx');
      document.body.appendChild(link);
      link.click();
      setMessage({ type: 'success', text: 'Файл успешно выгружен' });
    } catch (error) {
      console.error('Ошибка при выгрузке данных:', error);
      setMessage({ type: 'error', text: 'Ошибка при выгрузке данных' });
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Заявки</h1>
        <div className="actions-list">
          <button onClick={() => navigate('/admin/applications/select')}>
            Отобрать студентов для проживания
          </button>
          <button onClick={() => navigate('/admin/applications/distribute')}>
            Распределить студентов по комнатам
          </button>
          <button onClick={handleExport}>
            Выгрузить заселенных студентов
          </button>
        </div>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
