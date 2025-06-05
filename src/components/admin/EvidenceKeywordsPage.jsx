// src/components/admin/EvidenceKeywordsPage.jsx

import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/viewIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import "../../styles/AdminActions.css";
import "../../styles/AdminFormShared.css";

const ITEMS_PER_PAGE = 4; // Число элементов на странице (должно совпадать с page_size на сервере)

const EvidenceKeywordsPage = () => {
  // ------------------------------------------------------------------
  // 1. Локальное состояние
  // ------------------------------------------------------------------
  const [keywords, setKeywords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [newKeyword, setNewKeyword] = useState("");
  const [editKeyword, setEditKeyword] = useState("");
  const [editKeywordObj, setEditKeywordObj] = useState({});
  const [viewKeywordObj, setViewKeywordObj] = useState({});

  // ------------------------------------------------------------------
  // 2. Загрузка ключевых слов с бекенда (серверная пагинация)
  // ------------------------------------------------------------------
  const fetchKeywords = async (requestedPage = page) => {
    try {
      const params = { page: requestedPage, page_size: ITEMS_PER_PAGE };
      const res = await api.get("/keywords/", { params });
      const data = res.data;
      setKeywords(Array.isArray(data.results) ? data.results : []);
      setTotalCount(typeof data.count === "number" ? data.count : 0);
    } catch (err) {
      console.error("Ошибка при загрузке ключевых слов:", err);
      setKeywords([]);
      setTotalCount(0);
    }
  };

  // ------------------------------------------------------------------
  // 3. Хук: при монтировании и при смене номера страницы подгружаем данные
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchKeywords(page);
  }, [page]);

  // ------------------------------------------------------------------
  // 4. Добавление нового ключевого слова
  // ------------------------------------------------------------------
  const handleAddKeyword = async (e) => {
    e.preventDefault();
    const trimmed = newKeyword.trim();
    if (!trimmed) return;

    try {
      await api.post("/keywords/", { keyword: trimmed });
      setNewKeyword("");
      setIsAddModalOpen(false);

      // Если мы не на первой странице, переключаемся на первую
      if (page !== 1) {
        setPage(1);
      } else {
        // Если уже на первой, просто обновляем список
        fetchKeywords(1);
      }
    } catch (err) {
      console.error("Ошибка при добавлении ключевого слова:", err);
    }
  };

  // ------------------------------------------------------------------
  // 5. Редактирование ключевого слова
  // ------------------------------------------------------------------
  const handleEditKeyword = async (e) => {
    e.preventDefault();
    const trimmed = editKeyword.trim();
    if (!trimmed) return;

    try {
      await api.patch(`/keywords/${editKeywordObj.id}/`, { keyword: trimmed });
      setIsEditModalOpen(false);

      // После правки — обновляем текущую страницу
      fetchKeywords(page);
    } catch (err) {
      console.error("Ошибка при редактировании ключевого слова:", err);
    }
  };

  // ------------------------------------------------------------------
  // 6. Удаление ключевого слова
  // ------------------------------------------------------------------
  const handleDelete = async (kw) => {
    if (!window.confirm("Удалить ключевое слово?")) return;

    try {
      await api.delete(`/keywords/${kw.id}/`);
      const newTotal = totalCount - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);

      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      } else {
        // Обновляем текущую страницу
        fetchKeywords(page);
      }
    } catch (err) {
      console.error("Ошибка при удалении ключевого слова:", err);
    }
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
        {/* ===== Заголовок и кнопка «Добавить» ===== */}
        <div className="header-row">
          <h1>Ключевые слова</h1>
          <div className="actions-list">
            <button onClick={() => setIsAddModalOpen(true)}>
              Добавить ключевое слово
            </button>
          </div>
        </div>

        {/* ===== Таблица ===== */}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ключевое слово</th>
                <th>Операции</th>
              </tr>
            </thead>
            <tbody>
              {keywords.length > 0 ? (
                keywords.map((kw) => (
                  <tr key={kw.id}>
                    <td>{kw.id}</td>
                    <td>{kw.keyword}</td>
                    <td>
                      <img
                        src={editIcon}
                        alt="edit"
                        className="operation-icon"
                        onClick={() => {
                          setEditKeyword(kw.keyword);
                          setEditKeywordObj(kw);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <img
                        src={viewIcon}
                        alt="view"
                        className="operation-icon"
                        onClick={() => {
                          setViewKeywordObj(kw);
                          setIsViewModalOpen(true);
                        }}
                      />
                      <img
                        src={deleteIcon}
                        alt="del"
                        className="operation-icon"
                        onClick={() => handleDelete(kw)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    style={{ textAlign: "center", color: "#888", padding: 20 }}
                  >
                    Нет данных для отображения.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ===== Пагинация ===== */}
          {totalPages > 1 && (
            <div className="pagination">
              {/* Кнопка «‹ Prev » */}
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                &lt;
              </button>

              {/* Номера страниц */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn${
                      page === pageNum ? " active" : ""
                    }`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Кнопка «Next ›» */}
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== Add Modal ===== */}
      {isAddModalOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsAddModalOpen(false)}
            >
              ✕
            </button>
            <h2>Добавить ключевое слово</h2>
            <form className="simple-modal-form" onSubmit={handleAddKeyword}>
              <input
                className="simple-modal-input"
                placeholder="Введите ключевое слово..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                required
              />
              <div className="simple-modal-actions">
                <button
                  type="button"
                  className="simple-modal-btn cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="simple-modal-btn save">
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== View Modal ===== */}
      {isViewModalOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✕
            </button>
            <h2>Просмотр ключевого слова</h2>
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 15 }}>
                <strong>ID:</strong> {viewKeywordObj.id}
              </div>
              <div>
                <strong>Ключевое слово:</strong>
                <div
                  style={{
                    padding: "13px 14px",
                    border: "1.5px solid #e1e1e1",
                    borderRadius: 8,
                    background: "#fafafa",
                    fontSize: 16,
                    marginTop: 6,
                    width: "100%",
                  }}
                >
                  {viewKeywordObj.keyword}
                </div>
              </div>
            </div>
            <div className="simple-modal-actions">
              <button
                className="simple-modal-btn cancel"
                onClick={() => setIsViewModalOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {isEditModalOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✕
            </button>
            <h2>Редактировать ключевое слово</h2>
            <form className="simple-modal-form" onSubmit={handleEditKeyword}>
              <input
                className="simple-modal-input"
                placeholder="Новое ключевое слово..."
                value={editKeyword}
                onChange={(e) => setEditKeyword(e.target.value)}
                required
              />
              <div className="simple-modal-actions">
                <button
                  type="button"
                  className="simple-modal-btn cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="simple-modal-btn save">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceKeywordsPage;
