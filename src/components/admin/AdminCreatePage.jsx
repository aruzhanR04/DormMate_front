import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import AdminSidebar from "./AdminSidebar";
import '../../styles/AdminFormShared.css';

const AdminCreatePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await api.post("/admins/", formData);
      if (response.status === 201 || response.status === 200) {
        navigate("/admin/admins");
      }
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="admin-form-container">
          <h2>Добавить администратора</h2>
          <form onSubmit={handleSubmit} className="form-container">
            <label>
              Имя пользователя:
              <input type="text" name="username" value={formData.username} onChange={handleChange} required />
              {errors.username && <p className="error-message">{errors.username}</p>}
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
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </label>

            <label>
              Телефон:
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
              Пароль:
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </label>

            <div className="form-actions">
              <button type="submit" className="save-button">Добавить</button>
              <button type="button" className="cancel-button" onClick={() => navigate("/admin/admins")}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatePage;
