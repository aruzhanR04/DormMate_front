// src/components/AdminDormitoryDeleteModal.jsx

import React from "react";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminDormitoryDeleteModal = ({ dorm, onClose, onConfirm }) => {
  const { t } = useI18n();
  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 400 }}>
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminDormitoryDeleteModal.close")}
        </button>
        <h2>{t("adminDormitoryDeleteModal.title")}</h2>
        <p style={{ margin: "20px 0" }}>
          {t("adminDormitoryDeleteModal.confirm", { name: dorm.name })}
        </p>
        <div
          className="form-actions"
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <button className="cancel-button" onClick={onClose}>
            {t("adminDormitoryDeleteModal.buttons.cancel")}
          </button>
          <button
            className="submit-button delete"
            onClick={() => onConfirm(dorm)}
          >
            {t("adminDormitoryDeleteModal.buttons.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDormitoryDeleteModal;
