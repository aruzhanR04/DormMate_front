import React from "react";
import "../../styles/AdminFormShared.css";

const AdminStudentViewModal = ({ student, onClose }) => (
  <div className="modal">
    <div className="modal-content" style={{ minWidth: 500 }}>
      <button className="modal-close-btn" onClick={onClose}>✕</button>
      <h2>Просмотр студента</h2>
      <div className="form-container">
        <label>
          <strong>S:</strong>
          <input type="text" value={student.s} disabled />
        </label>
        <label>
          <strong>Имя:</strong>
          <input type="text" value={student.first_name} disabled />
        </label>
        <label>
          <strong>Фамилия:</strong>
          <input type="text" value={student.last_name} disabled />
        </label>
        <label>
          <strong>Отчество:</strong>
          <input type="text" value={student.middle_name || "-"} disabled />
        </label>
        <label>
          <strong>Email:</strong>
          <input type="text" value={student.email || "-"} disabled />
        </label>
        <label>
          <strong>Телефон:</strong>
          <input type="text" value={student.phone_number || "-"} disabled />
        </label>
        <label>
          <strong>Дата рождения:</strong>
          <input
            type="text"
            value={
              student.birth_date
                ? new Date(student.birth_date).toLocaleDateString()
                : "-"
            }
            disabled
          />
        </label>
        <label>
          <strong>Курс:</strong>
          <input type="text" value={student.course} disabled />
        </label>
        <label>
          <strong>Область:</strong>
          <input
            type="text"
            value={student.region?.region_name || "-"}
            disabled
          />
        </label>
        <label>
          <strong>Пол:</strong>
          <input type="text" value={student.gender || "-"} disabled />
        </label>
      </div>
      <div className="form-actions">
        <button className="cancel-button" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  </div>
);

export default AdminStudentViewModal;
