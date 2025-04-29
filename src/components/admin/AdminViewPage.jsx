import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';
import cicon from '../../assets/icons/cicon.png';

const AdminViewPage = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState(null);

  const fetchAdmins = async () => {
    try {
      const response = await api.get('/admins/');
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setAdmins(data);
    } catch (error) {
      console.error('Ошибка при загрузке администраторов:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке данных администраторов' });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (admin) => {
    const confirm = window.confirm(
      `Точно ли вы хотите удалить администратора ${admin.first_name} ${admin.last_name} (${admin.s})?`
    );
    if (!confirm) return;
    try {
      await api.delete(`/admins/${admin.id}/`);
      setAdmins(prev => prev.filter(a => a.id !== admin.id));
      setMessage({ type: 'success', text: `Администратор ${admin.s} удалён` });
    } catch (error) {
      console.error('Ошибка при удалении администратора:', error);
      setMessage({ type: 'error', text: 'Не удалось удалить администратора' });
    }
  };

  const renderRoleLabel = (role) => {
    switch (role) {
      case 'SUPER':
        return 'Главный администратор';
      case 'OP':
        return 'Оператор';
      case 'REQ':
        return 'Администратор по работе с заявками';
      default:
        return '-';
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Список администраторов</h1>
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>S</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Отчество</th>
                <th>Роль</th>
                <th>Операции</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map(admin => (
                  <tr key={admin.id}>
                    <td>
                      {admin.avatar ? (
                        <img
                          src={admin.avatar}
                          alt="Avatar"
                          className="student-avatar"
                        />
                      ) : (
                        <div className="student-avatar-placeholder" />
                      )}
                    </td>
                    <td>{admin.s}</td>
                    <td>{admin.first_name}</td>
                    <td>{admin.last_name}</td>
                    <td>{admin.middle_name || '-'}</td>
                    <td>{renderRoleLabel(admin.role)}</td>
                    <td>
                      {/* Кнопка удаления */}
                      <button
                        className="operation-icon delete-icon"
                        onClick={() => handleDelete(admin)}
                      >
                        🗑️
                      </button>
                      {/* Кнопка редактирования */}
                      <img
                        src={cicon}
                        alt="Редактировать"
                        className="operation-icon"
                        onClick={() => navigate(`/admin/admins/edit/${admin.id}`)}
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
      </div>
    </div>
  );
};

export default AdminViewPage;
