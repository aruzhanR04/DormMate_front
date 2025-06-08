// src/pages/admin/EvidenceCategoriesPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import editIcon from "../../assets/icons/editIcon.svg";
import viewIcon from "../../assets/icons/viewIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import "../../styles/AdminActions.css";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const ITEMS_PER_PAGE = 4;

const EvidenceCategoriesPage = () => {
  const { t } = useI18n();
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

  const cfg = t("evidenceCategoriesPage");

  const fetchData = async (p = page) => {
    try {
      const params = { page: p, page_size: ITEMS_PER_PAGE };
      const res = await api.get("/evidence-types/", { params });
      const data = res.data;
      setCategories(Array.isArray(data.results) ? data.results : []);
      setTotalCount(typeof data.count === "number" ? data.count : 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchKeywords = async () => {
    try {
      const res = await api.get("/keywords/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setKeywords(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(page);
    fetchKeywords();
  }, [page]);

  const handleFormChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleKeywordsChange = (e) =>
    setFormData((f) => ({
      ...f,
      keywords: Array.from(e.target.selectedOptions, (o) => o.value),
    }));

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
      console.error(err);
    }
  };

  const handleEditChange = (e) =>
    setEditData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleEditKeywords = (e) =>
    setEditData((f) => ({
      ...f,
      keywords: Array.from(e.target.selectedOptions, (o) => o.value),
    }));

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/evidence-types/${editData.id}/`, editData);
      setIsEditModalOpen(false);
      fetchData(page);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteCategory = async () => {
    try {
      await api.delete(`/evidence-types/${categoryToDelete.id}/`);
      const newTotal = totalCount - 1;
      const totalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      setIsDeleteModalOpen(false);
      if (page > totalPages && totalPages > 0) setPage(totalPages);
      else fetchData(page);
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="header-row">
          <h1>{cfg.title}</h1>
          <div className="actions-list">
            <button onClick={() => navigate("/admin/evidence-types/keywords")}>
              {cfg.buttons.keywords}
            </button>
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
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>{cat.code}</td>
                    <td>
                      {cfg.dataType[cat.data_type] ?? cfg.dataType.numeric}
                    </td>
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
                        alt={cfg.table.headers.actions}
                        className="operation-icon"
                        onClick={() => {
                          setEditData(cat);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <img
                        src={viewIcon}
                        alt={cfg.table.headers.actions}
                        className="operation-icon"
                        onClick={() => {
                          setViewData(cat);
                          setIsViewModalOpen(true);
                        }}
                      />
                      <img
                        src={deleteIcon}
                        alt={cfg.table.headers.actions}
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
                  className={`pagination-btn${
                    page === idx + 1 ? " active" : ""
                  }`}
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
            <form className="simple-modal-form" onSubmit={handleSubmit}>
              {Object.entries(cfg.addModal.fields).map(([field, label]) => (
                <label key={field}>
                  {label}
                  {field === "data_type" ? (
                    <select
                      className="simple-modal-input"
                      name="data_type"
                      value={formData.data_type}
                      onChange={handleFormChange}
                    >
                      <option value="file">
                        {cfg.addModal.dataTypeOptions.file}
                      </option>
                      <option value="numeric">
                        {cfg.addModal.dataTypeOptions.numeric}
                      </option>
                    </select>
                  ) : field === "keywords" ? (
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
                  ) : (
                    <input
                      className="simple-modal-input"
                      name={field}
                      value={formData[field]}
                      onChange={handleFormChange}
                      required={["name", "code"].includes(field)}
                    />
                  )}
                </label>
              ))}
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

      {/* Delete Modal */}
      {isDeleteModalOpen && categoryToDelete && (
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
            <h2 style={{ color: "#D50032" }}>
              {cfg.deleteModal.title}
            </h2>
            <p>
              {cfg.deleteModal.confirm.replace(
                "{name}",
                categoryToDelete.name
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
                onClick={confirmDeleteCategory}
              >
                {cfg.deleteModal.buttons.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewData && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✕
            </button>
            <h2>{cfg.viewModal.title}</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {Object.entries(cfg.viewModal.fields).map(([key, label]) => (
                <div key={key}>
                  <strong>{label}</strong>{" "}
                  {key === "keywords"
                    ? Array.isArray(viewData.keywords)
                      ? viewData.keywords
                          .map((id) => {
                            const k = keywords.find((kw) => kw.id === id);
                            return k ? k.keyword : id;
                          })
                          .join(", ")
                      : "-"
                    : key === "data_type"
                    ? cfg.dataType[viewData.data_type] ?? cfg.dataType.numeric
                    : viewData[key] || "-"}
                </div>
              ))}
            </div>
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
      {isEditModalOpen && editData && (
        <div className="simple-modal-overlay">
          <div className="simple-modal-content">
            <button
              className="simple-modal-close"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✕
            </button>
            <h2>{cfg.editModal.title}</h2>
            <form
              className="simple-modal-form"
              onSubmit={handleEditSubmit}
            >
              {Object.entries(cfg.editModal.fields).map(
                ([field, label]) => (
                  <label key={field}>
                    {label}
                    {field === "data_type" ? (
                      <select
                        className="simple-modal-input"
                        name="data_type"
                        value={editData.data_type}
                        onChange={handleEditChange}
                      >
                        <option value="file">
                          {cfg.editModal.dataTypeOptions.file}
                        </option>
                        <option value="numeric">
                          {cfg.editModal.dataTypeOptions.numeric}
                        </option>
                      </select>
                    ) : field === "keywords" ? (
                      <select
                        className="simple-modal-input"
                        name="keywords"
                        value={editData.keywords}
                        onChange={handleEditKeywords}
                        multiple
                      >
                        {keywords.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.keyword}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="simple-modal-input"
                        name={field}
                        value={editData[field] || ""}
                        onChange={handleEditChange}
                        required={["name", "code"].includes(field)}
                      />
                    )}
                  </label>
                )
              )}
              <div className="simple-modal-actions">
                <button
                  type="button"
                  className="simple-modal-btn cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  {cfg.editModal.buttons.cancel}
                </button>
                <button
                  type="submit"
                  className="simple-modal-btn save"
                >
                  {cfg.editModal.buttons.save}
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