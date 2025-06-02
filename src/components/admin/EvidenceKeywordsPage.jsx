import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/viewIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import "../../styles/AdminActions.css";
import "../../styles/AdminFormShared.css";

const EvidenceKeywordsPage = () => {
  const [keywords, setKeywords] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [newKeyword, setNewKeyword] = useState("");
  const [editKeyword, setEditKeyword] = useState("");
  const [editKeywordObj, setEditKeywordObj] = useState({});
  const [viewKeywordObj, setViewKeywordObj] = useState({});

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    const res = await api.get("/keywords/");
    setKeywords(Array.isArray(res.data) ? res.data : res.data.results || []);
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    await api.post("/keywords/", { keyword: newKeyword.trim() });
    setNewKeyword("");
    setIsAddModalOpen(false);
    fetchKeywords();
  };

  const handleEditKeyword = async (e) => {
    e.preventDefault();
    await api.patch(`/keywords/${editKeywordObj.id}/`, { keyword: editKeyword });
    setIsEditModalOpen(false);
    fetchKeywords();
  };

  const handleDelete = async (kw) => {
    if (window.confirm("Удалить ключевое слово?")) {
      await api.delete(`/keywords/${kw.id}/`);
      fetchKeywords();
    }
  };

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
              {keywords.map((kw) => (
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
