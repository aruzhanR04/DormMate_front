// src/pages/admin/EvidenceKeywordsPage.jsx

import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/viewIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import "../../styles/AdminActions.css";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const ITEMS_PER_PAGE = 4;

const EvidenceKeywordsPage = () => {
  const { t } = useI18n();
  const cfg = t("evidenceKeywordsPage");

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

  useEffect(() => {
    fetchKeywords(page);
  }, [page]);

  const fetchKeywords = async (p = page) => {
    try {
      const res = await api.get("/keywords/", {
        params: { page: p, page_size: ITEMS_PER_PAGE },
      });
      const data = res.data;
      setKeywords(Array.isArray(data.results) ? data.results : []);
      setTotalCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      setKeywords([]);
      setTotalCount(0);
    }
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    const kw = newKeyword.trim();
    if (!kw) return;
    await api.post("/keywords/", { keyword: kw });
    setNewKeyword("");
    setIsAddModalOpen(false);
    setPage(1);
  };

  const handleEditKeyword = async (e) => {
    e.preventDefault();
    const kw = editKeyword.trim();
    if (!kw) return;
    await api.patch(`/keywords/${editKeywordObj.id}/`, { keyword: kw });
    setIsEditModalOpen(false);
    fetchKeywords(page);
  };

  const confirmDelete = async () => {
    if (!keywordToDelete) return;
    await api.delete(`/keywords/${keywordToDelete.id}/`);
    const newTotal = totalCount - 1;
    const pages = Math.ceil(newTotal / ITEMS_PER_PAGE);
    setIsDeleteModalOpen(false);
    setKeywordToDelete(null);
    setPage((p) => (p > pages && pages > 0 ? pages : p));
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="header-row">
          <h1>{cfg.title}</h1>
          <div className="actions-list">
            <button onClick={() => setIsAddModalOpen(true)}>
              {cfg.buttons.add}
            </button>
          </div>
        </div>

        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                {Object.values(cfg.table.headers).map((h) => (
                  <th key={h}>{h}</th>
                ))}
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
                        alt={cfg.table.headers.actions}
                        className="operation-icon"
                        onClick={() => {
                          setEditKeywordObj(kw);
                          setEditKeyword(kw.keyword);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <img
                        src={viewIcon}
                        alt={cfg.table.headers.actions}
                        className="operation-icon"
                        onClick={() => {
                          setViewKeywordObj(kw);
                          setIsViewModalOpen(true);
                        }}
                      />
                      <img
                        src={deleteIcon}
                        alt={cfg.table.headers.actions}
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
                    {cfg.table.empty}
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
                {cfg.pagination.prev}
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`pagination-btn${page === idx + 1 ? " active" : ""}`}
                  onClick={() => setPage(idx + 1)}
                >
                  {cfg.pagination.page.replace("{page}", idx + 1)}
                </button>
              ))}
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {cfg.pagination.next}
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
            <h2>{cfg.addModal.title}</h2>
            <form className="simple-modal-form" onSubmit={handleAddKeyword}>
              <input
                className="simple-modal-input"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder={cfg.addModal.placeholder}
                required
              />
              <div className="simple-modal-actions">
                <button
                  type="button"
                  className="simple-modal-btn cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  {cfg.addModal.buttons.cancel}
                </button>
                <button type="submit" className="simple-modal-btn save">
                  {cfg.addModal.buttons.save}
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
            <h2>{cfg.viewModal.title}</h2>
            <p>
              <strong>{cfg.viewModal.fields.id}</strong> {viewKeywordObj.id}
            </p>
            <p>
              <strong>{cfg.viewModal.fields.keyword}</strong>{" "}
              {viewKeywordObj.keyword}
            </p>
            <div className="simple-modal-actions">
              <button
                className="simple-modal-btn cancel"
                onClick={() => setIsViewModalOpen(false)}
                style={{ backgroundColor: "#333", color: "#fff" }}
              >
                {cfg.viewModal.buttons.close}
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
            <h2>{cfg.editModal.title}</h2>
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
                  {cfg.editModal.buttons.cancel}
                </button>
                <button type="submit" className="simple-modal-btn save">
                  {cfg.editModal.buttons.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && keywordToDelete && (
        <div className="simple-modal-overlay">
          <div
            className="simple-modal-content"
            style={{ border: "2px solid #D50032" }}
          >
            <button
              className="simple-modal-close"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              ✕
            </button>
            <h2 style={{ color: "#D50032" }}>{cfg.deleteModal.title}</h2>
            <p>
              {cfg.deleteModal.confirm.replace(
                "{keyword}",
                keywordToDelete.keyword
              )}
            </p>
            <div className="simple-modal-actions">
              <button
                className="simple-modal-btn cancel"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                {cfg.deleteModal.buttons.cancel}
              </button>
              <button
                className="simple-modal-btn save"
                style={{ backgroundColor: "#D50032", color: "#fff" }}
                onClick={confirmDelete}
              >
                {cfg.deleteModal.buttons.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceKeywordsPage;
