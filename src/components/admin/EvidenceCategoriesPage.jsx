import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/viewIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import "../../styles/AdminActions.css";
import "../../styles/AdminFormShared.css";

const ITEMS_PER_PAGE = 4;

const EvidenceCategoriesPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [keywords, setKeywords] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editData, setEditData] = useState({});
  const [viewData, setViewData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    data_type: "file",
    priority: "",
    auto_fill_field: "",
    keywords: [],
  });

  const fetchData = async (requestedPage = page) => {
    try {
      const params = { page: requestedPage, page_size: ITEMS_PER_PAGE };
      const res = await api.get("/evidence-types/", { params });
      const data = res.data;
      setCategories(Array.isArray(data.results) ? data.results : []);
      setTotalCount(typeof data.count === "number" ? data.count : 0);
    } catch (err) {
      console.error("Ошибка при загрузке категорий:", err);
    }
  };

  const fetchKeywords = async () => {
    try {
      const res = await api.get("/keywords/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setKeywords(data);
    } catch (err) {
      console.error("Ошибка при загрузке ключевых слов:", err);
    }
  };

  useEffect(() => {
    fetchData(page);
    fetchKeywords();
  }, [page]);

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
      if (page !== 1) setPage(1);
      else fetchData(1);
    } catch (err) {
      console.error("Ошибка при добавлении категории:", err);
    }
  };

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

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await api.delete(`/evidence-types/${categoryToDelete.id}/`);
      const newTotal = totalCount - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      } else {
        fetchData(page);
      }
    } catch (err) {
      console.error("Ошибка при удалении категории:", err);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
                <th>Тип</th>
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
                        onClick={() => {
                          setCategoryToDelete(cat);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 20 }}>
                    Нет данных для отображения.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`pagination-btn${page === idx + 1 ? " active" : ""}`}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
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

      {/* ====== Модалка Удаления ====== */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content" style={{ border: "2px solid #D50032" }}>
            <button className="simple-modal-close" onClick={() => setIsDeleteModalOpen(false)}>✕</button>
            <h2 style={{ color: "#D50032" }}>Подтвердите удаление</h2>
            <p>Вы уверены, что хотите удалить категорию <strong>«{categoryToDelete.name}»</strong>?</p>
            <div className="simple-modal-actions">
              <button className="simple-modal-btn cancel" onClick={() => setIsDeleteModalOpen(false)}>Отмена</button>
              <button className="simple-modal-btn save" style={{ backgroundColor: "#D50032", color: "#fff" }} onClick={confirmDeleteCategory}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      {/* ====== Модалка Просмотра ====== */}
      {isViewModalOpen && viewData && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button className="simple-modal-close" onClick={() => setIsViewModalOpen(false)}>✕</button>
            <h2>Просмотр категории</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <div><strong>ID:</strong> {viewData.id}</div>
              <div><strong>Название:</strong> {viewData.name}</div>
              <div><strong>Код:</strong> {viewData.code}</div>
              <div><strong>Тип:</strong> {viewData.data_type === "file" ? "Файл" : "Integer"}</div>
              <div><strong>Приоритет:</strong> {viewData.priority}</div>
              <div><strong>Автозаполнение:</strong> {viewData.auto_fill_field || "-"}</div>
              <div><strong>Ключевые слова:</strong> {Array.isArray(viewData.keywords)
                ? viewData.keywords.map(id => {
                    const k = keywords.find(kw => kw.id === id);
                    return k ? k.keyword : id;
                  }).join(", ")
                : "-"}</div>
            </div>
            <div className="simple-modal-actions">
              <button className="simple-modal-btn cancel" onClick={() => setIsViewModalOpen(false)} style={{backgroundColor:"#333"}}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {/* ====== Модалка Редактирования ====== */}
      {isEditModalOpen && editData && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button className="simple-modal-close" onClick={() => setIsEditModalOpen(false)}>✕</button>
            <h2>Редактировать категорию</h2>
            <form className="simple-modal-form" onSubmit={handleEditSubmit}>
              <label>Название<input className="simple-modal-input" name="name" value={editData.name || ""} onChange={handleEditChange} required /></label>
              <label>Код<input className="simple-modal-input" name="code" value={editData.code || ""} onChange={handleEditChange} required /></label>
              <label>Тип<select className="simple-modal-input" name="data_type" value={editData.data_type || "file"} onChange={handleEditChange}>
                <option value="file">Файл</option>
                <option value="numeric">Integer</option>
              </select></label>
              <label>Приоритет<input className="simple-modal-input" name="priority" value={editData.priority || ""} onChange={handleEditChange} /></label>
              <label>Автозаполнение<input className="simple-modal-input" name="auto_fill_field" value={editData.auto_fill_field || ""} onChange={handleEditChange} /></label>
              <label>Ключевые слова<select className="simple-modal-input" name="keywords" value={editData.keywords || []} onChange={handleEditKeywords} multiple>
                {keywords.map((k) => (
                  <option key={k.id} value={k.id}>{k.keyword}</option>
                ))}
              </select></label>
              <div className="simple-modal-actions">
                <button type="button" className="simple-modal-btn cancel" onClick={() => setIsEditModalOpen(false)}>Отмена</button>
                <button type="submit" className="simple-modal-btn save">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceCategoriesPage;
