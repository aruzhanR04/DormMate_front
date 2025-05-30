import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import AdminSidebar from "./AdminSidebar";
import '../../styles/AdminFormShared.css';

const roleOptions = [
  { value: 'SUPER', label: 'Главный администратор' },
  { value: 'OP',    label: 'Оператор' },
  { value: 'REQ',   label: 'Администратор по работе с заявками' },
];

const AdminCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    s: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "",
    role: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
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
      } else {
        console.error(error);
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
              S:
              <input
                type="text"
                name="s"
                value={formData.s}
                onChange={handleChange}
                required
              />
              {errors.s && <p className="error-message">{errors.s}</p>}
            </label>

            <label>
              Имя:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <p className="error-message">{errors.first_name}</p>}
            </label>

            <label>
              Фамилия:
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <p className="error-message">{errors.last_name}</p>}
            </label>

            <label>
              Отчество:
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
              />
              {errors.middle_name && <p className="error-message">{errors.middle_name}</p>}
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </label>

            <label>
              Телефон:
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && <p className="error-message">{errors.phone_number}</p>}
            </label>

            <label>
              Дата рождения:
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
              {errors.birth_date && <p className="error-message">{errors.birth_date}</p>}
            </label>

            <label>
              Пол:
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Выберите...</option>
                <option value="M">Мужской</option>
                <option value="F">Женский</option>
              </select>
              {errors.gender && <p className="error-message">{errors.gender}</p>}
            </label>

            <label>
              Роль:
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Выберите роль</option>
                {roleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.role && <p className="error-message">{errors.role}</p>}
            </label>

            <label>
              Пароль:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </label>

            <div className="form-actions">
              <button type="submit" className="save-button">
                Добавить
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/admin/admins")}
              >
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
