import React, { useState } from "react";
import ReactDOM from "react-dom";
import '../../styles/AdminFormShared.css';

const roleOptions = [
  { value: 'SUPER', label: 'Главный администратор' },
  { value: 'OP', label: 'Оператор' },
  { value: 'REQ', label: 'Администратор по работе с заявками' }
];

const AdminEditModal = ({ admin, onClose, onSaved, api }) => {
  const [formData, setFormData] = useState({
    s: admin.s || "",
    first_name: admin.first_name || "",
    last_name: admin.last_name || "",
    middle_name: admin.middle_name || "",
    email: admin.email || "",
    phone_number: admin.phone_number || "",
    birth_date: admin.birth_date || "",
    gender: admin.gender || "",
    role: admin.role || ""
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.put(`/admins/${admin.id}/`, formData);
      setMessage('Изменения сохранены');
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setMessage('Ошибка при сохранении');
    }
  };

  const modalContent = (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Редактировать администратора</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <label>
            ID (s):
            <input type="text" name="s" value={formData.s} disabled />
          </label>
          <label>
            Имя:
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
          </label>
          <label>
            Фамилия:
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
          </label>
          <label>
            Отчество:
            <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} />
          </label>
          <label>
            Почта:
            <input type="text" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            Номер телефона:
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </label>
          <label>
            Дата рождения:
            <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
          </label>
          <label>
            Пол:
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Выберите...</option>
              <option value="M">Мужской</option>
              <option value="F">Женский</option>
            </select>
          </label>
          <label>
            Роль:
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Выберите роль</option>
              {roleOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Отмена</button>
            <button type="submit" className="save-button">Сохранить</button>
          </div>
          {message && <div style={{ width: "100%", color: '#c32939', marginTop: 10 }}>{message}</div>}
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AdminEditModal;
