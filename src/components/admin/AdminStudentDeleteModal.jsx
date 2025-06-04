import React from "react";
import "../../styles/AdminFormShared.css";

const AdminStudentDeleteModal = ({ student, onClose, onConfirm }) => {
  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 400 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Удаление студента</h2>
        <p style={{ margin: "20px 0" }}>
          Вы действительно хотите удалить студента <strong>{student.last_name} {student.first_name}</strong> (s: <strong>{student.s}</strong>)?
        </p>
        <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="cancel-button" onClick={onClose}>
            Отмена
          </button>
          <button className="submit-button delete" onClick={() => onConfirm(student)}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentDeleteModal;
