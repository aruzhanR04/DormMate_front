import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AdminSidebar from './AdminSidebar';
import '../styles/AdminActions.css';
import upicon from '../assets/upicon.png';

const AdminStudentsPage = () => {
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
          <button onClick={() => navigate('/admin/students/add-student')}>Добавить студента</button>
          <button onClick={() => navigate('/admin/students/work')}>Просмотр всех студентов</button>
        </div>
        <div className="excel-upload-section">
          <h2>Загрузка Excel файла</h2>
          <div className="file-upload-wrapper">
            <input type="file" onChange={handleFileChange} id="excelInput" />
            <label htmlFor="excelInput" className="upload-icon-wrapper">
              <img src={upicon} alt="Upload Excel" className="upload-icon" />
            </label>
          </div>
        </div>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
      </div>
    </div>
  );
};

export default AdminStudentsPage;
