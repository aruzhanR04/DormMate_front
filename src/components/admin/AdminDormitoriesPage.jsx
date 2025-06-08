// src/pages/admin/AdminDormitoriesPage.jsx
import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminActions.css";

import viewIcon from "../../assets/icons/viewIcon.svg";
import editIcon from "../../assets/icons/editIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";

import AdminDormitoryAddModal from "./AdminDormitoryAddModal";
import AdminDormitoryEditModal from "./AdminDormitoryEditModal";
import AdminDormitoryViewModal from "./AdminDormitoryViewModal";
import AdminDormitoryDeleteModal from "./AdminDormitoryDeleteModal";

import { useI18n } from "../../i18n/I18nContext";

const ITEMS_PER_PAGE = 4;

const AdminDormitoriesPage = () => {
  const { lang, t } = useI18n();

  const [dormitories, setDormitories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsCount, setRoomsCount] = useState({});
  const [message, setMessage] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [deleteModalDorm, setDeleteModalDorm] = useState(null);

  const fetchDormitories = async () => {
    try {
      const { data } = await api.get("/dorms/", {
        params: { page: currentPage, page_size: ITEMS_PER_PAGE }
      });
      setDormitories(data.results || []);
      setTotalCount(data.count || 0);
    } catch {
      setMessage({
        type: "error",
        text: t("adminDormitoriesPage.messages.loadError")
      });
    }
  };

  const fetchRoomsCount = async () => {
    try {
      const { data } = await api.get("/dorms/count/");
      const byDorm = {};
      data.dorms.forEach((d) => {
        byDorm[d.id] = {
          rooms_for_2: d.rooms_for_2,
          rooms_for_3: d.rooms_for_3,
          rooms_for_4: d.rooms_for_4,
          total_rooms: d.total_rooms
        };
      });
      setRoomsCount(byDorm);
    } catch {
      setMessage({
        type: "error",
        text: t("adminDormitoriesPage.messages.statsError")
      });
    }
  };

  useEffect(() => {
    fetchDormitories();
    fetchRoomsCount();
  }, [currentPage]);

  const handleDeleteDorm = async (dorm) => {
    try {
      await api.delete(`/dorms/${dorm.id}/`);
      setMessage({
        type: "success",
        text: t("adminDormitoriesPage.messages.deleteSuccess")
      });
      const newTotal = totalCount - 1;
      const pages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      setCurrentPage((p) => (p > pages ? pages || 1 : p));
      setDeleteModalDorm(null);
    } catch {
      setMessage({
        type: "error",
        text: t("adminDormitoriesPage.messages.deleteError")
      });
    }
  };

  const handleRefresh = () => {
    fetchDormitories();
    fetchRoomsCount();
    setShowAddModal(false);
    setShowEditModal(null);
    setShowViewModal(null);
    setDeleteModalDorm(null);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* Header */}
        <div className="header-row">
          <h1>{t("adminDormitoriesPage.title")}</h1>
          <div className="actions-list">
            <button onClick={() => setShowAddModal(true)}>
              {t("adminDormitoriesPage.buttons.add")}
            </button>
          </div>
        </div>

        {/* Flash message */}
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {/* Dormitories table */}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>{t("adminDormitoriesPage.table.headers.name")}</th>
                <th>{t("adminDormitoriesPage.table.headers.places")}</th>
                <th>{t("adminDormitoriesPage.table.headers.roomsFor2")}</th>
                <th>{t("adminDormitoriesPage.table.headers.roomsFor3")}</th>
                <th>{t("adminDormitoriesPage.table.headers.roomsFor4")}</th>
                <th>{t("adminDormitoriesPage.table.headers.cost")}</th>
                <th>{t("adminDormitoriesPage.table.headers.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {dormitories.length > 0 ? (
                dormitories.map((dorm) => {
                  // Select name based on current language
                  const title =
                    dorm[`name_${lang}`] || dorm.name_ru;

                  return (
                    <tr key={dorm.id}>
                      <td>{title} {dorm.id}</td>
                      <td>{dorm.total_places}</td>
                      <td>{roomsCount[dorm.id]?.rooms_for_2 ?? "-"}</td>
                      <td>{roomsCount[dorm.id]?.rooms_for_3 ?? "-"}</td>
                      <td>{roomsCount[dorm.id]?.rooms_for_4 ?? "-"}</td>
                      <td>{dorm.cost}</td>
                      <td>
                        <img
                          src={viewIcon}
                          alt={t("adminDormitoriesPage.icons.alt.view")}
                          className="operation-icon"
                          onClick={() => setShowViewModal(dorm.id)}
                        />
                        <img
                          src={editIcon}
                          alt={t("adminDormitoriesPage.icons.alt.edit")}
                          className="operation-icon"
                          onClick={() => setShowEditModal(dorm.id)}
                        />
                        <img
                          src={deleteIcon}
                          alt={t("adminDormitoriesPage.icons.alt.delete")}
                          className="operation-icon"
                          onClick={() => setDeleteModalDorm(dorm)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">
                    {t("adminDormitoriesPage.table.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              {t("adminDormitoriesPage.pagination.prev")}
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn${
                    currentPage === pageNum ? " active" : ""
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {t("adminDormitoriesPage.pagination.next")}
            </button>
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AdminDormitoryAddModal
            onClose={() => {
              setShowAddModal(false);
              handleRefresh();
            }}
          />
        )}
        {showEditModal && (
          <AdminDormitoryEditModal
            dormId={showEditModal}
            onClose={() => {
              setShowEditModal(null);
              handleRefresh();
            }}
          />
        )}
        {showViewModal && (
          <AdminDormitoryViewModal
            dormId={showViewModal}
            onClose={() => setShowViewModal(null)}
          />
        )}
        {deleteModalDorm && (
          <AdminDormitoryDeleteModal
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
