import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/AdminActions.css';
import AdminSidebar from './AdminSidebar';

const AdminSelectStudentsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      const apps = response.data.results || response.data;
      setApplications(apps);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  useEffect(() => {
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

  // Функция для обновления статуса конкретного документа
  const handleUpdateEvidenceStatus = async (evidenceId, approved) => {
    try {
      await api.put(`/evidences/${evidenceId}/update-status/`, { approved });
      setApplications(prevApps =>
        prevApps.map(app => {
          const updatedEvidences = app.evidences.map(evi => {
            if (evi.id === evidenceId) {
              return { ...evi, approved };
            }
            return evi;
          });
          return { ...app, evidences: updatedEvidences };
        })
      );
    } catch (error) {
      console.error('Ошибка при обновлении статуса доказательства:', error);
    }
  };

  // Фильтрация заявок
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    if (filter === 'approved') return app.status === 'approved' || app.status === 'awaiting_payment';
    if (filter === 'rejected') return app.status === 'rejected';
    return true;
  });

  // Обработчик автоматического отбора
  const handleAutomaticSelection = async () => {
    try {
      const response = await api.post('/generate-selection/');
      alert(response.data.detail);
      fetchApplications();
    } catch (error) {
      console.error('Ошибка при автоматическом отборе:', error);
    }
  };

  // Обработчик уведомления студентов
  const handleNotifyStudents = async () => {
    try {
      const response = await api.post('/notify-approved/');
      alert(response.data.detail);
      fetchApplications();
    } catch (error) {
      console.error('Ошибка при уведомлении студентов:', error);
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="admin-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Все</option>
            <option value="approved">Одобренные</option>
            <option value="rejected">Отклонённые</option>
          </select>
          <button className="auto-select-btn" onClick={handleAutomaticSelection}>
            Автоматический отбор
          </button>
          <button className="notify-btn" onClick={handleNotifyStudents}>
            Уведомить студентов
          </button>
        </div>
        <h1>Все заявки</h1>
        <div className="applications-list">
          {filteredApplications.map(app => (
            <div key={app.id} className="application-item">
              <p>
                <strong>Студент:</strong> {app.student.first_name} {app.student.last_name}
              </p>
              <p>
                <strong>Курс:</strong> {app.student.course}
              </p>
              <p>
                <strong>GPA:</strong> {app.gpa || 'Нет данных'}
              </p>
              <p>
                <strong>Общежитие:</strong> {app.dormitory_cost || 'Не выбрано'}
              </p>
              <p>
                <strong>Статус:</strong> {app.status}
              </p>
              <p>
                <strong>Оплата:</strong>{' '}
                {app.payment_screenshot ? (
                  <a 
                    href={`http://127.0.0.1:8000/api/v1/applications/${app.id}/payment-screenshot/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Просмотреть скрин оплаты
                  </a>
                ) : 'Нет'}
              </p>
              {/* Отображение вложенных документов */}
              <div className="evidences">
                <h4>Документы:</h4>
                {app.evidences && app.evidences.length > 0 ? (
                  <ul>
                    {app.evidences.map(evi => (
                      <li key={evi.id}>
                        <strong>{evi.evidence_type}</strong>:{' '}
                        {evi.file ? (
                          <a
                          href={evi.file}

                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Просмотреть файл
                          </a>
                        ) : evi.numeric_value ? (
                          <span>{evi.numeric_value}</span>
                        ) : (
                          <span>Нет данных</span>
                        )}
                        <p>
                          <strong>Статус справки:</strong>{' '}
                          {evi.approved === true
                            ? 'Одобрена'
                            : evi.approved === false
                            ? 'Отклонена'
                            : 'Не проверена'}
                        </p>
                        <button 
                          className="approve-cert-btn" 
                          onClick={() => handleUpdateEvidenceStatus(evi.id, true)}
                        >
                          Одобрить
                        </button>
                        <button 
                          className="reject-cert-btn" 
                          onClick={() => handleUpdateEvidenceStatus(evi.id, false)}
                        >
                          Отклонить
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Нет прикрепленных документов</p>
                )}
              </div>
              <div className="actions">
                <button className="approve-btn" onClick={() => handleApprove(app.id)}>
                  Одобрить заявку
                </button>
                <button className="reject-btn" onClick={() => handleReject(app.id)}>
                  Отклонить заявку
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSelectStudentsPage;
