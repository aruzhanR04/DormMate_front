import React, { useState, useEffect } from 'react';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';
import viewIcon from '../../assets/icons/viewIcon.svg';
import editIcon from '../../assets/icons/editIcon.svg';
import deleteIcon from '../../assets/icons/deleteIcon.svg';
import AdminDormitoryAddModal from './AdminDormitoryAddModal';
import AdminDormitoryEditModal from './AdminDormitoryEditModal';
import AdminDormitoryViewModal from './AdminDormitoryViewModal';
import AdminDormitioriDeleteModal from './AdminDormitoryDeleteModal';

const AdminDormitoriesPage = () => {
  const [dormitories, setDormitories] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [deleteModalDorm, setDeleteModalDorm] = useState(null)
  const [roomsCount, setRoomsCount] = useState() 

  const fetchDormitories = async () => {
    try {
      const response = await api.get('/dorms');
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


  const fetchRoomsCount = async () => {
    try {
      const response = await api.get('/dorms/count');
      // Преобразуем массив в объект { [dormId]: { ...roomCounts } }
      const roomDataByDorm = {};
      response.data.dorms.forEach(dorm => {
        roomDataByDorm[dorm.id] = dorm;
      });
      setRoomsCount(roomDataByDorm);
    } catch (err) {
      setMessage({ type: 'error', text: 'Не удалось загрузить статистику комнат' });
    }
  };



  useEffect(() => {
    fetchDormitories();
    fetchRoomsCount()
  }, []);


  const handleRefresh = () => {
    fetchDormitories()
    setShowAddModal(false)
    setShowEditModal(null)
    setShowViewModal(null)
    setDeleteModalDorm(null)
  }



  const handleDeleteDorm = async (dorm) => {
    try {
      await api.delete(`/dorms/${dorm.id}/`)
      handleRefresh() // обновить список
      setDeleteModalDorm(null)
    } catch (error) {
      console.error("Ошибка при удалении студента:", error)
    }
  }

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
              {Array.isArray(dormitories) && dormitories.length > 0 ? (
                dormitories.map(dorm => (
                  <tr key={dorm.id}>
                    <td>{dorm.name}</td>
                    <td>{dorm.total_places}</td>
                    <td>{roomsCount && roomsCount[dorm.id] ? roomsCount[dorm.id].rooms_for_2 : '-'}</td>
                    <td>{roomsCount && roomsCount[dorm.id] ? roomsCount[dorm.id].rooms_for_3 : '-'}</td>
                    <td>{roomsCount && roomsCount[dorm.id] ? roomsCount[dorm.id].rooms_for_4 : '-'}</td>

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
                        onClick={() => setDeleteModalDorm(dorm)}
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
        {deleteModalDorm && (
        <AdminDormitioriDeleteModal
          dorm={deleteModalDorm}
          onClose={() => setDeleteModalDorm(null)}
          onConfirm={handleDeleteDorm}
        />
      )}
      </div>
    </div>
  );
};

export default AdminDormitoriesPage;
