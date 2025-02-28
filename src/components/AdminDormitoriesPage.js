import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/AdminActions.css';

const AdminDormitoriesPage = () => {
  const navigate = useNavigate();
  const [dormitories, setDormitories] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDormitories = async () => {
    try {
      const response = await api.get('/dormlist');
      const dormData = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data);
      setDormitories(dormData);
    } catch (error) {
      console.error('Ошибка при загрузке списка общежитий:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке списка общежитий' });
    }
  };

  useEffect(() => {
    fetchDormitories();
  }, []);

  return (
    <div className="admin-actions">
      <h1>Общежития</h1>
      <div className="actions-list">
        <button onClick={() => navigate('/admin/dormitories/view-all')}>Просмотр всех</button>
        <button onClick={() => navigate('/admin/dormitories/view-one')}>Просмотр одного</button>
        <button onClick={() => navigate('/admin/dormitories/update')}>Изменение</button>
        <button onClick={() => navigate('/admin/dormitories/delete')}>Удаление</button>
      </div>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      <div className="dormitories-list">
  {Array.isArray(dormitories) && dormitories.length > 0 ? (
    dormitories
      .filter(dorm => dorm !== null && dorm !== undefined)
      .map((dorm) => (
        <div key={dorm.id}>
          <p>{dorm.name}</p>
        </div>
      ))
  ) : (
    <p>Нет данных для отображения.</p>
  )}
</div>

    </div>
  );
};

export default AdminDormitoriesPage;
