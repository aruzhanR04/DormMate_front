import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/AdminActions.css';
import AdminSidebar from './AdminSidebar';

const AdminSelectStudentsPage = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications');
        const apps = response.data.results || response.data;
        setApplications(apps);
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
      }
    };

    fetchApplications();
  }, []);

  const updateApplicationStatus = (id, status) => {
    setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/applications/${id}/approve/`);
      updateApplicationStatus(id, 'approved');
    } catch (error) {
      console.error('Ошибка при одобрении заявки:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/applications/${id}/reject/`);
      updateApplicationStatus(id, 'rejected');
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error);
    }
  };

  const handleApproveMedicalCert = async (id) => {
    try {
      await api.put(`/applications/${id}/approve-medical-cert/`);
      setApplications(applications.map(app => 
        app.id === id ? { ...app, medical_cert_approved: true } : app
      ));
    } catch (error) {
      console.error('Ошибка при одобрении медсправки:', error);
    }
  };

  const handleRejectMedicalCert = async (id) => {
    try {
      await api.put(`/applications/${id}/reject-medical-cert/`);
      setApplications(applications.map(app => 
        app.id === id ? { ...app, medical_cert_approved: false } : app
      ));
    } catch (error) {
      console.error('Ошибка при отклонении медсправки:', error);
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Все заявки</h1>
        <div className="applications-list">
          {applications.map(app => (
            <div key={app.id} className="application-item">
              <p><strong>Студент:</strong> {app.student.first_name} {app.student.last_name}</p>
              <p><strong>Курс:</strong> {app.student.course}</p>
              <p><strong>GPA:</strong> {app.gpa || 'Нет данных'}</p>
              <p><strong>Общежитие:</strong> {app.dormitory_name || 'Не выбрано'}</p>
              <p><strong>Статус:</strong> {app.status}</p>
              <p>
                <strong>Оплата:</strong> {app.payment_screenshot ? (
                  <a 
                    href={`http://127.0.0.1:8000/api/v1/applications/${app.id}/payment-screenshot/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Просмотреть скрин оплаты
                  </a>
                ) : 'Нет'}
              </p>
              <p>
                <strong>Медсправка:</strong> {app.medical_cert_approved ? 'Одобрена' : 'Не одобрена'}
              </p>
              <button className="approve-btn" onClick={() => handleApprove(app.id)}>Одобрить заявку</button>
              <button className="reject-btn" onClick={() => handleReject(app.id)}>Отклонить заявку</button>
              <button className="approve-cert-btn" onClick={() => handleApproveMedicalCert(app.id)}>Одобрить справку</button>
              <button className="reject-cert-btn" onClick={() => handleRejectMedicalCert(app.id)}>Отклонить справку</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSelectStudentsPage;
