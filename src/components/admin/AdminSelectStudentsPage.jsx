

import { useState, useEffect, useRef } from "react"
import api from "../../api"
import AdminSidebar from "./AdminSidebar"
import viewIcon from "../../assets/icons/viewIcon.svg"
import editIcon from "../../assets/icons/editIcon.svg"
import deleteIcon from "../../assets/icons/deleteIcon.svg"
import uploadDefault from "../../assets/icons/excel_upload_default.svg"
import uploadActive from "../../assets/icons/excel_upload_active.svg"
import searchIcon from "../../assets/icons/Search.svg"
import AdminStudentViewModal from "./AdminStudentViewModal"
import AdminStudentEditModal from "./AdminStudentEditModal"
import AdminStudentAddModal from "./AdminStudentAddModal"
import AdminStudentDeleteModal from "./AdminStudentDeleteModal"
import "../../styles/AdminActions.css"

const ITEMS_PER_PAGE = 4

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([])
  const [message, setMessage] = useState("")
  const [excelModal, setExcelModal] = useState(false)
  const [importStatus, setImportStatus] = useState("default") // 'default', 'success'
  const [selectedFile, setSelectedFile] = useState(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // Модалки
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalStudent, setEditModalStudent] = useState(null)
  const [viewModalStudent, setViewModalStudent] = useState(null)
  const [deleteModalStudent, setDeleteModalStudent] = useState(null)

  const fileInputRef = useRef()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students")
      const studentData = Array.isArray(response.data)
        ? response.data
        : response.data.results
          ? response.data.results
          : Object.values(response.data)
      setStudents(studentData)
      console.log(studentData)
    } catch (error) {
      setMessage({ type: "error", text: "Ошибка при загрузке данных" })
    }
  }

  const filteredStudents = students.filter((s) =>
    `${s.first_name} ${s.last_name} ${s.middle_name ?? ""} ${s.s}`.toLowerCase().includes(search.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)
  const paginatedStudents = filteredStudents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleDeleteStudent = async (student) => {
    try {
      await api.delete(`/students/${student.id}/`)
      handleRefresh() // обновить список
      setDeleteModalStudent(null)
    } catch (error) {
      console.error("Ошибка при удалении студента:", error)
    }
  }

  // Excel импорт
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setImportStatus("success") // показываем что файл выбран
    }
  }

  const handleUploadFile = async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Выберите файл для загрузки" })
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      await api.post("/upload-excel/", formData)
      setMessage({ type: "success", text: "Данные успешно загружены и обновлены" })
      setTimeout(() => {
        setExcelModal(false)
        setSelectedFile(null)
        setImportStatus("default")
      }, 1000)
      fetchStudents()
    } catch (error) {
      setMessage({ type: "error", text: "Ошибка при загрузке файла" })
    }
  }

  // --- Модалки ---
  const handleRefresh = () => {
    fetchStudents()
    setAddModalOpen(false)
    setEditModalStudent(null)
    setViewModalStudent(null)
  }

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="header-row">
          <h1>Управление студентами</h1>
          <div className="actions-list">
            <button onClick={() => setAddModalOpen(true)}>Добавить студента</button>
            <button style={{ background: "#229f31", color: "#fff" }} onClick={() => setExcelModal(true)}>
              Импорт Excel
            </button>
            <button
              style={{ background: "#1480e3", color: "#fff" }}
              onClick={() => {
                /* экспорт логику сюда */
              }}
            >
              Экспорт Excel
            </button>
          </div>
        </div>
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src={searchIcon || "/placeholder.svg"} alt="Search" className="search-icon" />
        </div>
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
                        <img src={student.avatar || "/placeholder.svg"} alt="Avatar" className="student-avatar" />
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
                        src={viewIcon || "/placeholder.svg"}
                        alt="Просмотр"
                        className="operation-icon"
                        onClick={() => setViewModalStudent(student)}
                      />
                      <img
                        src={editIcon || "/placeholder.svg"}
                        alt="Редактировать"
                        className="operation-icon"
                        onClick={() => setEditModalStudent(student)}
                      />
                      <img
                        src={deleteIcon || "/placeholder.svg"}
                        alt="Удалить"
                        className="operation-icon"
                        onClick={() => setDeleteModalStudent(student)}
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
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`pagination-btn${page === idx + 1 ? " active" : ""}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Модалки */}
      {addModalOpen && <AdminStudentAddModal onClose={() => setAddModalOpen(false)} onSaved={handleRefresh} />}
      {editModalStudent && (
        <AdminStudentEditModal
          student={editModalStudent}
          onClose={() => setEditModalStudent(null)}
          onSaved={handleRefresh}
        />
      )}
      {viewModalStudent && (
        <AdminStudentViewModal student={viewModalStudent} onClose={() => setViewModalStudent(null)} />
      )}
      {deleteModalStudent && (
        <AdminStudentDeleteModal
          student={deleteModalStudent}
          onClose={() => setDeleteModalStudent(null)}
          onConfirm={handleDeleteStudent}
        />
      )}

      {/* Excel импорт (пример модалки, если нужна) */}
      {excelModal && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => {
                setExcelModal(false)
                setSelectedFile(null)
                setImportStatus("default")
              }}
            >
              ✕
            </button>
            <h2>Импорт данных из Excel</h2>
            <div className="excel-upload-box" onClick={() => fileInputRef.current?.click()}>
              <img
                src={importStatus === "success" ? uploadActive : uploadDefault}
                alt="Импорт Excel"
                className="excel-upload-img"
              />
              {selectedFile ? (
                <span className="excel-upload-success">Файл выбран: {selectedFile.name}</span>
              ) : (
                <span className="excel-upload-default">Загрузите файл Excel</span>
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
              <input type="checkbox" id="overwrite" className="modal-checkbox" />
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
                <span className="fileinfo-fields">Обязательные поля: ФИО, Пол, Курс</span>
              </div>
              <a href="/templates/students_template.xlsx" className="fileinfo-template-link">
                Скачать шаблон файла
              </a>
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setExcelModal(false)
                  setSelectedFile(null)
                  setImportStatus("default")
                }}
              >
                Отмена
              </button>
              <button className="modal-btn save-btn" onClick={handleUploadFile}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminStudentsPage
