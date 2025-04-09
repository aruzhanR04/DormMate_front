import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';

const StudentRoomDistributionPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState('');

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      const apps = Array.isArray(response.data)
        ? response.data
        : (response.data.results ? response.data.results : Object.values(response.data));
      setApplications(apps);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке данных.' });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedApplications(applications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (id) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(selectedApplications.filter(item => item !== id));
    } else {
      setSelectedApplications([...selectedApplications, id]);
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Распределение студентов по комнатам</h1>
        <div className="distribution-actions" style={{ marginBottom: '20px' }}>
          <button onClick={() => console.log('Одобрить выбранных:', selectedApplications)}>
            Одобрить выбранных
          </button>
        </div>
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
        <div className="students-list">
          <table className="students-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>S</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Курс</th>
                <th>Пол</th>
              </tr>
            </thead>
            <tbody>
              {applications && applications.length > 0 ? (
                applications.map(app => {
                  const student = app.student;
                  return student ? (
                    <tr key={app.id} onClick={() => navigate(`/admin/applications/${app.id}`)} style={{ cursor: 'pointer' }}>
                      <td onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(app.id)}
                          onChange={() => handleSelectApplication(app.id)}
                        />
                      </td>
                      <td>{student.s}</td>
                      <td>{student.first_name}</td>
                      <td>{student.last_name}</td>
                      <td>{student.course}</td>
                      <td>{student.gender}</td>
                    </tr>
                  ) : null;
                })
              ) : (
                <tr>
                  <td colSpan="6">Нет данных для отображения.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentRoomDistributionPage;
