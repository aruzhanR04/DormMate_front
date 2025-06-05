// src/components/common/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/icons/logo.png';
import bellIcon from '../../assets/icons/bell.png';
import notificationSound from '../../assets/audio/notification.mp3';
import api from '../../api';

const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Имя и URL аватара текущего пользователя
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // ---------------- STUDENT NOTIFICATIONS -----------------
  const [studentNotifications, setStudentNotifications] = useState([]);
  const [isStudentNotifOpen, setIsStudentNotifOpen] = useState(false);
  const [hasNewStudentNotification, setHasNewStudentNotification] = useState(false);
  const audioRef = useRef(null);
  const prevStudentCountRef = useRef(0);

  // ---------------- ADMIN NOTIFICATIONS -----------------
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [isAdminNotifOpen, setIsAdminNotifOpen] = useState(false);

  // Состояния, связанные с тем, есть ли у студента заявка
  const [hasApplication, setHasApplication] = useState(false);
  const [noApplication, setNoApplication] = useState(false);
  const [isEditWarningOpen, setIsEditWarningOpen] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [allowEdit, setAllowEdit] = useState(false)


  const navigate = useNavigate();

  // 1) Подгрузка профиля: для студента — /studentdetail/, для админа — /admins/me/
  useEffect(() => {
    if (!isAuthenticated) {
      setUserName('');
      setAvatarUrl('');
      return;
    }

    if (userRole === 'student') {
      api.get('/studentdetail/')
        .then(res => {
          const data = res.data;
          setUserName(`${data.first_name} ${data.last_name}`);
          setAvatarUrl(data.avatar || '');
        })
        .catch(err => {
          console.error('Ошибка при загрузке профиля студента в Navbar:', err);
          setUserName('');
          setAvatarUrl('');
        });
    } else if (userRole === 'admin') {
      api.get('/admins/me/')
        .then(res => {
          const data = res.data;
          setUserName(`${data.first_name} ${data.last_name}`);
          setAvatarUrl(data.avatar || '');
        })
        .catch(err => {
          console.error('Ошибка при загрузке профиля администратора в Navbar:', err);
          setUserName('');
          setAvatarUrl('');
        });
    } else {
      setUserName('');
      setAvatarUrl('');
    }
  }, [isAuthenticated, userRole]);

  // 2) Инициализация звука уведомлений для студента
  useEffect(() => {
    if (userRole === 'student' && isAuthenticated) {
      const audio = new Audio(notificationSound);
      audio.volume = 0.8;
      audioRef.current = audio;
    }
  }, [userRole, isAuthenticated]);

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const response = await api.get("/global-settings/")
        setAllowEdit(!!response.data?.allow_application_edit)
      } catch (error) {
        console.error("Ошибка при загрузке настроек:", error)
      } finally {
        setLoadingSettings(false)
      }
    }
    fetchGlobalSettings()
  }, [])

  // 3) Периодически загружаем уведомления студента
  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      fetchStudentNotifications();
      const interval = setInterval(fetchStudentNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userRole]);

  // 4) Периодически загружаем уведомления администратора
  useEffect(() => {
    if (isAuthenticated && userRole === 'admin') {
      fetchAdminNotifications();
      const interval = setInterval(fetchAdminNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userRole]);

  // 5) Дополнительный useEffect для проверки наличия заявки у студента
  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      api.get('/application_status/')
        .then(res => {
          // Любой успешный ответ (200) означает, что заявка есть
          setHasApplication(true);
          setNoApplication(false);
        })
        .catch(err => {
          if (err.response?.status === 404) {
            // Если нет заявки — возвращается 404
            setHasApplication(false);
            setNoApplication(true);
          } else {
            console.error('Ошибка при проверке статуса заявки в Navbar:', err);
            // В остальных случаях просто считаем, что заявки нет
            setHasApplication(false);
            setNoApplication(true);
          }
        });
    }
  }, [isAuthenticated, userRole]);



  const handleEditApplicationClick = () => {
    if (loadingSettings) return
    if (allowEdit) {
      navigate("/edit-application")
    } else {
      setIsEditWarningOpen(true)
    }
  }

  // Загрузка уведомлений студента
  const fetchStudentNotifications = async () => {
    try {
      const res = await api.get('/notifications/');
      const data = Array.isArray(res.data) ? res.data : [];
      setStudentNotifications(data);

      if (data.length > prevStudentCountRef.current && data.length > 0) {
        setHasNewStudentNotification(true);
        audioRef.current?.play();
      }
      prevStudentCountRef.current = data.length;
    } catch (err) {
      console.error('Ошибка загрузки уведомлений студента:', err);
    }
  };

  // Загрузка уведомлений администратора
  const fetchAdminNotifications = async () => {
    try {
      const res = await api.get('/notifications/admin/');
      const data = Array.isArray(res.data) ? res.data : [];
      setAdminNotifications(data);
    } catch (err) {
      console.error('Ошибка загрузки уведомлений администратора:', err);
    }
  };

  // Отметить уведомление студента как прочитанное
  const markStudentNotificationRead = async (id) => {
    try {
      await api.post('/notifications/', { notification_ids: [id] });
      setStudentNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Ошибка отметки уведомления (студент):', err);
    }
  };

  // Отметить уведомление администратора как прочитанное
  const markAdminNotificationRead = async (id) => {
    try {
      await api.post('/notifications/admin/', { notification_ids: [id] });
      setAdminNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Ошибка отметки уведомления (админ):', err);
    }
  };

  const toggleStudentNotifications = () => {
    setIsStudentNotifOpen(prev => !prev);
    if (!isStudentNotifOpen) setHasNewStudentNotification(false);
  };

  const toggleAdminNotifications = () => {
    setIsAdminNotifOpen(prev => !prev);
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleProfileDropdown = () => setProfileDropdownOpen(prev => !prev);

  const getInitials = () => {
    if (!userName) return '';
    const parts = userName.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
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
              {/* 
                Если заявка есть (hasApplication=true) — ведём на /edit-application, 
                иначе — на /create-application 
              */}
              {hasApplication 
                ? (
                  <div to="/edit-application" className="nav-btn-link" onClick={handleEditApplicationClick}>
                    Редактировать заявку
                  </div>
                ) : (
                  <Link to="/create-application" className="nav-btn-link">
                    Подать заявку
                  </Link>
                )
              }
            </li>
          )}
          {userRole === 'admin' && (
            <li>
              <Link to="/admin" className="nav-btn-link">Admin Panel</Link>
            </li>
          )}
        </ul>

        {/* Уведомления студента */}
        {isAuthenticated && userRole === 'student' && (
          <div className="notification-wrapper">
            <button
              className="notification-bell"
              onClick={toggleStudentNotifications}
              aria-label="Уведомления студента"
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
                  studentNotifications.map(n => (
                    <div key={n.id} className="notification-item">
                      <p>{n.message}</p>
                      <button
                        onClick={() => markStudentNotificationRead(n.id)}
                        className="notif-button"
                      >
                        Скрыть
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Уведомления администратора */}
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
                  adminNotifications.map(n => (
                    <div key={n.id} className="notification-item">
                      <p>{n.message}</p>
                      <button
                        onClick={() => markAdminNotificationRead(n.id)}
                        className="notif-button"
                      >
                        Скрыть
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Блок профиля (аватар + имя) */}
        {isAuthenticated ? (
          <div className="profile-menu-wrapper">
            <button
              className="profile-avatar"
              onClick={toggleProfileDropdown}
              aria-label="Меню пользователя"
              type="button"
            >
              {avatarUrl
                ? <img src={avatarUrl} alt="Аватар пользователя" className="avatar-image" />
                : <span className="avatar-initials">{getInitials() || 'ИФ'}</span>
              }
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
                    <Link to="/profile" onClick={() => setProfileDropdownOpen(false)}>
                      Профиль
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="logout-btn"
                    >
                      Выйти
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-login">Войти</Link>
        )}

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Открыть меню"
        >
          ☰
        </button>
      </div>



      {isEditWarningOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditWarningOpen(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Редактирование заявок отключено</h3>
            <p>
              В данный момент редактирование заявок недоступно. Свяжитесь с
              администрацией.
            </p>
            <button
              className="profile-modal-btn grey"
              onClick={() => setIsEditWarningOpen(false)}
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
