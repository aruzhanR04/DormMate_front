import React from "react";
import "../../styles/AdminFormShared.css";

const AdminAdminDeleteModal = ({ admin, onClose, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 400 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Удаление студента</h2>
        <p style={{ margin: "20px 0" }}>
          Вы действительно хотите удалить администратора <strong>{admin.last_name} {admin.first_name}</strong> (s: <strong>{admin.s}</strong>)?
        </p>
        <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="cancel-button" onClick={onClose}>
            Отмена
          </button>
          <button className="submit-button delete" onClick={() => onConfirm(admin)}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAdminDeleteModal;
