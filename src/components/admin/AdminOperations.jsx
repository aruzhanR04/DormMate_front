import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';
import upicon from '../../assets/icons/upicon.png';

const AdminOperations = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        await api.post('/upload-excel/', formData);
        setMessage({ type: 'success', text: 'Данные успешно загружены и обновлены' });
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
        setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
      }
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Студенты</h1>
        <div className="actions-list">
          <button onClick={() => navigate('/admin/admins/add')}>Добавить админа</button>
          <button onClick={() => navigate('/admin/admins/list')}>Просмотр всех админов</button>
        </div>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
      </div>
    </div>
  );
};

export default AdminOperations;
