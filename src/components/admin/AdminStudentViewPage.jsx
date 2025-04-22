import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminFormShared.css'; // подключаем общий стиль

const AdminStudentViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}/`);
        setStudent(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных студента:', error);
        setMessage('Ошибка при загрузке данных студента.');
      }
    };
    fetchStudent();
  }, [id]);

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
          <h1>Просмотр студента</h1>
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
              <input type="text" value={student.middle_name || '-'} disabled />
            </label>
            <label>
              <strong>Email:</strong>
              <input type="text" value={student.email || '-'} disabled />
            </label>
            <label>
              <strong>Телефон:</strong>
              <input type="text" value={student.phone_number || '-'} disabled />
            </label>
            <label>
              <strong>Дата рождения:</strong>
              <input
                type="text"
                value={
                  student.birth_date
                    ? new Date(student.birth_date).toLocaleDateString()
                    : '-'
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
                value={student.region?.region_name || '-'}
                disabled
              />
            </label>
            <label>
              <strong>Пол:</strong>
              <input type="text" value={student.gender || '-'} disabled />
            </label>
          </div>

          <div className="form-actions">
            <button className="cancel-button" onClick={() => navigate('/admin/students')}>
              Назад к списку
            </button>
          </div>

          {message && <div className="error-message">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentViewPage;
