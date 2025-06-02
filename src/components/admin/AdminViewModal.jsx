import React from "react";
import ReactDOM from "react-dom";
import '../../styles/AdminFormShared.css';

const roleOptions = {
  SUPER: 'Главный администратор',
  OP: 'Оператор',
  REQ: 'Администратор по работе с заявками'
};

const AdminViewModal = ({ admin, onClose }) => {
  if (!admin) return null;

  const modalContent = (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Просмотр администратора</h2>
        <div className="form-container">
          <label>
            ID (s):
            <input type="text" value={admin.s || ''} disabled />
          </label>
          <label>
            Имя:
            <input type="text" value={admin.first_name || ''} disabled />
          </label>
          <label>
            Фамилия:
            <input type="text" value={admin.last_name || ''} disabled />
          </label>
          <label>
            Отчество:
            <input type="text" value={admin.middle_name || ''} disabled />
          </label>
          <label>
            Почта:
            <input type="text" value={admin.email || ''} disabled />
          </label>
          <label>
            Номер телефона:
            <input type="text" value={admin.phone_number || ''} disabled />
          </label>
          <label>
            Дата рождения:
            <input type="text" value={admin.birth_date || ''} disabled />
          </label>
          <label>
            Пол:
            <input type="text" value={admin.gender === "M" ? "Мужской" : admin.gender === "F" ? "Женский" : ""} disabled />
          </label>
          <label>
            Роль:
            <input type="text" value={roleOptions[admin.role] || ''} disabled />
          </label>
        </div>
        <div className="form-actions">
          <button className="cancel-button" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AdminViewModal;
