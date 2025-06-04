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

  // --- Загрузка аватара ---
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUploadMessage, setAvatarUploadMessage] = useState("")

  // --- Загрузка скриншота (платежа) ---
  const [paymentScreenshot, setPaymentScreenshot] = useState(null) // Тут будет FormData-файл
  const [uploadMessage, setUploadMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)   // Для отображения имени
  const [importStatus, setImportStatus] = useState("default") // 'default' или 'success'
  const [excelModal, setExcelModal] = useState(false)

  // Скрытый input внутри модалки
  const fileInputRef = useRef(null)

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

  // --- Обработка выбора файла (сохраняем выбранный файл в selectedFile и paymentScreenshot) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)           // для отображения имени в модалке
      setPaymentScreenshot(file)      // для отправки FormData при «Отправить»
      setImportStatus("success")      // иконка переключится на uploadActive
      setUploadMessage("")            // сбросим сообщение об ошибке, если было
    }
  }

  // --- Отправка файла на бек (по клику «Отправить» в модалке) ---
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
      // Через секунду закрываем модалку, чтобы пользователь успел увидеть сообщение:
      setTimeout(() => {
        setExcelModal(false)
        // После закрытия можно сбросить состояния, если нужно:
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
      setPasswordMessage(err.response?.data?.error || "Ошибка при изменении пароля. Попробуйте снова.")
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

  // --- Загрузка аватара (осталось без изменений) ---
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
      setAvatarUploadMessage("Аватар успешно обновлен.")
      setTimeout(async () => {
        const res = await api.get("/studentdetail/")
        setProfile(res.data)
      }, 500)
    } catch {
      setAvatarUploadMessage("Ошибка при загрузке аватара.")
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      handleAvatarUpload(file)
    }
  }

  // --- Триггер для инпута аватара ---
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="profile-page-main">
      <h1 className="profile-title">Мой профиль</h1>

      {/* Блок с аватаром и личными данными */}
      <div className="profile-main-block">
        <div className="profile-avatar-circle" style={{ position: "relative" }}>
          <img
            src={profile ? profile.avatar : "/default-avatar.png"}
            alt="Аватар"
            className="profile-avatar-circle"
            onClick={triggerFileInput}
            style={{ cursor: "pointer" }}
          />
          <label htmlFor="avatar-upload" className="avatar-overlay">
            <img
              src={cameraIcon || "/placeholder.svg"}
              alt="Редактировать"
              className="camera-icon"
            />
          </label>
          <input
            ref={fileInputRef}
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="profile-main-info-block">
          <div className="profile-main-fio">
            {profile ? (
              <span>
                {profile.first_name} {profile.last_name}
              </span>
            ) : (
              <p></p>
            )}
          </div>
          <div className="profile-main-id">{profile && <span>{profile.s}</span>}</div>
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

        {status === "Ваша заявка одобрена, внесите оплату и прикрепите сюда чек." && (
          <>
            <div className="profile-status-desc">
              Внесите оплату и прикрепите скриншот
            </div>
            <div className="profile-status-actions">
              <label
                className="profile-upload-btn-label"
                onClick={() => setExcelModal(true)}
              >
                <span className="profile-upload-btn">Загрузить скриншот</span>
              </label>
              <input type="file" onChange={handleFileChange} />
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

      {/* Модалка для смены пароля */}
      {isPasswordModalOpen && (
        <div
          className="profile-modal-overlay"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Сменить пароль</h3>
            <input
              type="password"
              placeholder="Старый пароль"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="profile-modal-input"
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="profile-modal-input"
            />
            <input
              type="password"
              placeholder="Подтвердите новый пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="profile-modal-input"
            />
            {passwordMessage && (
              <p className="profile-modal-message">{passwordMessage}</p>
            )}
            <div className="profile-modal-actions">
              <button
                className="profile-modal-btn grey"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className="profile-modal-btn red"
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
          className="profile-modal-overlay"
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
        <div className="modal">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => setExcelModal(false)}
            >
              ✕
            </button>
            <h2>Загрузка чека об оплате</h2>

            {/* Блок с иконкой и текстом: */}
            <div
              className="excel-upload-box"
              style={{
                border: "1px dashed #888",
                padding: "20px",
                textAlign: "center",
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* Иконка переключается по importStatus */}
              <img
                src={importStatus === "success" ? uploadActive : uploadDefault}
                alt="Импорт Excel"
                className="excel-upload-img"
              />

              {/* Имя файла или подсказка */}
              {selectedFile ? (
                <span className="excel-upload-success">
                  Файл выбран: {selectedFile.name}
                </span>
              ) : (
                <span className="excel-upload-default">Файл не выбран</span>
              )}

              {/* Кнопка, вызывающая скрытый input */}
              <button
                className="modal-btn file-select-btn"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  marginTop: 8,
                  display: "inline-block",
                  padding: "6px 12px",
                }}
              >
                Выбрать файл
              </button>

              {/* Скрытый input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            <div
              className="excel-modal-fileinfo"
              style={{
                marginTop: 16,
                textAlign: "center",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <div className="fileinfo-title">Требования к файлу</div>
              <div>Файл должен быть в формате PDF</div>
            </div>

            <div
              className="modal-actions"
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setExcelModal(false)
                  // сбросим все состояния внутри модалки
                  setSelectedFile(null)
                  setImportStatus("default")
                  setPaymentScreenshot(null)
                  setUploadMessage("")
                }}
              >
                Отмена
              </button>
              <button
                className="modal-btn save-btn"
                onClick={handleUpload}
              >
                Отправить
              </button>
            </div>

            {uploadMessage && (
              <p
                style={{
                  marginTop: 12,
                  textAlign: "center",
                  color:
                    uploadMessage === "Скриншот успешно загружен."
                      ? "green"
                      : "red",
                }}
              >
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
