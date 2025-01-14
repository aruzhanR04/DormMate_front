import React, { useState, useEffect } from 'react';
import '../styles/AdminPanel.css';
import api from '../api';
import { all } from 'axios';

const AdminPanel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [allApplications, setAllApplications] = useState([]);
  const [dormitories, setDormitories] = useState([]);
  const [editingApplicationId, setEditingApplicationId] = useState(null); 

  const certificates = [
    { field: 'orphan_certificate', label: 'Справка о сиротстве' },
    { field: 'disability_1_2_certificate', label: 'Справка об инвалидности 1-2 групп' },
    { field: 'disability_3_certificate', label: 'Справка об инвалидности 3 группы' },
    { field: 'parents_disability_certificate', label: 'Справка об инвалидности родителей' },
    { field: 'loss_of_breadwinner_certificate', label: 'Справка о потере кормильца' },
    { field: 'social_aid_certificate', label: 'Справка о получении государственной социальной помощи' },
    { field: 'mangilik_el_certificate', label: "Справка об обучении по программе 'Мәнгілік ел жастары - индустрияға!'(Серпін 2050)" },
    { field: 'olympiad_winner_certificate', label: 'Сертификаты о победах в олимпиадах' },
  ];
  const baseUrl = "http://127.0.0.1:8000/api/v1/applications";

  const fetchDormitories = async () => {
    try {
      const response = await api.get('/dormlist'); 
      setDormitories(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке списка общежитий:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке списка общежитий' });
    }
  };

  const handleExportStudents = async (apiUrl) => {
    try {
      const response = await api.get(apiUrl, { responseType: 'blob' });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
  
      link.setAttribute('download', 'students_in_dorm.xlsx');
      document.body.appendChild(link);
  
      link.click();
  
      link.parentNode.removeChild(link);
  
      setMessage({ type: 'success', text: 'Файл успешно выгружен!' });
    } catch (error) {
      console.error('Ошибка при выгрузке студентов:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload-excel/', formData);
      setMessage({ type: 'success', text: 'Данные успешно загружены и обновлены' });
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleDistributeStudents = async (apiUrl) => {
    try {
      const response = await api.post(apiUrl);
      setMessage({ type: 'success', text: response.data.detail || 'Студенты успешно распределены' });
    } catch (error) {
      console.error('Ошибка при распределении студентов:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleApproveApplication = async (applicationId) => {
    try {
      const response = await api.put(`/applications/${applicationId}/approve/`, {
        status: 'approved',
      });
      setMessage({ type: 'success', text: 'Заявка успешно одобрена' });

      setAllApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: 'approved' } : app
        )
      );
    } catch (error) {
      console.error('Ошибка при одобрении заявки:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleChangeDormitory = async (applicationId, dormitoryName) => {
    if (!dormitoryName) return;
  
    try {
      const response = await api.put(`/applications/${applicationId}/change-dormitory/`, {
        dorm_name: dormitoryName, 
      });
  
      setMessage({ type: 'success', text: response.data.message });
  
      setAllApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, dormitory_choice: dormitoryName } : app
        )
      );
  
      setEditingApplicationId(null); 
    } catch (error) {
      console.error('Ошибка при изменении общежития:', error);
      setMessage({ type: 'error', text: 'Ошибка при изменении общежития' });
    }
  };
  
  
  const handleRejectApplication = async (applicationId) => {
    try {
      const response = await api.put(`/applications/${applicationId}/reject/`, {
        status: 'rejected',
      });
      setMessage({ type: 'success', text: 'Заявка успешно отклонена' });
  
      setAllApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: 'rejected' } : app
        )
      );
    } catch (error) {
      console.error('Ошибка при отклонении заявки:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };
  

  const fetchAllApplications = async () => {
    try {
      const response = await api.get('/applications');
      setAllApplications(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  console.log(allApplications);

  useEffect(() => {
    fetchAllApplications();
    fetchDormitories();
  }, []);

  return (
   <div className="admin-panel">
      <h1>Панель администратора</h1>

      <div className="section">
        <h2>Загрузка Excel файла</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Загрузить файл</button>
      </div>

      <div className="section">
        <h2>Все заявки</h2>
        {allApplications.length > 0 ? (
          <ol>
            {allApplications.map((app) => (
              <li key={app.id}>
                <p>Заявка ID: {app.id}</p>
                <p>Студент: {app.student.first_name} {app.student.last_name}</p>
                <p>Курс: {app.student.course}</p>
                <p>Статус: {app.status}</p>
                <p>Общежитие: {app.dormitory_name || 'Не выбрано'}</p>
                <p>
                  Оплата: 
                  {app.payment_screenshot ? (
                    <a 
                      href={`http://127.0.0.1:8000/api/v1/applications/${app.id}/payment-screenshot/`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Просмотреть скрин оплаты
                    </a>
                  ) : (
                    'Нет'
                  )}
                </p>
                <p>GPA: {app.gpa || 'Нет'}</p>
                <p>Результат ЕНТ: {app.ent_result || 'Нет'}</p>

                {certificates.map(({ field, label }) => (
                  <p key={field}>
                    {label}:{' '}
                    {app[field] ? (
                      <a
                        href={`${baseUrl}/${app.id}/files/${field}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Открыть справку
                      </a>
                    ) : (
                      'Нет'
                    )}
                  </p>
                ))}

                <button onClick={() => handleApproveApplication(app.id)}>
                  Одобрить заявку
                </button>

                {editingApplicationId === app.id ? (
                  <div>
                    <select
                      onChange={(e) => handleChangeDormitory(app.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Выберите общежитие
                      </option>
                      {dormitories.map((dorm) => (
                        <option key={dorm.id} value={dorm.name}>
                          {dorm.name}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => setEditingApplicationId(null)}>Отменить</button>
                  </div>
                ) : (
                  <button onClick={() => setEditingApplicationId(app.id)}>
                    Изменить общежитие
                  </button>
                )}

                <button onClick={() => handleRejectApplication(app.id)}>
                  Отклонить заявку
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p>Нет заявок для отображения.</p>
        )}
      </div>
      <div className="section">
        <h2>Распределение студентов</h2>
        <button onClick={() => handleDistributeStudents('/distribute-students/')}>
          Распределить студентов по заявкам
        </button>
        <button onClick={() => handleDistributeStudents('/distribute-students2/')}>
          Распределить студентов по комнатам
        </button>
        <button onClick={() => handleExportStudents('/export-students/')}>
          Выгрузить заселенных студентов
        </button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default AdminPanel;
