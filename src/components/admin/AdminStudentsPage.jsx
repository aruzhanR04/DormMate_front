// src/components/AdminStudentsPage.jsx

import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import AdminSidebar from "./AdminSidebar";
import viewIcon from "../../assets/icons/viewIcon.svg";
import editIcon from "../../assets/icons/editIcon.svg";
import deleteIcon from "../../assets/icons/deleteIcon.svg";
import uploadDefault from "../../assets/icons/excel_upload_default.svg";
import uploadActive from "../../assets/icons/excel_upload_active.svg";
import searchIcon from "../../assets/icons/Search.svg";
import AdminStudentViewModal from "./AdminStudentViewModal";
import AdminStudentEditModal from "./AdminStudentEditModal";
import AdminStudentAddModal from "./AdminStudentAddModal";
import AdminStudentDeleteModal from "./AdminStudentDeleteModal";
import "../../styles/AdminActions.css";
import { useI18n } from "../../i18n/I18nContext";

const ITEMS_PER_PAGE = 4;

const AdminStudentsPage = () => {
  const { t } = useI18n();
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [excelModal, setExcelModal] = useState(false);
  const [importStatus, setImportStatus] = useState("default");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalStudent, setEditModalStudent] = useState(null);
  const [viewModalStudent, setViewModalStudent] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [search, currentPage]);

  const fetchStudents = async () => {
    try {
      const params = {
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      };
      if (search.trim()) params.query = search.trim();
      const res = await api.get("/students/", { params });
      const data = res.data;
      if (Array.isArray(data.results)) {
        setStudents(data.results);
        setTotalCount(data.count);
      } else {
        const arr = Array.isArray(data) ? data : [];
        setStudents(arr);
        setTotalCount(arr.length);
      }
    } catch {
      setMessage(t("adminStudentsPage.messages.loadError"));
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus("success");
    } else {
      setSelectedFile(null);
      setImportStatus("default");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage(t("adminStudentsPage.messages.noFile"));
      return;
    }
    const fd = new FormData();
    fd.append("file", selectedFile);
    try {
      await api.post("/upload-excel/", fd);
      setMessage(t("adminStudentsPage.messages.uploadSuccess"));
      fetchStudents();
      setTimeout(() => {
        setExcelModal(false);
        setSelectedFile(null);
        setImportStatus("default");
      }, 1000);
    } catch {
      setMessage(t("adminStudentsPage.messages.uploadError"));
    }
  };

  const handleDeleteStudent = async (student) => {
    try {
      await api.delete(`/students/${student.id}/`);
      if (students.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchStudents();
      }
      setDeleteModal(null);
    } catch {
      console.error("Error deleting student");
    }
  };

  const handleRefresh = () => {
    fetchStudents();
    setAddModalOpen(false);
    setEditModalStudent(null);
    setViewModalStudent(null);
    setDeleteModal(null);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* Header */}
        <div className="header-row">
          <h1>{t("adminStudentsPage.title")}</h1>
          <div className="actions-list">
            <button onClick={() => setAddModalOpen(true)}>
              {t("adminStudentsPage.buttons.add")}
            </button>
            <button
              style={{ background: "#229f31", color: "#fff" }}
              onClick={() => setExcelModal(true)}
            >
              {t("adminStudentsPage.buttons.import")}
            </button>
            <button
              style={{ background: "#1480e3", color: "#fff" }}
            >
              {t("adminStudentsPage.buttons.export")}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder={t("adminStudentsPage.searchPlaceholder")}
            value={search}
            onChange={handleSearchChange}
          />
          <img
            src={searchIcon}
            alt={t("adminStudentsPage.icons.alt.search")}
            className="search-icon"
          />
        </div>

        {/* Table */}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                {Object.values(t("adminStudentsPage.table.headers")).map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {s.avatar ? (
                        <img
                          src={s.avatar}
                          alt={t("adminStudentsPage.icons.alt.view")}
                          className="student-avatar"
                        />
                      ) : (
                        <div className="student-avatar-placeholder">
                          {s.first_name?.[0]}
                          {s.last_name?.[0]}
                        </div>
                      )}
                    </td>
                    <td>{s.s}</td>
                    <td>{s.first_name}</td>
                    <td>{s.last_name}</td>
                    <td>{s.middle_name || "-"}</td>
                    <td>{s.course}</td>
                    <td>
                      <img
                        src={viewIcon}
                        alt={t("adminStudentsPage.icons.alt.view")}
                        className="operation-icon"
                        onClick={() => setViewModalStudent(s)}
                      />
                      <img
                        src={editIcon}
                        alt={t("adminStudentsPage.icons.alt.edit")}
                        className="operation-icon"
                        onClick={() => setEditModalStudent(s)}
                      />
                      <img
                        src={deleteIcon}
                        alt={t("adminStudentsPage.icons.alt.delete")}
                        className="operation-icon"
                        onClick={() => setDeleteModal(s)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    {t("adminStudentsPage.table.empty")}
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
              {t("adminStudentsPage.pagination.prev")}
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`pagination-btn${
                  currentPage === idx + 1 ? " active" : ""
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {t("adminStudentsPage.pagination.page", { page: idx + 1 })}
              </button>
            ))}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              {t("adminStudentsPage.pagination.next")}
            </button>
          </div>
        )}

        {/* Modals */}
        {addModalOpen && (
          <AdminStudentAddModal
            onClose={() => setAddModalOpen(false)}
            onSaved={handleRefresh}
          />
        )}
        {editModalStudent && (
          <AdminStudentEditModal
            student={editModalStudent}
            onClose={() => setEditModalStudent(null)}
            onSaved={handleRefresh}
          />
        )}
        {viewModalStudent && (
          <AdminStudentViewModal
            student={viewModalStudent}
            onClose={() => setViewModalStudent(null)}
          />
        )}
        {deleteModal && (
          <AdminStudentDeleteModal
            student={deleteModal}
            onClose={() => setDeleteModal(null)}
            onConfirm={handleDeleteStudent}
          />
        )}

        {/* Import Modal */}
        {excelModal && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="modal-close-btn"
                onClick={() => setExcelModal(false)}
              >
                {t("adminStudentsPage.importModal.buttons.cancel")}
              </button>
              <h2>{t("adminStudentsPage.importModal.title")}</h2>
              <div
                className="excel-upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={
                    importStatus === "success"
                      ? uploadActive
                      : uploadDefault
                  }
                  alt={
                    importStatus === "success"
                      ? t("adminStudentsPage.icons.alt.importActive")
                      : t("adminStudentsPage.icons.alt.importDefault")
                  }
                  className="excel-upload-img"
                />
                <span className={`excel-upload-${importStatus}`}>
                  {selectedFile
                    ? t("adminStudentsPage.importModal.promptSuccess", {
                        name: selectedFile.name,
                      })
                    : t("adminStudentsPage.importModal.promptDefault")}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xls,.xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div className="modal-checkbox-row">
                <input
                  type="checkbox"
                  id="overwrite"
                  className="modal-checkbox"
                />
                <label htmlFor="overwrite" style={{ fontSize: 16 }}>
                  {t("adminStudentsPage.importModal.checkbox")}
                </label>
              </div>
              <div className="excel-modal-fileinfo">
                <div className="fileinfo-title">
                  {t("adminStudentsPage.importModal.requirementsTitle")}
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {t("adminStudentsPage.importModal.requirements")}
                </div>
                <a
                  href="/templates/students_template.xlsx"
                  className="fileinfo-template-link"
                >
                  {t("adminStudentsPage.importModal.templateLink")}
                </a>
              </div>
              <div className="modal-actions">
                <button
                  className="modal-btn cancel-btn"
                  onClick={() => setExcelModal(false)}
                >
                  {t("adminStudentsPage.importModal.buttons.cancel")}
                </button>
                <button
                  className="modal-btn save-btn"
                  onClick={handleUpload}
                >
                  {t("adminStudentsPage.importModal.buttons.save")}
                </button>
              </div>
              {message && (
                <p
                  style={{
                    marginTop: 12,
                    textAlign: "center",
                    color: message.startsWith("Ошибка") ? "red" : "green",
                  }}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudentsPage;
