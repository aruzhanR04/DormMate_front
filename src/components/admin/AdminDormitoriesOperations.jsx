import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';
import wicon from '../../assets/icons/wicon.png';
import cicon from '../../assets/icons/cicon.png';

const AdminDormitoriesOperations = () => {
  const navigate = useNavigate();
  const [dormitories, setDormitories] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDormitories = async () => {
    try {
      const response = await api.get('/dormlist');
      const dormData = Array.isArray(response.data)
        ? response.data
        : (response.data.results ? response.data.results : Object.values(response.data));
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
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Общежития</h1>
        {/* <div className="actions-list">
          <button onClick={() => navigate('/admin/dormitories/add')}>Добавить общежитие</button>
          <button onClick={() => navigate('/admin/dormitories/update')}>Изменение</button>
          <button onClick={() => navigate('/admin/dormitories/delete')}>Удаление</button>
        </div> */}
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
        <div className="dormitories-table-container">
          <table className="dormitories-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Мест</th>
                <th>Комнаты на 2</th>
                <th>Комнаты на 3</th>
                <th>Комнаты на 4</th>
                <th>Стоимость</th>
                <th>Операции</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dormitories) && dormitories.length > 0 ? (
                dormitories.map(dorm => (
                  <tr key={dorm.id}>
                    <td>{dorm.name}</td>
                    <td>{dorm.total_places}</td>
                    <td>{dorm.rooms_for_two}</td>
                    <td>{dorm.rooms_for_three}</td>
                    <td>{dorm.rooms_for_four}</td>
                    <td>{dorm.cost}</td>
                    <td>
                      <img src={wicon} alt="Просмотр" className="action-icon" onClick={() => navigate(`/admin/dormitories/view-one/${dorm.id}`)} />
                      <img src={cicon} alt="Изменение" className="action-icon" onClick={() => navigate(`/admin/dormitories/change/${dorm.id}`)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Нет данных для отображения.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDormitoriesOperations;
