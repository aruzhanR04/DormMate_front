// src/components/AdminCreateModal.jsx

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const roleOptions = ["SUPER", "OP", "REQ", "COM"];

const AdminCreateModal = ({ onClose, onSaved, api }) => {
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    s: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    role: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const firstInputRef = useRef();

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  // Правильный handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // ЛОГ 1: Что отправляем
      console.log("POST /admins/ BODY:", formData);
  
      // Запрос на сервер
      const response = await api.post("/admins/", formData);
  
      // ЛОГ 2: Что вернул сервер
      console.log("RESPONSE DATA:", response.data);
  
      setMessage(t("adminCreateModal.messages.success"));
      onSaved?.();
      onClose();
    } catch (err) {
      // ЛОГ 3: Что не так (ошибка)
      if (err.response) {
        console.error("ERROR RESPONSE:", err.response);
        setMessage(
          err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          t("adminCreateModal.messages.error")
        );
      } else {
        console.error("ERROR (no response):", err);
        setMessage(t("adminCreateModal.messages.error"));
      }
    }
  };
  

  const modalContent = (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminCreateModal.close")}
        </button>
        <h2>{t("adminCreateModal.title")}</h2>
        <form onSubmit={handleSubmit} className="form-container">
          {Object.entries(formData).map(([key, value]) => {
            // render inputs/selects dynamically
            if (key === "gender" || key === "role") {
              const options = t(`adminCreateModal.${key}Options`);
              return (
                <label key={key}>
                  {t(`adminCreateModal.labels.${key}`)}
                  <select
                    name={key}
                    value={value}
                    onChange={handleChange}
                    required={key === "s" || key === "password"}
                  >
                    {Object.entries(options).map(([optValue, optLabel]) => (
                      <option key={optValue} value={optValue}>
                        {optLabel}
                      </option>
                    ))}
                  </select>
                </label>
              );
            } else {
              const type =
                key === "email"
                  ? "email"
                  : key === "birth_date"
                  ? "date"
                  : key === "password"
                  ? "password"
                  : "text";
              return (
                <label key={key}>
                  {t(`adminCreateModal.labels.${key}`)}
                  <input
                    type={type}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    ref={key === "s" ? firstInputRef : null}
                    required={key === "s" || key === "password"}
                  />
                </label>
              );
            }
          })}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              {t("adminCreateModal.buttons.cancel")}
            </button>
            <button type="submit" className="save-button">
              {t("adminCreateModal.buttons.save")}
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

export default AdminCreateModal;
