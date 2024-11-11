import React, { useState } from 'react';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
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
      const response = await fetch('http://127.0.0.1:8000/api/v1/upload-excel/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Данные успешно загружены и обновлены' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Ошибка загрузки файла' });
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleDistributeStudents = async (apiUrl) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: data.detail || 'Студенты успешно распределены' });
      } else {
        setMessage({ type: 'error', text: data.detail || 'Ошибка распределения студентов' });
      }
    } catch (error) {
      console.error('Ошибка при распределении студентов:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>

      <div className="section">
        <h2>Загрузка Excel файла</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Загрузить файл</button>
      </div>

      <div className="section">
        <h2>Распределение студентов</h2>
        <button onClick={() => handleDistributeStudents('http://127.0.0.1:8000/api/v1/distribute-students/')}>
          Распределить студентов по заявкам
        </button>
        <button onClick={() => handleDistributeStudents('http://127.0.0.1:8000/api/v1/distribute-students2/')}>
          Распределить студентов по комнатам
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
