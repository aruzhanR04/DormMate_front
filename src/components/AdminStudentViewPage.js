import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AdminSidebar from './AdminSidebar';
import '../styles/AdminStudentDetails.css';

const AdminStudentViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}`);
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
        <h1>Просмотр студента</h1>
        <div className="student-details">
          <p><strong>S:</strong> {student.s}</p>
          <p><strong>Имя:</strong> {student.first_name}</p>
          <p><strong>Фамилия:</strong> {student.last_name}</p>
          <p><strong>Отчество:</strong> {student.middle_name || '-'}</p>
          <p><strong>Email:</strong> {student.email || '-'}</p>
          <p><strong>Телефон:</strong> {student.phone_number || '-'}</p>
          <p><strong>Дата рождения:</strong> {student.birth_date ? new Date(student.birth_date).toLocaleDateString() : '-'}</p>
          <p><strong>Курс:</strong> {student.course}</p>
          <p><strong>Область:</strong> {student.region ? student.region.region_name : '-'}</p>
          <p><strong>Пол:</strong> {student.gender || '-'}</p>
        </div>
        <button className="cancel-button" onClick={() => navigate('/admin/students')}>Назад к списку</button>
        {message && <div className="message error">{message}</div>}
      </div>
    </div>
  );
};

export default AdminStudentViewPage;
