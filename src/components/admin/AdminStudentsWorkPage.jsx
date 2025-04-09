import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';
import wicon from '../../assets/icons/wicon.png';
import cicon from '../../assets/icons/cicon.png';

const AdminStudentsWorkPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await api.get('/studentlist');
      const studentData = Array.isArray(response.data)
        ? response.data
        : (response.data.results ? response.data.results : Object.values(response.data));
      setStudents(studentData);
    } catch (error) {
      console.error('Ошибка при загрузке студентов:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке данных' });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Работа со студентами</h1>
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>S</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Отчество</th>
                <th>Курс</th>
                <th>Операции</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(students) && students.length > 0 ? (
                students.map(student => (
                  <tr key={student.id}>
                    <td>
                      {student.avatar ? (
                        <img src={student.avatar} alt="Avatar" className="student-avatar" />
                      ) : (
                        <div className="student-avatar-placeholder"></div>
                      )}
                    </td>
                    <td>{student.s}</td>
                    <td>{student.first_name}</td>
                    <td>{student.last_name}</td>
                    <td>{student.middle_name || '-'}</td>
                    <td>{student.course}</td>
                    <td>
                      <img
                        src={wicon}
                        alt="Просмотр"
                        className="operation-icon"
                        onClick={() => navigate(`/admin/students/view-one/${student.id}`)}
                      />
                      <img
                        src={cicon}
                        alt="Редактирование"
                        className="operation-icon"
                        onClick={() => navigate(`/admin/students/edit/${student.id}`)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Нет данных для отображения.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
      </div>
    </div>
  );
};

export default AdminStudentsWorkPage;
