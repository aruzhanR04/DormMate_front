// src/components/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/icons/logo.png';
import bellIcon from '../../assets/icons/bell.png';
import notificationSound from '../../assets/audio/notification.mp3';
import api from '../../api';
import { LanguageSwitcher } from '../../pages/elements/LanguageSwitcher';
import { useI18n } from '../../i18n/I18nContext';

const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
  const { t } = useI18n();
  const txt = t('navbar');

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [studentNotifications, setStudentNotifications] = useState([]);
  const [isStudentNotifOpen, setIsStudentNotifOpen] = useState(false);
  const [hasNewStudentNotification, setHasNewStudentNotification] = useState(false);

  const [adminNotifications, setAdminNotifications] = useState([]);
  const [isAdminNotifOpen, setIsAdminNotifOpen] = useState(false);
  const [hasNewAdminNotification, setHasNewAdminNotification] = useState(false);

  const [hasApplication, setHasApplication] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [allowEdit, setAllowEdit] = useState(false);
  const [isEditWarningOpen, setIsEditWarningOpen] = useState(false);

  const audioRef = useRef(null);
  const prevStudentCountRef = useRef(0);
  const prevAdminCountRef = useRef(0);

  const navigate = useNavigate();

  // 1) Load profile
  useEffect(() => {
    if (!isAuthenticated) return;
    const endpoint = userRole === 'student' ? '/studentdetail/' : '/admins/me/';
    api.get(endpoint)
      .then(res => {
        const data = res.data;
        setUserName(`${data.first_name} ${data.last_name}`);
        setAvatarUrl(data.avatar || '');
      })
      .catch(() => {
        setUserName('');
        setAvatarUrl('');
      });
  }, [isAuthenticated, userRole]);

  // 2) Init notification sound
  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      const a = new Audio(notificationSound);
      a.volume = 0.8;
      audioRef.current = a;
    }
  }, [isAuthenticated, userRole]);

  // 3) Global settings for edit permission
  useEffect(() => {
    api.get('/global-settings/')
      .then(res => setAllowEdit(!!res.data.allow_application_edit))
      .catch(() => {})
      .finally(() => setLoadingSettings(false));
  }, []);

  // 4) Fetch student notifications periodically
  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      fetchStudentNotifications();
      const iv = setInterval(fetchStudentNotifications, 10000);
      return () => clearInterval(iv);
    }
  }, [isAuthenticated, userRole]);

  // 5) Fetch admin notifications periodically
  useEffect(() => {
    if (isAuthenticated && userRole === 'admin') {
      fetchAdminNotifications();
      const iv = setInterval(fetchAdminNotifications, 10000);
      return () => clearInterval(iv);
    }
  }, [isAuthenticated, userRole]);

  // 6) Check if student has application
  useEffect(() => {
    if (isAuthenticated && userRole === 'student') {
      api.get('/application_status/')
        .then(() => setHasApplication(true))
        .catch(err => {
          if (err.response?.status === 404) {
            setHasApplication(false);
          }
        });
    }
  }, [isAuthenticated, userRole]);

  const handleEditApplicationClick = () => {
    if (loadingSettings) return;
    if (allowEdit) navigate('/edit-application');
    else setIsEditWarningOpen(true);
  };

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
    } catch {}
  };

  const fetchAdminNotifications = async () => {
    try {
      const res = await api.get('/notifications/admin/');
      const data = Array.isArray(res.data) ? res.data : [];
      setAdminNotifications(data);
      if (data.length > prevAdminCountRef.current && data.length > 0) {
        setHasNewAdminNotification(true);
      }
      prevAdminCountRef.current = data.length;
    } catch {}
  };

  const markStudentNotificationRead = async (id) => {
    try {
      await api.post('/notifications/', { notification_ids: [id] });
      setStudentNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const markAdminNotificationRead = async (id) => {
    try {
      await api.post('/notifications/admin/', { notification_ids: [id] });
      setAdminNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const toggleStudentNotifications = () => {
    setIsStudentNotifOpen(o => !o);
    if (!isStudentNotifOpen) setHasNewStudentNotification(false);
  };

  const toggleAdminNotifications = () => {
    setIsAdminNotifOpen(o => !o);
    if (!isAdminNotifOpen) setHasNewAdminNotification(false);
  };

  const getInitials = () => {
    if (!userName) return '';
    const [first, last] = userName.split(' ');
    return (first?.[0] + last?.[0] || '').toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-right">
        <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
        <li><LanguageSwitcher /></li>
          <li><Link to="/" className="nav-btn-link">{txt.home}</Link></li>
          

          {isAuthenticated && userRole === 'student' && (
            <li>
              {hasApplication
                ? <div onClick={handleEditApplicationClick} className="nav-btn-link">
                    {txt.editApplication}
                  </div>
                : <Link to="/create-application" className="nav-btn-link">
                    {txt.apply}
                  </Link>}
            </li>
          )}

          {userRole === 'admin' && (
            <li><Link to="/admin" className="nav-btn-link">{txt.adminPanel}</Link></li>
          )}
        </ul>

        {isAuthenticated && userRole === 'student' && (
          <div className="notification-wrapper">
            <button
              className="notification-bell"
              onClick={toggleStudentNotifications}
            >
              <img src={bellIcon} alt="bell" />
              {hasNewStudentNotification && <span className="notification-dot" />}
            </button>
            {isStudentNotifOpen && (
              <div className="notifications-popup">
                <h4>{txt.notifications.studentTitle}</h4>
                {studentNotifications.length === 0
                  ? <p className="no-notifications">{txt.notifications.noNotifications}</p>
                  : studentNotifications.map(n => (
                      <div key={n.id} className="notification-item">
                        <p>{n.message}</p>
                        <button onClick={() => markStudentNotificationRead(n.id)} className="notif-button">
                          ×
                        </button>
                      </div>
                    ))
                }
              </div>
            )}
          </div>
        )}

        {isAuthenticated && userRole === 'admin' && (
          <div className="notification-wrapper">
            <button
              className="notification-bell"
              onClick={toggleAdminNotifications}
            >
              <img src={bellIcon} alt="bell" />
              {hasNewAdminNotification && <span className="notification-dot" />}
            </button>
            {isAdminNotifOpen && (
              <div className="notifications-popup">
                <h4>{txt.notifications.adminTitle}</h4>
                {adminNotifications.length === 0
                  ? <p className="no-notifications">{txt.notifications.noNotifications}</p>
                  : adminNotifications.map(n => (
                      <div key={n.id} className="notification-item">
                        <p>{n.message}</p>
                        <button onClick={() => markAdminNotificationRead(n.id)} className="notif-button">
                          ×
                        </button>
                      </div>
                    ))
                }
              </div>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <div className="profile-menu-wrapper">
            <button className="profile-avatar" onClick={() => setProfileDropdownOpen(o => !o)}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" className="avatar-image" />
                : <span className="avatar-initials">{getInitials()}</span>}
            </button>
            <button className="profile-name-btn" onClick={() => setProfileDropdownOpen(o => !o)}>
              {userName || txt.profile.profile}
            </button>
            {profileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-name">{userName}</div>
                <ul>
                  {userRole === 'student' && (
                    <li><Link to="/profile" onClick={() => setProfileDropdownOpen(false)}>
                      {txt.profile.profile}
                    </Link></li>
                  )}
                  <li>
                    <button className="logout-btn" onClick={onLogout}>
                      {txt.profile.logout}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-login">{txt.auth.login}</Link>
        )}

        <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)}>☰</button>
      </div>

      {isEditWarningOpen && (
        <div className="modal-overlay" onClick={() => setIsEditWarningOpen(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <h3>{txt.warning.title}</h3>
            <p>{txt.warning.message}</p>
            <button className="profile-modal-btn grey" onClick={() => setIsEditWarningOpen(false)}>
              {txt.warning.ok}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
