// src/components/admin/EvidenceCategoriesPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/viewIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import "../../styles/AdminActions.css";
import "../../styles/AdminFormShared.css";

const ITEMS_PER_PAGE = 4; // Количество категорий на страницу

const EvidenceCategoriesPage = () => {
  const navigate = useNavigate();

  // ------------------------------------------------------------------
  // 1. Локальное состояние
  // ------------------------------------------------------------------
  const [categories, setCategories] = useState([]);   // текущая «порция» категорий
  const [totalCount, setTotalCount] = useState(0);    // общее число категорий из count
  const [page, setPage] = useState(1);                // текущая страница

  const [keywords, setKeywords] = useState([]);       // все ключевые слова для селектора

  // Модалки и формы
  const [isAddModalOpen, setIsAddModalOpen]     = useState(false);
  const [isEditModalOpen, setIsEditModalOpen]   = useState(false);
  const [isViewModalOpen, setIsViewModalOpen]   = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    data_type: "file",
    priority: "",
    auto_fill_field: "",
    keywords: [],
  });
  const [editData, setEditData] = useState({});
  const [viewData, setViewData] = useState({});

  // ------------------------------------------------------------------
  // 2. Функция fetchData: загружаем категории с параметрами пагинации
  // ------------------------------------------------------------------
  const fetchData = async (requestedPage = page) => {
    try {
      const params = {
        page: requestedPage,
        page_size: ITEMS_PER_PAGE,
      };
      const res = await api.get("/evidence-types/", { params });
      const data = res.data;
      setCategories(Array.isArray(data.results) ? data.results : []);
      setTotalCount(typeof data.count === "number" ? data.count : 0);
    } catch (err) {
      console.error("Ошибка при загрузке категорий:", err);
      setCategories([]);
      setTotalCount(0);
    }
  };

  // ------------------------------------------------------------------
  // 3. Функция fetchKeywords: загружаем все ключевые слова (без пагинации)
  // ------------------------------------------------------------------
  const fetchKeywords = async () => {
    try {
      const res = await api.get("/keywords/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setKeywords(data);
    } catch (err) {
      console.error("Ошибка при загрузке ключевых слов:", err);
      setKeywords([]);
    }
  };

  // ------------------------------------------------------------------
  // 4. useEffect: при монтировании и при изменении page — обновляем список
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchData(page);
    fetchKeywords();
  }, [page]);

  // ------------------------------------------------------------------
  // 5. Обработчики форм
  // ------------------------------------------------------------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleKeywordsChange = (e) => {
    setFormData((f) => ({
      ...f,
      keywords: Array.from(e.target.selectedOptions, (o) => o.value),
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((f) => ({ ...f, [name]: value }));
  };

  const handleEditKeywords = (e) => {
    setEditData((f) => ({
      ...f,
      keywords: Array.from(e.target.selectedOptions, (o) => o.value),
    }));
  };

  // ------------------------------------------------------------------
  // 6. Добавить новую категорию
  // ------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/evidence-types/", formData);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        code: "",
        data_type: "file",
        priority: "",
        auto_fill_field: "",
        keywords: [],
      });

      // Переключаемся на первую страницу или обновляем её
      if (page !== 1) {
        setPage(1);
      } else {
        fetchData(1);
      }
    } catch (err) {
      console.error("Ошибка при добавлении категории:", err);
    }
  };

  // ------------------------------------------------------------------
  // 7. Редактировать категорию
  // ------------------------------------------------------------------
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/evidence-types/${editData.id}/`, editData);
      setIsEditModalOpen(false);
      fetchData(page);
    } catch (err) {
      console.error("Ошибка при редактировании категории:", err);
    }
  };

  // ------------------------------------------------------------------
  // 8. Удаление категории
  // ------------------------------------------------------------------
  const handleDelete = async (cat) => {
    if (!window.confirm("Удалить категорию?")) return;
    try {
      await api.delete(`/evidence-types/${cat.id}/`);
      const newTotal = totalCount - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      } else {
        fetchData(page);
      }
    } catch (err) {
      console.error("Ошибка при удалении категории:", err);
    }
  };

  // ------------------------------------------------------------------
  // 9. Подсчёт общего числа страниц
  // ------------------------------------------------------------------
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // ------------------------------------------------------------------
  // 10. JSX-разметка
  // ------------------------------------------------------------------
  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* ===== Заголовок и кнопки ===== */}
        <div className="header-row">
          <h1>Категории справок</h1>
          <div className="actions-list">
            <button onClick={() => navigate("/admin/evidence-types/keywords")}>
              Ключевые слова
            </button>
            <button onClick={() => setIsAddModalOpen(true)}>
              Добавить категорию
            </button>
          </div>
        </div>

        {/* ===== Таблица категорий ===== */}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Код</th>
                <th>Тип данных</th>
                <th>Приоритет</th>
                <th>Автозаполнение</th>
                <th>Ключевые слова</th>
                <th>Операции</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>{cat.code}</td>
                    <td>{cat.data_type === "file" ? "Файл" : "Integer"}</td>
                    <td>{cat.priority}</td>
                    <td>{cat.auto_fill_field || "-"}</td>
                    <td>
                      {Array.isArray(cat.keywords)
                        ? cat.keywords
                            .map((id) => {
                              const k = keywords.find((kw) => kw.id === id);
                              return k ? k.keyword : id;
                            })
                            .join(", ")
                        : ""}
                    </td>
                    <td>
                      <img
                        src={editIcon}
                        alt="edit"
                        className="operation-icon"
                        onClick={() => {
                          setEditData(cat);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <img
                        src={viewIcon}
                        alt="view"
                        className="operation-icon"
                        onClick={() => {
                          setViewData(cat);
                          setIsViewModalOpen(true);
                        }}
                      />
                      <img
                        src={deleteIcon}
                        alt="del"
                        className="operation-icon"
                        onClick={() => handleDelete(cat)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
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
              {/* Prev */}
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                &lt;
              </button>

              {/* Числа страниц */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn${page === pageNum ? " active" : ""}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next */}
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

      {/* ===== Модалка «Добавить категорию» ===== */}
      {isAddModalOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsAddModalOpen(false)}
            >
              ✕
            </button>
            <h2>Добавить категорию</h2>
            <form className="simple-modal-form" onSubmit={handleSubmit}>
              <label>
                Название
                <input
                  className="simple-modal-input"
                  value={formData.name}
                  name="name"
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Код
                <input
                  className="simple-modal-input"
                  value={formData.code}
                  name="code"
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Тип данных
                <select
                  className="simple-modal-input"
                  value={formData.data_type}
                  name="data_type"
                  onChange={handleFormChange}
                >
                  <option value="file">Файл</option>
                  <option value="numeric">Integer</option>
                </select>
              </label>
              <label>
                Приоритет
                <input
                  className="simple-modal-input"
                  value={formData.priority}
                  name="priority"
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Автозаполнение
                <input
                  className="simple-modal-input"
                  value={formData.auto_fill_field}
                  name="auto_fill_field"
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Ключевые слова
                <select
                  className="simple-modal-input"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleKeywordsChange}
                  multiple
                >
                  {keywords.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.keyword}
                    </option>
                  ))}
                </select>
              </label>
              <div className="simple-modal-actions">
                <button
                  type="button"
                  className="simple-modal-btn cancel"
                  onClick={() => setIsAddModalOpen(false)}
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

      {/* ===== Модалка «Просмотр категории» ===== */}
      {isViewModalOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✕
            </button>
            <h2>Просмотр категории</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 13,
                marginBottom: 24,
              }}
            >
              <div>
                <b>ID:</b> {viewData.id}
              </div>
              <div>
                <b>Название:</b> {viewData.name}
              </div>
              <div>
                <b>Код:</b> {viewData.code}
              </div>
              <div>
                <b>Тип данных:</b>{" "}
                {viewData.data_type === "file" ? "Файл" : "Integer"}
              </div>
              <div>
                <b>Приоритет:</b> {viewData.priority}
              </div>
              <div>
                <b>Автозаполнение:</b> {viewData.auto_fill_field || "-"}
              </div>
              <div>
                <b>Ключевые слова:</b>{" "}
                {Array.isArray(viewData.keywords)
                  ? viewData.keywords
                      .map((id) => {
                        const k = keywords.find((kw) => kw.id === id);
                        return k ? k.keyword : id;
                      })
                      .join(", ")
                  : ""}
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

      {/* ===== Модалка «Редактировать категорию» ===== */}
      {isEditModalOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✕
            </button>
            <h2>Редактировать категорию</h2>
            <form className="simple-modal-form" onSubmit={handleEditSubmit}>
              <label>
                Название
                <input
                  className="simple-modal-input"
                  value={editData.name || ""}
                  name="name"
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Код
                <input
                  className="simple-modal-input"
                  value={editData.code || ""}
                  name="code"
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                Тип данных
                <select
                  className="simple-modal-input"
                  value={editData.data_type || "file"}
                  name="data_type"
                  onChange={handleEditChange}
                >
                  <option value="file">Файл</option>
                  <option value="numeric">Integer</option>
                </select>
              </label>
              <label>
                Приоритет
                <input
                  className="simple-modal-input"
                  value={editData.priority || ""}
                  name="priority"
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Автозаполнение
                <input
                  className="simple-modal-input"
                  value={editData.auto_fill_field || ""}
                  name="auto_fill_field"
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Ключевые слова
                <select
                  className="simple-modal-input"
                  name="keywords"
                  value={editData.keywords || []}
                  onChange={handleEditKeywords}
                  multiple
                >
                  {keywords.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.keyword}
                    </option>
                  ))}
                </select>
              </label>
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

export default EvidenceCategoriesPage;
