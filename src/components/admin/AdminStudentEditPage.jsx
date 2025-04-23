import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminFormShared.css';

const AdminStudentEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}/`);
        setStudent(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных студента:', error);
        setMessage('Ошибка при загрузке данных студента.');
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { avatar, ...filteredData } = formData;
      await api.put(`/students/${id}/`, filteredData);
      setMessage('Данные успешно сохранены.');
      navigate('/admin/students');
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      setMessage('Ошибка при сохранении данных.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/students');
  };

  if (!student) {
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
          <h2>Редактирование студента</h2>
          <form className="form-container" onSubmit={handleSave}>
            <label>
              S:
              <input type="text" name="s" value={formData.s || ''} onChange={handleChange} disabled />
            </label>
            <label>
              Имя:
              <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} />
            </label>
            <label>
              Фамилия:
              <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} />
            </label>
            <label>
              Отчество:
              <input type="text" name="middle_name" value={formData.middle_name || ''} onChange={handleChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
            </label>
            <label>
              Телефон:
              <input type="text" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} />
            </label>
            <label>
              Дата рождения:
              <input type="date" name="birth_date" value={formData.birth_date || ''} onChange={handleChange} />
            </label>
            <label>
              Курс:
              <input type="number" name="course" value={formData.course || ''} onChange={handleChange} />
            </label>
            <label>
              Область:
              <input type="text" name="region" value={formData.region?.region_name || ''} onChange={handleChange} />
            </label>
            <label>
              Пол:
              <select name="gender" value={formData.gender || ''} onChange={handleChange}>
                <option value="">Выберите</option>
                <option value="M">М</option>
                <option value="F">Ж</option>
              </select>
            </label>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Отмена
              </button>
              <button type="submit" className="save-button">
                Сохранить
              </button>
            </div>
          </form>
          {message && <div className={`message ${message.includes('ошибка') ? 'error' : 'success'}`}>{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentEditPage;
