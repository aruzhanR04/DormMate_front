import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/icons/logo.png';
import bellIcon from '../../assets/icons/bell.png';
import notificationSound from '../../assets/audio/notification.mp3';
import api from '../../api';

const Navbar = ({ isAuthenticated, userRole, userName }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // ---------------- STUDENT NOTIFICATIONS -----------------
  const [studentNotifications, setStudentNotifications] = useState([]);
  const [isStudentNotifOpen, setIsStudentNotifOpen] = useState(false);
  const [hasNewStudentNotification, setHasNewStudentNotification] = useState(false);
  const audioRef = useRef(null);
  const prevStudentCountRef = useRef(0);

  // ---------------- ADMIN NOTIFICATIONS -----------------
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [isAdminNotifOpen, setIsAdminNotifOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === 'student') {
      audioRef.current = new Audio(notificationSound);
      audioRef.current.volume = 0.8;
    }
  }, [userRole]);


  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      fetchStudentNotifications();
      const interval = setInterval(fetchStudentNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    if (isAuthenticated && userRole === 'admin') {
      fetchAdminNotifications();
      const interval = setInterval(fetchAdminNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userRole]);

  const fetchStudentNotifications = async () => {
    try {
      const res = await api.get('notifications/');
      const data = Array.isArray(res.data) ? res.data : [];
      setStudentNotifications(data);

      if (data.length > prevStudentCountRef.current && data.length > 0) {
        setHasNewStudentNotification(true);
        try {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        } catch {}
      }
      prevStudentCountRef.current = data.length;
    } catch (error) {
      console.error('Ошибка загрузки уведомлений студента:', error);
    }
  };

  const fetchAdminNotifications = async () => {
    try {
      const res = await api.get('notifications/admin/');
      const data = Array.isArray(res.data) ? res.data : [];
      setAdminNotifications(data);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений админа:', error);
    }
  };

  const markStudentNotificationRead = async (id) => {
    try {
      await api.post('notifications/', { notification_ids: [id] });
      setStudentNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Ошибка отметки уведомления:', error);
    }
  };

  const markAdminNotificationRead = async (id) => {
    try {
      await api.post('notifications/admin/', { notification_ids: [id] });
      setAdminNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Ошибка отметки уведомления (админ):', error);
    }
  };

  const toggleStudentNotifications = () => {
    setIsStudentNotifOpen((prev) => !prev);
    if (!isStudentNotifOpen) setHasNewStudentNotification(false);
  };

  const toggleAdminNotifications = () => {
    setIsAdminNotifOpen((prev) => !prev);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleProfileDropdown = () => setProfileDropdownOpen((prev) => !prev);
  const handleLogout = () => navigate('/logout');

  const getInitials = () => {
    if (!userName) return '';
    const parts = userName.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Narxoz University" className="logo" />
        </Link>
      </div>

      <div className="navbar-right">
        <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" className="nav-btn-link">Главная</Link>
          </li>
          {isAuthenticated && userRole === 'student' && (
            <li>
              <Link to="/create-application" className="nav-btn-link">Подать заявку</Link>
            </li>
          )}
        </ul>

        {isAuthenticated && userRole === 'student' && (
          <div className="notification-wrapper">
            <button
              className="notification-bell"
              onClick={toggleStudentNotifications}
              aria-label="Уведомления"
              type="button"
            >
              <img src={bellIcon} alt="Уведомления" />
              {hasNewStudentNotification && <span className="notification-dot" />}
            </button>
            {isStudentNotifOpen && (
              <div className="notifications-popup">
                <h4>Уведомления</h4>
                {studentNotifications.length === 0 ? (
                  <p className="no-notifications">Нет уведомлений</p>
                ) : (
                  studentNotifications.map((n) => (
                    <div key={n.id} className="notification-item">
                      <p>{n.message}</p>
                      <button onClick={() => markStudentNotificationRead(n.id)} className="notif-button">Скрыть</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {isAuthenticated && userRole === 'admin' && (
          <div className="notification-wrapper">
            <button
              className="notification-bell"
              onClick={toggleAdminNotifications}
              aria-label="Уведомления администратора"
              type="button"
            >
              <img src={bellIcon} alt="Уведомления" />
            </button>
            {isAdminNotifOpen && (
              <div className="notifications-popup">
                <h4>Уведомления (Админ)</h4>
                {adminNotifications.length === 0 ? (
                  <p className="no-notifications">Нет уведомлений</p>
                ) : (
                  adminNotifications.map((n) => (
                    <div key={n.id} className="notification-item">
                      <p>{n.message}</p>
                      <button onClick={() => markAdminNotificationRead(n.id)} className="notif-button">Скрыть</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <div className="profile-menu-wrapper">
            <button
              className="profile-avatar"
              onClick={toggleProfileDropdown}
              aria-label="Меню пользователя"
              type="button"
            >
              {getInitials() || 'ИФ'}
            </button>
            <button
              className="profile-name-btn"
              onClick={toggleProfileDropdown}
              type="button"
            >
              {userName || 'Имя Фамилия'}
            </button>
            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-name">{userName || 'Имя Фамилия'}</div>
                <ul>
                  <li>
                    <Link to="/profile" onClick={() => setProfileDropdownOpen(false)}>Профиль</Link>
                  </li>
                  <li>
                    <button type="button" onClick={handleLogout} className="logout-btn">Выйти</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-login">Войти</Link>
        )}

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Открыть меню">
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
