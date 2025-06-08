// src/components/AdminViewModal.jsx

import React from "react";
import ReactDOM from "react-dom";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminViewModal = ({ admin, onClose }) => {
  const { t } = useI18n();
  if (!admin) return null;

  const labels = t("adminViewModal.labels");
  const genderMap = t("adminViewModal.genderMap");
  const roleMap = t("adminViewModal.roleOptions");

  const modalContent = (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminViewModal.close")}
        </button>
        <h2>{t("adminViewModal.title")}</h2>
        <div className="form-container">
          {[
            "s",
            "first_name",
            "last_name",
            "middle_name",
            "email",
            "phone_number",
            "birth_date",
          ].map((field) => (
            <label key={field}>
              <strong>{labels[field]}</strong>
              <input
                type="text"
                value={admin[field] || ""}
                disabled
              />
            </label>
          ))}

          <label>
            <strong>{labels.gender}</strong>
            <input
              type="text"
              value={genderMap[admin.gender] || ""}
              disabled
            />
          </label>

          <label>
            <strong>{labels.role}</strong>
            <input
              type="text"
              value={roleMap[admin.role] || ""}
              disabled
            />
          </label>
        </div>
        <div className="form-actions">
          <button className="cancel-button" onClick={onClose}>
            {t("adminViewModal.buttons.close")}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AdminViewModal;
