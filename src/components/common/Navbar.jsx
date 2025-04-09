import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/icons/logo.png';
import bellIcon from '../../assets/icons/bell.png';
import notificationSound from '../../assets/audio/notification.mp3'; 
import api from '../../api';

const Navbar = ({ isAuthenticated, userRole }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // ---------------- STUDENT NOTIFICATIONS -----------------
  const [studentNotifications, setStudentNotifications] = useState([]);
  const [isStudentNotifOpen, setIsStudentNotifOpen] = useState(false);
  const [hasNewStudentNotification, setHasNewStudentNotification] = useState(false);
  const audioRef = useRef(null);
  const prevStudentCountRef = useRef(0);

  // ---------------- ADMIN NOTIFICATIONS -----------------
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [isAdminNotifOpen, setIsAdminNotifOpen] = useState(false);
  const [hasNewAdminNotification] = useState(false); // админ не хочет звук/точку

  // Инициируем аудио только один раз
  useEffect(() => {
    if (userRole === 'student') {
      audioRef.current = new Audio(notificationSound);
      audioRef.current.volume = 0.8;
    }
  }, [userRole]);

  // STUDENT: подгрузка уведомлений каждые 10 сек
  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      fetchStudentNotifications();
      const interval = setInterval(fetchStudentNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userRole]);

  // ADMIN: подгрузка уведомлений каждые 10 сек
  useEffect(() => {
    if (isAuthenticated && userRole === 'admin') {
      fetchAdminNotifications();
      const interval = setInterval(fetchAdminNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userRole]);

  // ---------------- STUDENT: FETCH & SOUND ----------------
  const fetchStudentNotifications = async () => {
    try {
      const res = await api.get('notifications/');
      const data = Array.isArray(res.data) ? res.data : [];
      setStudentNotifications(data);

      // Сравниваем количество
      if (data.length > prevStudentCountRef.current && data.length > 0) {
        setHasNewStudentNotification(true);
        // Проигрываем звук
        try {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        } catch (err) {
          console.log('Не удалось воспроизвести аудио:', err);
        }
      }
      prevStudentCountRef.current = data.length;
    } catch (error) {
      console.error('Ошибка при загрузке студенческих уведомлений:', error);
    }
  };

  // ---------------- ADMIN: FETCH (без звука) ----------------
  const fetchAdminNotifications = async () => {
    try {
      // Допустим у нас эндпоинт /notifications/admin/
      const res = await api.get('notifications/admin/');
      const data = Array.isArray(res.data) ? res.data : [];
      setAdminNotifications(data);
    } catch (error) {
      console.error('Ошибка при загрузке админских уведомлений:', error);
    }
  };

  // ---------------- STUDENT: пометить уведомление прочитанным ----------------
  const markStudentNotificationRead = async (id) => {
    try {
      await api.post('notifications/', { notification_ids: [id] });
      setStudentNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Ошибка при отметке уведомления:', error);
    }
  };

  // ---------------- ADMIN: пометить уведомление прочитанным ----------------
  const markAdminNotificationRead = async (id) => {
    try {
      await api.post('notifications/admin/', { notification_ids: [id] });
      setAdminNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Ошибка при отметке уведомления (admin):', error);
    }
  };

  // ---------------- STUDENT: открыть/закрыть окно уведомлений ----------------
  const toggleStudentNotifications = () => {
    setIsStudentNotifOpen(!isStudentNotifOpen);
    // Если открываем окно — сбрасываем индикатор
    if (!isStudentNotifOpen) {
      setHasNewStudentNotification(false);
    }
  };

  // ---------------- ADMIN: открыть/закрыть окно уведомлений ----------------
  const toggleAdminNotifications = () => {
    setIsAdminNotifOpen(!isAdminNotifOpen);
  };

  // ---------------- MENU BURGER ----------------
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        {isAuthenticated ? (
          <>
            {userRole === 'student' && (
              <>
                <li className="nav-item">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/create-application">Подать заявку</Link>
                </li>
              </>
            )}
            {userRole === 'admin' && (
              <li className="nav-item">
                <Link to="/admin">Admin Panel</Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link to="/login">Login</Link>
          </li>
        )}

        {/* Колокольчик для студента (со звуком) */}
        {isAuthenticated && userRole === 'student' && (
          <li className="nav-item">
            <div className="notification-bell" onClick={toggleStudentNotifications}>
              <img src={bellIcon} alt="Уведомления" className="bell-icon" />
              {hasNewStudentNotification && <span className="notification-dot" />}
            </div>
          </li>
        )}

        {/* Колокольчик для админа (без звука) */}
        {isAuthenticated && userRole === 'admin' && (
          <li className="nav-item">
            <div className="notification-bell" onClick={toggleAdminNotifications}>
              <img src={bellIcon} alt="Admin Notifications" className="bell-icon" />
              {/* admin не нужен sound/ dot, но можешь добавить при желании */}
            </div>
          </li>
        )}
      </ul>

      {/* Модалка уведомлений для студента */}
      {isStudentNotifOpen && (
        <div className="notifications-popup">
          <h4>Уведомления</h4>
          {studentNotifications.length === 0 ? (
            <p className="no-notifications">Нет уведомлений</p>
          ) : (
            studentNotifications.map(n => (
              <div key={n.id} className="notification-item">
                <p>{n.message}</p>
                <button onClick={() => markStudentNotificationRead(n.id)}>Скрыть</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Модалка уведомлений для админа */}
      {isAdminNotifOpen && (
        <div className="notifications-popup">
          <h4>Уведомления (Админ)</h4>
          {adminNotifications.length === 0 ? (
            <p className="no-notifications">Нет уведомлений</p>
          ) : (
            adminNotifications.map(n => (
              <div key={n.id} className="notification-item">
                <p>{n.message}</p>
                <button onClick={() => markAdminNotificationRead(n.id)}>Скрыть</button>
              </div>
            ))
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
