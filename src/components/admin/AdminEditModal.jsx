// src/components/AdminEditModal.jsx

import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const roleOptions = ["SUPER", "OP", "REQ"];

const AdminEditModal = ({ admin, onClose, onSaved, api }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    s: admin.s || "",
    first_name: admin.first_name || "",
    last_name: admin.last_name || "",
    middle_name: admin.middle_name || "",
    email: admin.email || "",
    phone_number: admin.phone_number || "",
    birth_date: admin.birth_date || "",
    gender: admin.gender || "",
    role: admin.role || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put(`/admins/${admin.id}/`, formData);
      setMessage(t("adminEditModal.messages.success"));
      onSaved?.();
      onClose();
    } catch {
      setMessage(t("adminEditModal.messages.error"));
    }
  };

  const modalContent = (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminEditModal.close")}
        </button>
        <h2>{t("adminEditModal.title")}</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          {/* ID неизменяемый */}
          <label>
            {t("adminEditModal.labels.s")}
            <input type="text" name="s" value={formData.s} disabled />
          </label>

          {/* Динамические поля */}
          {[
            "first_name",
            "last_name",
            "middle_name",
            "email",
            "phone_number",
            "birth_date",
          ].map((field) => (
            <label key={field}>
              {t(`adminEditModal.labels.${field}`)}
              <input
                type={field === "birth_date" ? "date" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </label>
          ))}

          {/* Пол */}
          <label>
            {t("adminEditModal.labels.gender")}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              {Object.entries(t("adminEditModal.genderOptions")).map(
                ([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                )
              )}
            </select>
          </label>

          {/* Роль */}
          <label>
            {t("adminEditModal.labels.role")}
            <select name="role" value={formData.role} onChange={handleChange}>
              {Object.entries(t("adminEditModal.roleOptions")).map(
                ([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                )
              )}
            </select>
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              {t("adminEditModal.buttons.cancel")}
            </button>
            <button type="submit" className="save-button">
              {t("adminEditModal.buttons.save")}
            </button>
          </div>
          {message && (
            <div style={{ width: "100%", color: "#c32939", marginTop: 10 }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AdminEditModal;
