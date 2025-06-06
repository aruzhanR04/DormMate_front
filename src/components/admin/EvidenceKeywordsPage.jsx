import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/viewIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import "../../styles/AdminActions.css";
import "../../styles/AdminFormShared.css";

const ITEMS_PER_PAGE = 4;

const EvidenceKeywordsPage = () => {
  const [keywords, setKeywords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newKeyword, setNewKeyword] = useState("");
  const [editKeyword, setEditKeyword] = useState("");
  const [editKeywordObj, setEditKeywordObj] = useState({});
  const [viewKeywordObj, setViewKeywordObj] = useState({});
  const [keywordToDelete, setKeywordToDelete] = useState(null);

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

  useEffect(() => {
    fetchKeywords(page);
  }, [page]);

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    const trimmed = newKeyword.trim();
    if (!trimmed) return;

    try {
      await api.post("/keywords/", { keyword: trimmed });
      setNewKeyword("");
      setIsAddModalOpen(false);

      if (page !== 1) {
        setPage(1);
      } else {
        fetchKeywords(1);
      }
    } catch (err) {
      console.error("Ошибка при добавлении ключевого слова:", err);
    }
  };

  const handleEditKeyword = async (e) => {
    e.preventDefault();
    const trimmed = editKeyword.trim();
    if (!trimmed) return;

    try {
      await api.patch(`/keywords/${editKeywordObj.id}/`, { keyword: trimmed });
      setIsEditModalOpen(false);
      fetchKeywords(page);
    } catch (err) {
      console.error("Ошибка при редактировании ключевого слова:", err);
    }
  };

  const confirmDelete = async () => {
    if (!keywordToDelete) return;

    try {
      await api.delete(`/keywords/${keywordToDelete.id}/`);
      const newTotal = totalCount - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);

      setIsDeleteModalOpen(false);
      setKeywordToDelete(null);

      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      } else {
        fetchKeywords(page);
      }
    } catch (err) {
      console.error("Ошибка при удалении ключевого слова:", err);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="header-row">
          <h1>Ключевые слова</h1>
          <div className="actions-list">
            <button onClick={() => setIsAddModalOpen(true)}>
              Добавить ключевое слово
            </button>
          </div>
        </div>

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
                        onClick={() => {
                          setKeywordToDelete(kw);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: 20 }}>
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

      {/* Add Modal */}
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
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Введите ключевое слово..."
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

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✕
            </button>
            <h2 style={{textAlign:"left"}} >Просмотр ключевого слова</h2>
            <p style={{textAlign:"left", margin:"0"}}><strong>ID:</strong> {viewKeywordObj.id}</p>
            <p style={{textAlign:"left"}}><strong>Ключевое слово:</strong> {viewKeywordObj.keyword}</p>
            <div className="simple-modal-actions">
              <button
                className="simple-modal-btn cancel"
                onClick={() => setIsViewModalOpen(false)}
                style={{backgroundColor:"#333"}}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && keywordToDelete && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content" style={{ border: "2px solid #D50032" }}>
            <button
              className="simple-modal-close"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              ✕
            </button>
            <h2 style={{ color: "#D50032" }}>Подтвердите удаление</h2>
            <p>
              Вы уверены, что хотите удалить ключевое слово:
              <strong>«{keywordToDelete.keyword}»?</strong>
            </p>
            <div className="simple-modal-actions">
              <button
                className="simple-modal-btn cancel"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className="simple-modal-btn save"
                style={{ backgroundColor: "#D50032", color: "#fff" }}
                onClick={confirmDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceKeywordsPage;
