import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/AdminActions.css';
import AdminSidebar from './AdminSidebar';

const AdminApplicationsPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [allowEdit, setAllowEdit] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/global-settings/');
        setAllowEdit(response.data.allow_application_edit);
      } catch (error) {
        console.error('Ошибка при получении настроек:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleEdit = async () => {
    try {
      const response = await api.post('/global-settings/', {
        allow_application_edit: !allowEdit
      });
      setAllowEdit(response.data.allow_application_edit);
      setMessage({ type: 'success', text: 'Настройка успешно обновлена' });
    } catch (error) {
      console.error('Ошибка при обновлении настроек:', error);
      setMessage({ type: 'error', text: 'Ошибка при обновлении настроек' });
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/export-students', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_data.xlsx');
      document.body.appendChild(link);
      link.click();
      setMessage({ type: 'success', text: 'Файл успешно выгружен' });
    } catch (error) {
      console.error('Ошибка при выгрузке данных:', error);
      setMessage({ type: 'error', text: 'Ошибка при выгрузке данных' });
    }
  };

  const handlePartialReminder = async () => {
    try {
      await api.post('/reminder/partial-payment/');
      alert('Все студенты уведомлены');
    } catch (error) {
      console.error('Ошибка при отправке напоминаний:', error);
      alert('Не удалось отправить напоминания. Попробуйте позже.');
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Заявки</h1>

        <div className="actions-list">
          <button onClick={() => navigate('/admin/applications/select')}>
            Отобрать студентов для проживания
          </button>
          <button onClick={() => navigate('/admin/applications/distribute')}>
            Распределить студентов по комнатам
          </button>
          <button onClick={handleExport}>
            Выгрузить заселенных студентов
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={allowEdit}
              onChange={handleToggleEdit}
            />
            Разрешить студентам редактировать заявки
          </label>
        </div>

        {message && (
          <div className={`message ${message.type}`} style={{ marginTop: '10px' }}>
            {message.text}
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <button
            className="partial-reminder-btn"
            onClick={handlePartialReminder}
          >
            Напомнить об оплате студентам, оплатившим половину стоимости
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;
