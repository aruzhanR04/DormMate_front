import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/AdminApplications.css';

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('date');
  const [editingApplicationId, setEditingApplicationId] = useState(null);
  const [dormitories, setDormitories] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchAllApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const fetchDormitories = async () => {
    try {
      const response = await api.get('/dormlist');
      setDormitories(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке списка общежитий:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке списка общежитий' });
    }
  };

  useEffect(() => {
    fetchAllApplications();
    fetchDormitories();
  }, []);

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
    // Дополнительная логика сортировки при необходимости
  };

  const handleApproveApplication = async (applicationId) => {
    try {
      await api.put(`/applications/${applicationId}/approve/`, { status: 'awaiting_payment' });
      setMessage({ type: 'success', text: 'Заявка успешно одобрена' });
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? { ...app, status: 'awaiting_payment' } : app)
      );
    } catch (error) {
      console.error('Ошибка при одобрении заявки:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      await api.put(`/applications/${applicationId}/reject/`, { status: 'rejected' });
      setMessage({ type: 'success', text: 'Заявка успешно отклонена' });
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? { ...app, status: 'rejected' } : app)
      );
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleChangeDormitory = async (applicationId, dormitoryName) => {
    if (!dormitoryName) return;
    try {
      await api.put(`/applications/${applicationId}/change-dormitory/`, { dorm_name: dormitoryName });
      setMessage({ type: 'success', text: 'Общежитие изменено' });
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? { ...app, dormitory_choice: dormitoryName } : app)
      );
      setEditingApplicationId(null);
    } catch (error) {
      console.error('Ошибка при изменении общежития:', error);
      setMessage({ type: 'error', text: 'Ошибка при изменении общежития' });
    }
  };

  const handleApproveAll = () => {
    applications.forEach(app => {
      if (app.priority) {
        handleApproveApplication(app.id);
      }
    });
  };

  const handleCardClick = (id) => {
    navigate(`/admin/applications/${id}`);
  };

  return (
    <div className="admin-applications">
      <h1>Заявки</h1>
      <div className="applications-header">
        <select value={sortCriteria} onChange={handleSortChange}>
          <option value="date">По дате</option>
          <option value="priority">По приоритету</option>
          <option value="status">По статусу</option>
        </select>
        <button onClick={handleApproveAll}>Одобрить</button>
        <button onClick={() => navigate('/admin/applications/distribute')}>Расселить</button>
      </div>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      <div className="applications-list">
        {applications.map(app => (
          <div key={app.id} className="application-card" onClick={() => handleCardClick(app.id)}>
            <p><strong>ID:</strong> {app.id}</p>
            <p><strong>Студент:</strong> {app.student.first_name} {app.student.last_name}</p>
            <p><strong>Курс:</strong> {app.student.course}</p>
            <p><strong>Статус:</strong> {app.status}</p>
            <div className="card-actions">
              <button onClick={(e) => { e.stopPropagation(); handleApproveApplication(app.id); }}>Одобрить</button>
              <button onClick={(e) => { e.stopPropagation(); handleRejectApplication(app.id); }}>Отклонить</button>
              {editingApplicationId === app.id ? (
                <div>
                  <select onChange={(e) => handleChangeDormitory(app.id, e.target.value)} defaultValue="">
                    <option value="" disabled>Выберите общежитие</option>
                    {dormitories.map(dorm => (
                      <option key={dorm.id} value={dorm.name}>{dorm.name}</option>
                    ))}
                  </select>
                  <button onClick={(e) => { e.stopPropagation(); setEditingApplicationId(null); }}>Отменить</button>
                </div>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); setEditingApplicationId(app.id); }}>Изменить общежитие</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {/* Здесь разместите компонент пагинации */}
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
