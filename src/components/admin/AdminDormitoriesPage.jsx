// src/components/admin/AdminDormitoriesPage.jsx
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

const ITEMS_PER_PAGE = 4; // Должно совпадать с page_size у вас на сервере (StudentPagination.page_size)

const AdminDormitoriesPage = () => {
  // ------------------------------------------------------------------
  // 1. Локальное состояние
  // ------------------------------------------------------------------
  const [dormitories, setDormitories] = useState([]);   // текущая “порция” dorm-объектов
  const [totalCount, setTotalCount] = useState(0);       // общее число Dorm-объектов
  const [currentPage, setCurrentPage] = useState(1);     // номер текущей страницы
  const [roomsCount, setRoomsCount] = useState({});      // { [dormId]: { rooms_for_2, rooms_for_3, rooms_for_4, total_rooms } }
  const [message, setMessage] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [deleteModalDorm, setDeleteModalDorm] = useState(null);

  // ------------------------------------------------------------------
  // 2. Функция fetchDormitories: запрашивает /dorms/?page=...&page_size=...
  // ------------------------------------------------------------------
  const fetchDormitories = async () => {
    try {
      const params = {
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      };
      const response = await api.get("/dorms/", { params });
      const data = response.data;

      // DRF paginated response: { count, next, previous, results }
      setDormitories(Array.isArray(data.results) ? data.results : []);
      setTotalCount(typeof data.count === "number" ? data.count : 0);
    } catch (error) {
      setMessage({ type: "error", text: "Ошибка при загрузке списка общежитий" });
    }
  };

  // ------------------------------------------------------------------
  // 3. Функция fetchRoomsCount: запрашивает /dorms/count/
  // ------------------------------------------------------------------
  const fetchRoomsCount = async () => {
    try {
      const response = await api.get("/dorms/count/");
      const roomArray = response.data.dorms; // массив вида [ {id, name, total_rooms, rooms_for_2, rooms_for_3, rooms_for_4}, ... ]

      // Преобразуем в удобный объект { [dormId]: { total_rooms, rooms_for_2, rooms_for_3, rooms_for_4 } }
      const roomDataByDorm = {};
      roomArray.forEach((dorm) => {
        roomDataByDorm[dorm.id] = {
          total_rooms: dorm.total_rooms,
          rooms_for_2: dorm.rooms_for_2,
          rooms_for_3: dorm.rooms_for_3,
          rooms_for_4: dorm.rooms_for_4,
        };
      });
      setRoomsCount(roomDataByDorm);
    } catch {
      setMessage({ type: "error", text: "Не удалось загрузить статистику комнат" });
    }
  };

  // ------------------------------------------------------------------
  // 4. useEffect: при монтировании и при смене страницы вызываем оба запроса
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchDormitories();
    fetchRoomsCount();
  }, [currentPage]);

  // ------------------------------------------------------------------
  // 5. Удаление dorm
  // ------------------------------------------------------------------
  const handleDeleteDorm = async (dorm) => {
    try {
      await api.delete(`/dorms/${dorm.id}/`);
      setMessage({ type: "success", text: "Общежитие успешно удалено" });

      // Если мы были на последней странице и после удаления записей станет меньше, 
      // возможно нужно перейти на предыдущую страницу:
      const newTotal = totalCount - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
      } else {
        fetchDormitories();
      }

      setDeleteModalDorm(null);
    } catch {
      setMessage({ type: "error", text: "Ошибка при удалении общежития" });
    }
  };

  // ------------------------------------------------------------------
  // 6. После сохранения/редактирования — просто обновляем список
  // ------------------------------------------------------------------
  const handleRefresh = () => {
    fetchDormitories();
    fetchRoomsCount();
    setShowAddModal(false);
    setShowEditModal(null);
    setShowViewModal(null);
    setDeleteModalDorm(null);
  };

  // ------------------------------------------------------------------
  // 7. Подсчёт общего числа страниц
  // ------------------------------------------------------------------
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // ------------------------------------------------------------------
  // 8. JSX-разметка
  // ------------------------------------------------------------------
  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* ===== Заголовок и кнопка "Добавить" ===== */}
        <div className="header-row">
          <h1>Управление общежитиями</h1>
          <div className="actions-list">
            <button onClick={() => setShowAddModal(true)}>Добавить общежитие</button>
          </div>
        </div>

        {/* ===== Сообщение об ошибке/успехе ===== */}
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        {/* ===== Таблица общежитий ===== */}
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
              {dormitories.length > 0 ? (
                dormitories.map((dorm) => (
                  <tr key={dorm.id}>
                    <td>{dorm.name}</td>
                    <td>{dorm.total_places}</td>
                    <td>
                      {roomsCount[dorm.id] ? roomsCount[dorm.id].rooms_for_2 : "-"}
                    </td>
                    <td>
                      {roomsCount[dorm.id] ? roomsCount[dorm.id].rooms_for_3 : "-"}
                    </td>
                    <td>
                      {roomsCount[dorm.id] ? roomsCount[dorm.id].rooms_for_4 : "-"}
                    </td>
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

        {/* ===== Пагинация ===== */}
        {totalPages > 1 && (
          <div className="pagination">
            {/* Кнопка "Prev" */}
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              &lt;
            </button>

            {/* Номера страниц */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  className={
                    currentPage === pageNum
                      ? "pagination-btn active"
                      : "pagination-btn"
                  }
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Кнопка "Next" */}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              &gt;
            </button>
          </div>
        )}

        {/* ===== Модалки ===== */}
        {showAddModal && (
          <AdminDormitoryAddModal
            onClose={() => { setShowAddModal(false); handleRefresh(); }}
          />
        )}
        {showEditModal && (
          <AdminDormitoryEditModal
            dormId={showEditModal}
            onClose={() => { setShowEditModal(null); handleRefresh(); }}
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
