import React, { useState, useEffect } from 'react';
import api from '../api';

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Загружаем уведомления каждые 5 сек
  const fetchNotifications = async () => {
    try {
      const res = await api.get('notifications/admin/');
      setNotifications(res.data); // предполагаем список [{id, message, created_at}, ...]
    } catch (err) {
      console.error('Ошибка при загрузке уведомлений админа:', err);
      if (err.response && err.response.status === 401) {
        setError('Не авторизовано для админа.');
      } else {
        setError('Ошибка при загрузке уведомлений.');
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Отметить уведомление как прочитанное
  const markAsRead = async (id) => {
    try {
      await api.post('notifications/admin/', { notification_ids: [id] });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Ошибка при отметке уведомления:', err);
    }
  };

  return (
    <div className="admin-notifications-popup">
      <h4>Уведомления от студентов</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {notifications.length === 0 ? (
        <p>Нет новых уведомлений</p>
      ) : (
        notifications.map(n => (
          <div key={n.id} className="admin-notif-item">
            <p>{n.message}</p>
            <button onClick={() => markAsRead(n.id)}>Скрыть</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminNotifications;
