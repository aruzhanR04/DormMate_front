// src/components/UserDashboard.jsx

"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api"
import "../../styles/UserDashboard.css"
import cameraIcon from "../../assets/icons/camera.png"
import uploadDefault from "../../assets/icons/excel_upload_default.svg"
import uploadActive from "../../assets/icons/excel_upload_active.svg"

const UserDashboard = () => {
  const navigate = useNavigate()

  // --- Профиль и статус заявки ---
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState("")
  const [status, setStatus] = useState("")
  const [statusError, setStatusError] = useState("")
  const [noApplication, setNoApplication] = useState(false)
  const [allowEdit, setAllowEdit] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(true)

  // --- Модалки и пароли ---
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isEditWarningOpen, setIsEditWarningOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  // --- Модалка изменения аватара ---
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  // --- Состояния для загрузки аватара ---
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUploadMessage, setAvatarUploadMessage] = useState("")

  // Ссылка на скрытый <input type="file"> для аватара
  const fileInputRef = useRef(null)

  // --- Загрузка скриншота (платежа) ---
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  const [uploadMessage, setUploadMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [importStatus, setImportStatus] = useState("default")
  const [excelModal, setExcelModal] = useState(false)

  // --- Загрузка профиля ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/studentdetail/")
        setProfile(response.data)
      } catch (err) {
        setProfileError("Не удалось загрузить данные профиля")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // --- Статус заявки ---
  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await api.get("/application_status/")
        setStatus(response.data.status || "Нет данных")
      } catch (err) {
        if (err.response?.status === 404) {
          setNoApplication(true)
        } else {
          setStatusError("Ошибка при получении статуса заявки. Попробуйте снова.")
        }
      }
    }
    fetchApplicationStatus()
  }, [])

  // --- Глобальные настройки (для редактирования заявки) ---
  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const response = await api.get("/global-settings/")
        setAllowEdit(!!response.data?.allow_application_edit)
      } catch (error) {
        console.error("Ошибка при загрузке настроек:", error)
      } finally {
        setLoadingSettings(false)
      }
    }
    fetchGlobalSettings()
  }, [])

  // --- Обработка выбора файла для платежного скриншота ---
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPaymentScreenshot(file)
      setImportStatus("success")
      setUploadMessage("")
    }
  }

  // --- Отправка файла платежного скриншота ---
  const handleUpload = async () => {
    if (!paymentScreenshot) {
      setUploadMessage("Пожалуйста, выберите файл для загрузки")
      return
    }
    const formData = new FormData()
    formData.append("payment_screenshot", paymentScreenshot)
    try {
      await api.post("/upload_payment_screenshot/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setUploadMessage("Скриншот успешно загружен.")
      setTimeout(() => {
        setExcelModal(false)
        setSelectedFile(null)
        setImportStatus("default")
      }, 1000)
    } catch {
      setUploadMessage("Ошибка при загрузке файла. Попробуйте снова.")
    }
  }

  // --- Обработка смены пароля ---
  const handleChangePassword = async () => {
    setPasswordMessage("")
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Пожалуйста, заполните все поля.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Пароли не совпадают.")
      return
    }
    try {
      const response = await api.post("/change_password/", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
      setPasswordMessage(response.data.message || "Пароль успешно изменён.")
      setTimeout(() => setIsPasswordModalOpen(false), 1200)
    } catch (err) {
      setPasswordMessage(
        err.response?.data?.error || "Ошибка при изменении пароля. Попробуйте снова."
      )
    }
  }

  // --- Клик «Редактировать заявку» ---
  const handleEditApplicationClick = () => {
    if (loadingSettings) return
    if (allowEdit) {
      navigate("/edit-application")
    } else {
      setIsEditWarningOpen(true)
    }
  }

  // --- Обработчик для открытия модалки управления аватаром ---
  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true)
  }

  // --- Отправка нового аватара ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      handleAvatarUpload(file)
      setIsAvatarModalOpen(false)
    }
  }

  // --- Загрузка аватара на сервер ---
  const handleAvatarUpload = async (file) => {
    if (!file) {
      setAvatarUploadMessage("Пожалуйста, выберите изображение.")
      return
    }
    const formData = new FormData()
    formData.append("avatar", file)
    try {
      await api.post("/upload-avatar/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setAvatarUploadMessage("Аватар успешно обновлён.")
      setTimeout(async () => {
        const res = await api.get("/studentdetail/")
        setProfile(res.data)
      }, 500)
    } catch {
      setAvatarUploadMessage("Ошибка при загрузке аватара.")
    }
  }

  // --- Удаление аватара (отправляем запрос на удаление) ---
  const handleAvatarDelete = async () => {
    try {
      await api.delete("/upload-avatar/") // предположим, что на бэкенде есть этот эндпоинт
      setAvatarUploadMessage("Аватар удалён.")
      setProfile((prev) => ({ ...prev, avatar: null }))
      setIsAvatarModalOpen(false)
    } catch {
      setAvatarUploadMessage("Ошибка при удалении аватара.")
    }
  }

  // --- Клик по кругу аватара открывает скрытый input ---
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="profile-page-main">
      <h1 className="profile-title">Мой профиль</h1>

      {/* Блок с аватаром и личными данными */}
      <div className="profile-main-block">
        <div
          className="avatar-wrapper"
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        >
          <img
            src={profile && profile.avatar ? profile.avatar : "/default-avatar.png"}
            alt="Аватар"
            className="profile-avatar-circle"
          />

          {/* Полупрозрачный оверлей с иконкой камеры, появляется при наведении */}
          <div className="avatar-overlay" onClick={handleAvatarClick}>
            <img
              src={cameraIcon}
              alt="Изменить аватар"
              className="camera-icon"
            />
          </div>

          {/* Скрытый input для выбора файла */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>

        <div className="profile-main-info-block">
          <div className="profile-main-fio">
            {profile ? (
              <span>
                {profile.first_name} {profile.last_name}
              </span>
            ) : (
              <span>Загрузка...</span>
            )}
          </div>
          <div className="profile-main-id">
            {profile && <span>{profile.s}</span>}
          </div>
          <div className="profile-main-email">
            {profile && <span>{profile.email}</span>}
          </div>
          <button
            className="profile-change-password-btn"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Сменить пароль
          </button>
        </div>
      </div>

      {avatarUploadMessage && (
        <div className="avatar-upload-message">{avatarUploadMessage}</div>
      )}

      <hr className="profile-hr" />

      {/* Блок «Статус заявки» */}
      <div className="profile-status-section">
        <div className="profile-status-title">Статус заявки</div>
        <div className="profile-status-row">
          {noApplication ? (
            <p>
              Похоже, вы ещё не подали заявку. Вы можете подать её{" "}
              <span
                className="link-like-text"
                onClick={() => navigate("/create-application")}
              >
                здесь
              </span>
              .
            </p>
          ) : (
            status && (
              <span>
                <span>Заявка – </span>
                <span className="profile-status-review">{status}</span>
              </span>
            )
          )}
        </div>

        {status ===
          "Ваша заявка одобрена, внесите оплату и прикрепите сюда чек." && (
          <>
            <div className="profile-status-desc">
              Внесите оплату и прикрепите скриншот
            </div>
            <div className="profile-status-actions">
              <button
                className="profile-upload-btn"
                onClick={() => setExcelModal(true)}
              >
                Загрузить скриншот
              </button>
            </div>
          </>
        )}

        <button
          className="profile-edit-app-btn"
          onClick={handleEditApplicationClick}
          disabled={loadingSettings}
        >
          {loadingSettings ? "Загрузка..." : "Редактировать заявку"}
        </button>

        {uploadMessage && (
          <div className="profile-upload-message">{uploadMessage}</div>
        )}
      </div>

      {/* Модалка управления аватаром */}
      {isAvatarModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div className="modal-content avatar-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Управление аватаром</h2>
            <div className="avatar-modal-buttons">
              <button className="modal-btn delete-btn" onClick={handleAvatarDelete}>
                Удалить аватар
              </button>
              <button
                className="modal-btn choose-btn"
                onClick={() => {
                  fileInputRef.current?.click()
                }}
              >
                Выбрать новый
              </button>
            </div>
            <button className="modal-close-btn" onClick={() => setIsAvatarModalOpen(false)}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Модалка для смены пароля */}
      {isPasswordModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Сменить пароль</h3>
            <input
              type="password"
              placeholder="Старый пароль"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="simple-modal-input"
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="simple-modal-input"
            />
            <input
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="simple-modal-input"
            />
            {passwordMessage && (
              <p className="profile-modal-message">{passwordMessage}</p>
            )}
            <div className="profile-modal-actions">
              <button
                className="simple-modal-btn cancel"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className="simple-modal-btn save"
                onClick={handleChangePassword}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка-предупреждение (редактирование заявок) */}
      {isEditWarningOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditWarningOpen(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Редактирование заявок отключено</h3>
            <p>
              В данный момент редактирование заявок недоступно. Свяжитесь с
              администрацией.
            </p>
            <button
              className="profile-modal-btn grey"
              onClick={() => setIsEditWarningOpen(false)}
            >
              Понятно
            </button>
          </div>
        </div>
      )}

      {/* ==== Модалка для загрузки чека об оплате ==== */}
      {excelModal && (
        <div className="modal-overlay">
          <div className="modal-content excel-modal-content">
            <button
              className="modal-close-btn"
              onClick={() => {
                setExcelModal(false)
                setSelectedFile(null)
                setImportStatus("default")
                setPaymentScreenshot(null)
                setUploadMessage("")
              }}
            >
              ✕
            </button>
            <h2>Загрузка чека об оплате</h2>

            <div className="excel-upload-box">
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
                <span className="excel-upload-default">Файл не выбран</span>
              )}

              <button
                className="modal-btn file-select-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Выбрать файл
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            <div className="excel-modal-fileinfo">
              <div className="fileinfo-title">Требования к файлу</div>
              <div>Файл должен быть в формате PDF</div>
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setExcelModal(false)
                  setSelectedFile(null)
                  setImportStatus("default")
                  setPaymentScreenshot(null)
                  setUploadMessage("")
                }}
              >
                Отмена
              </button>
              <button className="modal-btn save-btn" onClick={handleUpload}>
                Отправить
              </button>
            </div>

            {uploadMessage && (
              <p className={`upload-message ${uploadMessage.includes("успешно") ? "success" : "error"}`}>
                {uploadMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
