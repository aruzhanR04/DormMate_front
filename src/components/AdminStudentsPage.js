import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/AdminActions.css';

const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/upload-excel/', formData);
      setMessage({ type: 'success', text: 'Данные успешно загружены и обновлены' });
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleExportStudents = async () => {
    try {
      const response = await api.get('/export-students/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_in_dorm.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setMessage({ type: 'success', text: 'Файл успешно выгружен!' });
    } catch (error) {
      console.error('Ошибка при выгрузке студентов:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  return (
    <div className="admin-actions">
      <h1>Студенты</h1>
      <div className="actions-list">
        <button onClick={() => navigate('/admin/students/add-excel')}>Добавить по Excel</button>
        <button onClick={() => navigate('/admin/students/add-one')}>Добавить одного</button>
        <button onClick={() => navigate('/admin/students/view-all')}>Просмотр всех</button>
        <button onClick={() => navigate('/admin/students/view-one')}>Просмотр одного</button>
        <button onClick={() => navigate('/admin/students/update-one')}>Изменение одного</button>
        <button onClick={() => navigate('/admin/students/delete-one')}>Удаление</button>
      </div>
      <div className="excel-upload-section">
        <h2>Загрузка Excel файла</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Загрузить файл</button>
        <button onClick={handleExportStudents}>Выгрузить студентов</button>
      </div>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default AdminStudentsPage;
