// src/pages/admin/AdminListPage.jsx

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
import { useI18n } from '../../i18n/I18nContext';

const ITEMS_PER_PAGE = 10;

const AdminListPage = () => {
  const { t } = useI18n();
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [viewAdmin, setViewAdmin] = useState(null);
  const [editAdmin, setEditAdmin] = useState(null);
  const [deleteAdmin, setDeleteAdmin] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admins/');
      setAdmins(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch {
      setAdmins([]);
    }
  };

  const confirmDelete = async (admin) => {
    try {
      await api.delete(`/admins/${admin.id}/`);
      setDeleteAdmin(null);
      fetchAdmins();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = admins.filter((a) =>
    `${a.first_name} ${a.last_name} ${a.middle_name} ${a.s}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area" style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Header */}
        <div className="header-row">
          <h1>{t('adminListPage.title')}</h1>
          <button className="save-btn" onClick={() => setShowAddModal(true)}>
            {t('adminListPage.buttons.add')}
          </button>
        </div>

        {/* Search */}
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder={t('adminListPage.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img
            src={searchIcon}
            alt={t('adminListPage.icons.alt.search')}
            className="search-icon"
          />
        </div>

        {/* Table */}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>{t('adminListPage.table.headers.avatar')}</th>
                <th>{t('adminListPage.table.headers.s')}</th>
                <th>{t('adminListPage.table.headers.first_name')}</th>
                <th>{t('adminListPage.table.headers.last_name')}</th>
                <th>{t('adminListPage.table.headers.middle_name')}</th>
                <th>{t('adminListPage.table.headers.role')}</th>
                <th>{t('adminListPage.table.headers.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      {admin.avatar ? (
                        <img
                          src={admin.avatar}
                          className="student-avatar"
                          alt="avatar"
                        />
                      ) : (
                        <div className="student-avatar-placeholder">
                          {admin.first_name?.[0]}
                          {admin.last_name?.[0]}
                        </div>
                      )}
                    </td>
                    <td>{`${admin.s} ${admin.id}`}</td>
                    <td>{admin.first_name}</td>
                    <td>{admin.last_name}</td>
                    <td>{admin.middle_name}</td>
                    <td>{admin.role}</td>
                    <td>
                      <img
                        src={editIcon}
                        alt={t('adminListPage.icons.alt.edit')}
                        className="operation-icon"
                        onClick={() => setEditAdmin(admin)}
                      />
                      <img
                        src={viewIcon}
                        alt={t('adminListPage.icons.alt.view')}
                        className="operation-icon"
                        onClick={() => setViewAdmin(admin)}
                      />
                      <img
                        src={deleteIcon}
                        alt={t('adminListPage.icons.alt.delete')}
                        className="operation-icon"
                        onClick={() => setDeleteAdmin(admin)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>{t('adminListPage.table.empty')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`pagination-btn${page === idx + 1 ? ' active' : ''}`}
                onClick={() => setPage(idx + 1)}
              >
                {t('adminListPage.pagination.page', { page: idx + 1 })}
              </button>
            ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AdminCreateModal
            onClose={() => setShowAddModal(false)}
            onSaved={fetchAdmins}
            api={api}
          />
        )}
        {viewAdmin && <AdminViewModal admin={viewAdmin} onClose={() => setViewAdmin(null)} />}
        {editAdmin && (
          <AdminEditModal
            admin={editAdmin}
            onClose={() => setEditAdmin(null)}
            onSaved={fetchAdmins}
            api={api}
          />
        )}
        {deleteAdmin && (
          <AdminAdminDeleteModal
            admin={deleteAdmin}
            onClose={() => setDeleteAdmin(null)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default AdminListPage;
