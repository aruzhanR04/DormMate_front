import React, { useState, useEffect } from 'react';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';
import viewIcon from '../../assets/icons/viewIcon.svg';
import editIcon from '../../assets/icons/editIcon.svg';
import deleteIcon from '../../assets/icons/deleteIcon.svg';
import searchIcon from '../../assets/icons/Search.svg';
import AdminDormitoryAddModal from './AdminDormitoryAddModal';
import AdminDormitoryEditModal from './AdminDormitoryEditModal';
import AdminDormitoryViewModal from './AdminDormitoryViewModal';

const AdminDormitoriesPage = () => {
  const [dormitories, setDormitories] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null); 
  const [search, setSearch] = useState(''); 

  const fetchDormitories = async () => {
    try {
      const response = await api.get('/dormlist');
      const dormData = Array.isArray(response.data)
        ? response.data
        : (response.data.results ? response.data.results : Object.values(response.data));
      setDormitories(dormData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при загрузке списка общежитий' });
    }
  };

  const handleDeleteDormitory = async (dormId) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить это общежитие?');
    if (!confirmed) return;
    try {
      await api.delete(`/dorms/${dormId}/`);
      setMessage({ type: 'success', text: 'Общежитие успешно удалено' });
      fetchDormitories();
    } catch {
      setMessage({ type: 'error', text: 'Ошибка при удалении общежития' });
    }
  };

  useEffect(() => {
    fetchDormitories();
  }, []);

  // Фильтрация по поиску
  const filteredDormitories = dormitories.filter(
    d =>
      `${d.name} ${d.cost} ${d.total_places}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="header-row">
          <h1>Управление общежитиями</h1>
          <div className="actions-list">
            <button onClick={() => setShowAddModal(true)}>Добавить общежитие</button>
          </div>
        </div>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>

        <div className="students-table-container">
          <table className="students-table">
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
              {Array.isArray(filteredDormitories) && filteredDormitories.length > 0 ? (
                filteredDormitories.map(dorm => (
                  <tr key={dorm.id}>
                    <td>{dorm.name}</td>
                    <td>{dorm.total_places}</td>
                    <td>{dorm.rooms_for_two}</td>
                    <td>{dorm.rooms_for_three}</td>
                    <td>{dorm.rooms_for_four}</td>
                    <td>{dorm.cost}</td>
                    <td>
                      <img
                        src={viewIcon}
                        alt="Просмотр"
                        className="operation-icon"
                        onClick={() => setShowViewModal(dorm.id)}
                      />
                      <img
                        src={editIcon}
                        alt="Изменение"
                        className="operation-icon"
                        onClick={() => setShowEditModal(dorm.id)}
                      />
                      <img
                        src={deleteIcon}
                        alt="Удалить"
                        className="operation-icon"
                        onClick={() => handleDeleteDormitory(dorm.id)}
                      />
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

        {showAddModal && (
          <AdminDormitoryAddModal
            onClose={() => { setShowAddModal(false); fetchDormitories(); }}
          />
        )}
        {showEditModal && (
          <AdminDormitoryEditModal
            dormId={showEditModal}
            onClose={() => { setShowEditModal(null); fetchDormitories(); }}
          />
        )}
        {showViewModal && (
          <AdminDormitoryViewModal
            dormId={showViewModal}
            onClose={() => setShowViewModal(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDormitoriesPage;
