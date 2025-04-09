import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import notificationSound from '../../assets/audio/notification.mp3';
import '../../styles/Notifications.css'; 

function NotificationsPopup({ onOpenChat }) {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false); // Пользователь включил звук?
  const audioRef = useRef(null);
  const prevCount = useRef(0);

  // Инициируем аудио (молча)
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.7;
    audioRef.current.muted = true; // Беззвучный автоплей
    audioRef.current.play().catch(() => {
      // Игнорируем ошибку, если автоплей заблокирован
    });
  }, []);

  // При клике «Включить звук»
  const enableSound = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      setAudioEnabled(true);
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.log('Ошибка включения звука:', e);
      });
    }
  };

  // Подгружаем уведомления
  const fetchNotifications = async () => {
    try {
      const res = await api.get('notifications/');
      setNotifications(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке уведомлений:', err);
      setError('Не удалось загрузить уведомления');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Смотрим, не появились ли новые уведомления
  useEffect(() => {
    if (notifications.length > prevCount.current && audioEnabled) {
      // Есть новые уведомления, звук включён
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => {
          console.log('Ошибка проигрывания аудио:', e);
        });
      }
    }
    prevCount.current = notifications.length;
  }, [notifications, audioEnabled]);

  // Пометить уведомление прочитанным
  const markNotificationRead = async (id) => {
    try {
      await api.post('notifications/', { notification_ids: [id] });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Ошибка при отметке уведомления как прочитанного:', err);
    }
  };

  // Нажали «Посмотреть чат»
  const handleOpenChat = (id) => {
    if (onOpenChat) onOpenChat();
    markNotificationRead(id);
  };

  return (
    <div className="notifications-popup neon-glow">
      <h3 className="popup-title">Уведомления</h3>

      {!audioEnabled && (
        <button className="sound-btn" onClick={enableSound}>
          Включить звук
        </button>
      )}

      {error && <p className="error">{error}</p>}

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="no-notifs">Нет уведомлений</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="notification-card swing-in-top-fwd">
              <p className="notif-msg">{n.message}</p>
              <div className="notif-actions">
                <button onClick={() => handleOpenChat(n.id)}>Чат</button>
                <button onClick={() => markNotificationRead(n.id)}>Скрыть</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPopup;
