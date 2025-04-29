import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminFormShared.css';

const roleOptions = [
  { value: 'SUPER', label: 'Главный администратор' },
  { value: 'OP',    label: 'Оператор' },
  { value: 'REQ',   label: 'Администратор по работе с заявками' },
];

const AdminEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({
    s: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    phone_number: '',
    birth_date: '',
    role: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get(`/admins/${id}/`);
        setAdmin(res.data);
        setFormData({
          s:           res.data.s           || '',
          first_name:  res.data.first_name  || '',
          last_name:   res.data.last_name   || '',
          middle_name: res.data.middle_name || '',
          email:       res.data.email       || '',
          phone_number:res.data.phone_number|| '',
          birth_date:  res.data.birth_date  || '',
          role:        res.data.role        || '',
        });
      } catch (err) {
        console.error('Ошибка при загрузке данных администратора:', err);
        setMessage('Ошибка при загрузке данных администратора.');
      }
    };
    fetchAdmin();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      await api.put(`/admins/${id}/`, formData);
      setMessage('Данные успешно сохранены.');
      navigate('/admin/admins');
    } catch (err) {
      console.error('Ошибка при сохранении данных администратора:', err);
      setMessage('Ошибка при сохранении данных администратора.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/admins');
  };

  if (!admin) {
    return (
      <div className="admin-page-container">
        <AdminSidebar />
        <div className="content-area">
          <p>Загрузка данных...</p>
          {message && <p className="error-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="admin-form-container">
          <h2>Редактирование администратора</h2>
          <form className="form-container" onSubmit={handleSave}>
            <label>
              S:
              <input
                type="text"
                name="s"
                value={formData.s}
                onChange={handleChange}
                disabled
              />
            </label>
            <label>
              Имя:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Фамилия:
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Отчество:
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Телефон:
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </label>
            <label>
              Дата рождения:
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </label>
            <label>
              Роль:
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Выберите роль</option>
                {roleOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Отмена
              </button>
              <button type="submit" className="save-button">
                Сохранить
              </button>
            </div>
          </form>
          {message && (
            <div
              className={`message ${
                message.toLowerCase().includes('ошибка') ? 'error' : 'success'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditPage;
