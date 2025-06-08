import React from "react";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminAdminDeleteModal = ({ admin, onClose, onConfirm }) => {
  const { t } = useI18n();
  const name = `${admin.last_name} ${admin.first_name}`;

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 400 }}>
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminDeleteModal.close")}
        </button>
        <h2>{t("adminDeleteModal.title")}</h2>
        <p style={{ margin: "20px 0" }}>
          {t("adminDeleteModal.confirm", { name, s: admin.s })}
        </p>
        <div
          className="form-actions"
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <button className="cancel-button" onClick={onClose}>
            {t("adminDeleteModal.cancel")}
          </button>
          <button
            className="submit-button delete"
            onClick={() => onConfirm(admin)}
          >
            {t("adminDeleteModal.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAdminDeleteModal;
