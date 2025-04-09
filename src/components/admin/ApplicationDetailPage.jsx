import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/ApplicationDetail.css';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/applications/${id}/`);
        setApplication(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке заявки:', error);
      }
    };
    fetchApplication();
  }, [id]);

  if (!application) return <div>Загрузка...</div>;

  return (
    <div className="application-detail">
      <h1>Детали заявки {id}</h1>
      <div className="detail-info">
        <p><strong>ФИО:</strong> {application.student.first_name} {application.student.last_name}</p>
        <p><strong>Курс:</strong> {application.student.course}</p>
        <p><strong>Логин:</strong> {application.student.login}</p>
        <p><strong>Пол:</strong> {application.student.gender}</p>
        <p><strong>GPA:</strong> {application.gpa}</p>
        <p><strong>ЕНТ:</strong> {application.ent_result}</p>
      </div>
      <div className="detail-actions">
        <button onClick={() => {}}>Одобрить</button>
        <button onClick={() => {}}>Отклонить</button>
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
