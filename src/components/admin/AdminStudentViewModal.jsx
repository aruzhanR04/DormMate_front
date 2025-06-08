// src/components/AdminStudentViewModal.jsx

import React from "react";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminStudentViewModal = ({ student, onClose }) => {
  const { t } = useI18n();
  const ph = t("adminStudentViewModal.placeholder");
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString() : ph;

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 500 }}>
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminStudentViewModal.close")}
        </button>
        <h2>{t("adminStudentViewModal.title")}</h2>
        <div className="form-container">
          {Object.entries(t("adminStudentViewModal.labels")).map(
            ([key, label]) => (
              <label key={key}>
                <strong>{label}</strong>
                <input
                  type="text"
                  value={
                    key === "birth_date"
                      ? fmtDate(student.birth_date)
                      : key === "region"
                      ? student.region?.region_name || ph
                      : student[key] || ph
                  }
                  disabled
                />
              </label>
            )
          )}
        </div>
        <div className="form-actions">
          <button className="cancel-button" onClick={onClose}>
            {t("adminStudentViewModal.buttons.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentViewModal;
