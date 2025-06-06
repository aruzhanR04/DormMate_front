import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import api from '../../api';
import '../../styles/AdminActions.css';
import viewIcon from '../../assets/icons/viewIcon.svg';
import editIcon from '../../assets/icons/editIcon.svg';
import deleteIcon from '../../assets/icons/deleteIcon.svg';
import searchIcon from '../../assets/icons/Search.svg';
import AdminCreateModal from './AdminCreateModal';
import AdminViewModal from './AdminViewModal';
import AdminEditModal from './AdminEditModal';
import AdminAdminDeleteModal from './AdminAdminDeleteModal';

const ITEMS_PER_PAGE = 10;

const AdminListPage = () => {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [viewAdmin, setViewAdmin] = useState(null);
  const [editAdmin, setEditAdmin] = useState(null);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admins/');
      setAdmins(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (e) {
      setAdmins([]);
    }
  };

  const handleDelete = async (admin) => {
    if (!window.confirm(`Удалить администратора ${admin.first_name} ${admin.last_name}?`)) return;
    try {
      await api.delete(`/admins/${admin.id}/`);
      fetchAdmins();
    } catch {}
  };

  const filtered = admins.filter(a =>
    `${a.first_name} ${a.last_name} ${a.middle_name} ${a.s}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const adminsPaginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area" style={{ position: 'relative', minHeight: '100vh' }}>
        <div className="header-row">
          <h1>Администраторы</h1>
          <button className="save-btn" onClick={() => setShowAddModal(true)}>
            Добавить администратора
          </button>
        </div>
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <img src={searchIcon} alt="search" className="search-icon" />
        </div>
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
              {adminsPaginated.length > 0 ? adminsPaginated.map(admin => (
                <tr key={admin.id}>
                  <td>
                    {admin.avatar ? (
                      <img src={admin.avatar} className="student-avatar" alt="avatar" />
                    ) : (
                      <div className="student-avatar-placeholder">
                        {admin.first_name?.[0]}{admin.last_name?.[0]}
                      </div>
                    )}
                  </td>
                  <td>{admin.s} {admin.id}</td>
                  <td>{admin.first_name}</td>
                  <td>{admin.last_name}</td>
                  <td>{admin.middle_name}</td>
                  <td>{admin.role}</td>
                  <td>
                    <img
                      src={editIcon}
                      alt="Редактировать"
                      className="operation-icon"
                      onClick={() => setEditAdmin(admin)}
                    />
                    <img
                      src={viewIcon}
                      alt="Просмотр"
                      className="operation-icon"
                      onClick={() => setViewAdmin(admin)}
                    />
                    <img
                      src={deleteIcon}
                      alt="Удалить"
                      className="operation-icon"
                      onClick={() => handleDelete(admin)}
                    />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7}>Нет данных для отображения.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`pagination-btn${page === idx + 1 ? " active" : ""}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}

       {showAddModal && (
        <AdminCreateModal
            onClose={() => setShowAddModal(false)}
            onSaved={fetchAdmins}
            api={api}
        />
        )}
        {viewAdmin && (
        <AdminViewModal admin={viewAdmin} onClose={() => setViewAdmin(null)} />
        )}
        {editAdmin && (
        <AdminEditModal
            admin={editAdmin}
            onClose={() => setEditAdmin(null)}
            onSaved={fetchAdmins}
            api={api}
        />
        )}
      </div>
    </div>
  );
};

export default AdminListPage;
