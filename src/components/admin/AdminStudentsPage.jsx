import React, { useState, useEffect, useRef } from "react";
import api from "../../api"; // Ваш axios-инстанс
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

const ITEMS_PER_PAGE = 4; // Должно совпадать с page_size на сервере

const AdminStudentsPage = () => {
  // 1. Локальное состояние
  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  // Состояния для Excel-импорта
  const [excelModal, setExcelModal] = useState(false);
  const [importStatus, setImportStatus] = useState("default");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  // Состояния модалок
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalStudent, setEditModalStudent] = useState(null);
  const [viewModalStudent, setViewModalStudent] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  // 2. Хук: при монтировании, смене search или currentPage
  useEffect(() => {
    fetchStudents();
  }, [search, currentPage]);

  // 3. fetchStudents
  const fetchStudents = async () => {
    try {
      const params = {
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      };
      if (search.trim()) {
        params.query = search.trim();
      }

      const response = await api.get("/students/", { params });
      const data = response.data;

      if (Array.isArray(data.results)) {
        setStudents(data.results);
        setTotalCount(data.count);
      } else {
        setStudents(Array.isArray(data) ? data : []);
        setTotalCount(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      setMessage("Ошибка при загрузке данных");
    }
  };

  // 4. Обработчики
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
      setMessage("Сначала выберите файл");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await api.post("/upload-excel/", formData);
      setMessage("Данные успешно загружены и обновлены");
      fetchStudents();
      setTimeout(() => {
        setExcelModal(false);
        setSelectedFile(null);
        setImportStatus("default");
      }, 1000);
    } catch (error) {
      setMessage("Ошибка при загрузке файла");
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
    } catch (error) {
      // Обработка ошибки удаления
    }
  };

  const handleRefresh = () => {
    fetchStudents();
    setAddModalOpen(false);
    setEditModalStudent(null);
    setViewModalStudent(null);
    setDeleteModal(null);
  };

  // 5. Подсчёт общего числа страниц
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 6. Локальное слайсирование (если сервер не порционирует корректно)
  const paginatedStudents = Array.isArray(students)
    ? students.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : [];

  return (
    <div className="admin-page-container">
      <AdminSidebar />

      <div className="content-area">
        {/* Заголовок и кнопки */}
        <div className="header-row">
          <h1>Управление студентами</h1>
          <div className="actions-list">
            <button onClick={() => setAddModalOpen(true)}>Добавить студента</button>
            <button
              style={{ background: "#229f31", color: "#fff" }}
              onClick={() => setExcelModal(true)}
            >
              Импорт Excel
            </button>
            <button
              style={{ background: "#1480e3", color: "#fff" }}
              onClick={() => {
                /* Логика экспорта */
              }}
            >
              Экспорт Excel
            </button>
          </div>
        </div>

        {/* Строка поиска */}
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск..."
            value={search}
            onChange={handleSearchChange}
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>

        {/* Таблица со студентами */}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>S</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Отчество</th>
                <th>Курс</th>
                <th>Операции</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt="Avatar"
                          className="student-avatar"
                        />
                      ) : (
                        <div className="student-avatar-placeholder">
                          {student.first_name?.[0]}
                          {student.last_name?.[0]}
                        </div>
                      )}
                    </td>
                    <td>{student.s}</td>
                    <td>{student.first_name}</td>
                    <td>{student.last_name}</td>
                    <td>{student.middle_name || "-"}</td>
                    <td>{student.course}</td>
                    <td>
                      <img
                        src={viewIcon}
                        alt="Просмотр"
                        className="operation-icon"
                        onClick={() => setViewModalStudent(student)}
                      />
                      <img
                        src={editIcon}
                        alt="Редактировать"
                        className="operation-icon"
                        onClick={() => setEditModalStudent(student)}
                      />
                      <img
                        src={deleteIcon}
                        alt="Удалить"
                        className="operation-icon"
                        onClick={() => setDeleteModal(student)}
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

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn${
                    currentPage === pageNum ? " active" : ""
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              &gt;
            </button>
          </div>
        )}

        {/* Модалки: Добавить / Редактировать / Просмотреть / Удалить */}
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

        {/* Модалка для Excel-импорта */}
        {excelModal && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="modal-close-btn"
                onClick={() => setExcelModal(false)}
              >
                ✕
              </button>
              <h2>Импорт данных из Excel</h2>
              <div
                className="excel-upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={importStatus === "success" ? uploadActive : uploadDefault}
                  alt="Импорт Excel"
                  className="excel-upload-img"
                />
                {selectedFile ? (
                  <span className="excel-upload-success">
                    Файл выбран: {selectedFile.name}
                  </span>
                ) : (
                  <span className="excel-upload-default">
                    Загрузите файл Excel
                  </span>
                )}
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
                  Перезаписать существующие данные
                </label>
              </div>
              <div className="excel-modal-fileinfo">
                <div className="fileinfo-title">Требования к файлу</div>
                <div>
                  Файл должен быть в формате XLSX или XLS
                  <br />
                  Первая строка — заголовки столбцов
                  <br />
                  <span className="fileinfo-fields">
                    Обязательные поля: ФИО, Пол, Курс
                  </span>
                </div>
                <a
                  href="/templates/students_template.xlsx"
                  className="fileinfo-template-link"
                >
                  Скачать шаблон файла
                </a>
              </div>
              <div className="modal-actions">
                <button
                  className="modal-btn cancel-btn"
                  onClick={() => setExcelModal(false)}
                >
                  Отмена
                </button>
                <button className="modal-btn save-btn" onClick={handleUpload}>
                  Сохранить
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
