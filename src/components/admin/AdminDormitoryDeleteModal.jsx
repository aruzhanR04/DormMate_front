import React from "react";
import "../../styles/AdminFormShared.css";

const AdminDormitioriDeleteModal = ({ dorm, onClose, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 400 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Удаление студента</h2>
        <p style={{ margin: "20px 0" }}>
          Вы действительно хотите удалить общежитие <strong>{dorm.name}</strong>?
        </p>
        <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="cancel-button" onClick={onClose}>
            Отмена
          </button>
          <button className="submit-button delete" onClick={() => onConfirm(dorm)}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDormitioriDeleteModal;
