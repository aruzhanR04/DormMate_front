import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/viewIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import "../../styles/AdminActions.css";
import "../../styles/AdminFormShared.css";

const EvidenceCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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

  useEffect(() => {
    fetchData();
    fetchKeywords();
  }, []);

  const fetchData = async () => {
    const res = await api.get("/evidence-types/");
    setCategories(Array.isArray(res.data) ? res.data : res.data.results || []);
  };
  const fetchKeywords = async () => {
    const res = await api.get("/keywords/");
    setKeywords(Array.isArray(res.data) ? res.data : res.data.results || []);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/evidence-types/", formData);
    setIsAddModalOpen(false);
    fetchData();
    setFormData({
      name: "",
      code: "",
      data_type: "file",
      priority: "",
      auto_fill_field: "",
      keywords: [],
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/evidence-types/${editData.id}/`, editData);
    setIsEditModalOpen(false);
    fetchData();
  };

  const handleDelete = async (cat) => {
    if (window.confirm("Удалить категорию?")) {
      await api.delete(`/evidence-types/${cat.id}/`);
      fetchData();
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
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
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  <td>{cat.code}</td>
                  <td>{cat.data_type === "file" ? "Файл" : "Integer"}</td>
                  <td>{cat.priority}</td>
                  <td>{cat.auto_fill_field || ""}</td>
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
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
          </div>
        </div>
      </div>
      {/* Модалка "Добавить" */}
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
      {/* Модалка "Просмотр" */}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 24 }}>
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
                <b>Тип данных:</b> {viewData.data_type === "file" ? "Файл" : "Integer"}
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
      {/* Модалка "Редактировать" */}
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
