// src/components/UserDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/UserDashboard.css";
import cameraIcon from "../../assets/icons/camera.png";
import uploadDefault from "../../assets/icons/excel_upload_default.svg";
import uploadActive from "../../assets/icons/excel_upload_active.svg";
import { useI18n } from "../../i18n/I18nContext";

const UserDashboard = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  // Profile & status
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [noApplication, setNoApplication] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Modals & passwords
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditWarningOpen, setIsEditWarningOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Avatar modal & upload
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploadMessage, setAvatarUploadMessage] = useState("");
  const fileInputRef = useRef(null);

  // Payment upload
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [importStatus, setImportStatus] = useState("default");
  const [excelModal, setExcelModal] = useState(false);

  // Fetch profile
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/studentdetail/");
        setProfile(res.data);
      } catch {
        setProfileError(t("userDashboard.errorProfile"));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  // Fetch status
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/application_status/");
        setStatus(res.data.status || t("userDashboard.application") + "");
      } catch (err) {
        if (err.response?.status === 404) {
          setNoApplication(true);
        } else {
          setStatusError(
            t("userDashboard.errorProfile")
          );
        }
      }
    })();
  }, [t]);

  // Fetch settings
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/global-settings/");
        setAllowEdit(!!res.data.allow_application_edit);
      } catch {
        console.error("Error loading settings");
      } finally {
        setLoadingSettings(false);
      }
    })();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPaymentScreenshot(file);
      setImportStatus("success");
      setUploadMessage("");
    }
  };

  const handleUpload = async () => {
    if (!paymentScreenshot) {
      setUploadMessage(t("userDashboard.selectFilePrompt"));
      return;
    }
    const fd = new FormData();
    fd.append("payment_screenshot", paymentScreenshot);
    try {
      await api.post("/upload_payment_screenshot/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMessage(t("userDashboard.uploadSuccess"));
      setTimeout(() => {
        setExcelModal(false);
        setSelectedFile(null);
        setImportStatus("default");
      }, 1000);
    } catch {
      setUploadMessage(t("userDashboard.uploadError"));
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage(t("userDashboard.passwordFillAll"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage(t("userDashboard.passwordMismatch"));
      return;
    }
    try {
      const res = await api.post("/change_password/", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setPasswordMessage(
        res.data.message || t("userDashboard.passwordSuccess")
      );
      setTimeout(() => setIsPasswordModalOpen(false), 1200);
    } catch {
      setPasswordMessage(t("userDashboard.passwordError"));
    }
  };

  const handleEditApplicationClick = () => {
    if (loadingSettings) return;
    if (allowEdit) navigate("/edit-application");
    else setIsEditWarningOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      handleAvatarUpload(file);
      setIsAvatarModalOpen(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) {
      setAvatarUploadMessage(
        t("userDashboard.selectFilePrompt")
      );
      return;
    }
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      await api.post("/upload-avatar/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarUploadMessage(t("userDashboard.passwordSuccess"));
      setTimeout(async () => {
        const res = await api.get("/studentdetail/");
        setProfile(res.data);
      }, 500);
    } catch {
      setAvatarUploadMessage(
        t("userDashboard.passwordError")
      );
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await api.delete("/upload-avatar/");
      setAvatarUploadMessage(
        t("userDashboard.deleteAvatar")
      );
      setProfile((p) => ({ ...p, avatar: null }));
      setIsAvatarModalOpen(false);
    } catch {
      setAvatarUploadMessage(
        t("userDashboard.uploadError")
      );
    }
  };

  if (loading)
    return <h1>{t("userDashboard.loadingProfile")}</h1>;

  return (
    <div className="profile-page-main">
      <h1 className="profile-title">
        {t("userDashboard.profileTitle")}
      </h1>

      {profileError && (
        <p className="error">{profileError}</p>
      )}

      {/* Profile block */}
      <div className="profile-main-block">
        <div className="avatar-wrapper" onClick={() => setIsAvatarModalOpen(true)}>
          <img
            src={profile?.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="profile-avatar-circle"
          />
          <div className="avatar-overlay">
            <img
              src={cameraIcon}
              alt={t("userDashboard.changePassword")}
              className="camera-icon"
            />
          </div>
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
            <span>
              {profile?.first_name} {profile?.last_name}
            </span>
          </div>
          <div className="profile-main-id">
            <span>{profile?.s}</span>
          </div>
          <div className="profile-main-email">
            <span>{profile?.email}</span>
          </div>
          <button
            className="profile-change-password-btn"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            {t("userDashboard.changePassword")}
          </button>
        </div>
      </div>

      {/* Status section */}
      <hr className="profile-hr" />
      <div className="profile-status-section">
        <div className="profile-status-title">
          {t("userDashboard.statusTitle")}
        </div>
        <div className="profile-status-row">
          {noApplication ? (
            <p>
              {t("userDashboard.noApplication")}
              <span
                className="link-like-text"
                onClick={() => navigate("/create-application")}
              >
                {t("userDashboard.here")}
              </span>.
            </p>
          ) : (
            <span>
              {t("userDashboard.application")}
              <span className="profile-status-review">
                {status}
              </span>
            </span>
          )}
        </div>

        {status ===
          t("userDashboard.approvedPayment") && (
          <>
            <div className="profile-status-desc">
              {t("userDashboard.payAndUpload")}
            </div>
            <div className="profile-status-actions">
              <button
                className="profile-upload-btn"
                onClick={() => setExcelModal(true)}
              >
                {t("userDashboard.uploadScreenshot")}
              </button>
            </div>
          </>
        )}

        <button
          className="profile-edit-app-btn"
          onClick={handleEditApplicationClick}
          disabled={loadingSettings}
        >
          {loadingSettings
            ? t("userDashboard.loadingSettings")
            : t("userDashboard.editApplication")}
        </button>

        {uploadMessage && (
          <div className="profile-upload-message">
            {uploadMessage}
          </div>
        )}
      </div>

      {/* Avatar modal */}
      {isAvatarModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAvatarModalOpen(false)}>
          <div className="modal-content avatar-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t("userDashboard.avatarManageTitle")}</h2>
            <div className="avatar-modal-buttons">
              <button className="modal-btn delete-btn" onClick={handleAvatarDelete}>
                {t("userDashboard.deleteAvatar")}
              </button>
              <button className="modal-btn choose-btn" onClick={() => fileInputRef.current?.click()}>
                {t("userDashboard.chooseNew")}
              </button>
            </div>
            <button className="modal-close-btn" onClick={() => setIsAvatarModalOpen(false)}>
              {t("userDashboard.close")}
            </button>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t("userDashboard.changePasswordTitle")}</h3>
            <input
              type="password"
              placeholder={t("userDashboard.oldPassword")}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="simple-modal-input"
            />
            <input
              type="password"
              placeholder={t("userDashboard.newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="simple-modal-input"
            />
            <input
              type="password"
              placeholder={t("userDashboard.confirmPassword")}
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
                {t("userDashboard.cancel")}
              </button>
              <button
                className="simple-modal-btn save"
                onClick={handleChangePassword}
              >
                {t("userDashboard.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit warning modal */}
      {isEditWarningOpen && (
        <div className="modal-overlay" onClick={() => setIsEditWarningOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t("userDashboard.editDisabledTitle")}</h3>
            <p>{t("userDashboard.editDisabledDesc")}</p>
            <button
              className="profile-modal-btn grey"
              onClick={() => setIsEditWarningOpen(false)}
            >
              {t("userDashboard.okay")}
            </button>
          </div>
        </div>
      )}

      {/* Upload receipt modal */}
      {excelModal && (
        <div className="modal-overlay">
          <div className="modal-content excel-modal-content">
            <button
              className="modal-close-btn"
              onClick={() => {
                setExcelModal(false);
                setSelectedFile(null);
                setImportStatus("default");
                setPaymentScreenshot(null);
                setUploadMessage("");
              }}
            >
              {t("userDashboard.close")}
            </button>
            <h2>{t("userDashboard.excelModalTitle")}</h2>
            <div className="excel-upload-box">
              <img
                src={importStatus === "success" ? uploadActive : uploadDefault}
                alt="Import"
                className="excel-upload-img"
              />
              {selectedFile ? (
                <span className="excel-upload-success">
                  {t("userDashboard.fileChosen", { name: selectedFile.name })}
                </span>
              ) : (
                <span className="excel-upload-default">
                  {t("userDashboard.fileNotChosen")}
                </span>
              )}
              <button
                className="modal-btn file-select-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("userDashboard.chooseFile")}
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
              <div className="fileinfo-title">
                {t("userDashboard.requirementsTitle")}
              </div>
              <div>{t("userDashboard.requirementsDesc")}</div>
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn cancel-btn"
                onClick={() => {
                  setExcelModal(false);
                  setSelectedFile(null);
                  setImportStatus("default");
                  setPaymentScreenshot(null);
                  setUploadMessage("");
                }}
              >
                {t("userDashboard.cancel")}
              </button>
              <button className="modal-btn save-btn" onClick={handleUpload}>
                {t("userDashboard.send")}
              </button>
            </div>
            {uploadMessage && (
              <p
                className={`upload-message ${
                  uploadMessage.includes("успешно") ? "success" : "error"
                }`}
              >
                {uploadMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
