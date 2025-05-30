import React, { useState } from "react";
import api from "../../api";
import "../../styles/AdminFormShared.css";

const AdminStudentEditModal = ({ student, onClose, onSaved }) => {
  const [formData, setFormData] = useState({ ...student });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { avatar, ...filteredData } = formData;
      await api.put(`/students/${student.id}/`, filteredData);
      setMessage("Данные успешно сохранены.");
      onSaved();
    } catch (error) {
      setMessage("Ошибка при сохранении данных.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 500 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Редактирование студента</h2>
        <form className="form-container" onSubmit={handleSave}>
          <label>
            S:
            <input type="text" name="s" value={formData.s || ""} onChange={handleChange} disabled />
          </label>
          <label>
            Имя:
            <input type="text" name="first_name" value={formData.first_name || ""} onChange={handleChange} />
          </label>
          <label>
            Фамилия:
            <input type="text" name="last_name" value={formData.last_name || ""} onChange={handleChange} />
          </label>
          <label>
            Отчество:
            <input type="text" name="middle_name" value={formData.middle_name || ""} onChange={handleChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
          </label>
          <label>
            Телефон:
            <input type="text" name="phone_number" value={formData.phone_number || ""} onChange={handleChange} />
          </label>
          <label>
            Дата рождения:
            <input type="date" name="birth_date" value={formData.birth_date || ""} onChange={handleChange} />
          </label>
          <label>
            Курс:
            <input type="number" name="course" value={formData.course || ""} onChange={handleChange} />
          </label>
          <label>
            Область:
            <input type="text" name="region" value={formData.region?.region_name || ""} onChange={handleChange} />
          </label>
          <label>
            Пол:
            <select name="gender" value={formData.gender || ""} onChange={handleChange}>
              <option value="">Выберите</option>
              <option value="M">М</option>
              <option value="F">Ж</option>
            </select>
          </label>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="save-button">
              Сохранить
            </button>
          </div>
        </form>
        {message && <div className="error-message">{message}</div>}
      </div>
    </div>
  );
};

export default AdminStudentEditModal;
