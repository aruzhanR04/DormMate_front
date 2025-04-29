import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/UserDashboard.css';

const UserDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState(null);

    const [status, setStatus] = useState('');
    const [statusError, setStatusError] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditWarningOpen, setIsEditWarningOpen] = useState(false);
    const [allowEdit, setAllowEdit] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUploadMessage, setAvatarUploadMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('studentdetail/');
                setProfile(response.data);
                setLoadingProfile(false);
            } catch (err) {
                setProfileError('Не удалось загрузить данные профиля');
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            try {
                const response = await api.get('/application_status/');
                setStatus(response.data.status || 'Неизвестный статус');
            } catch (err) {
                setStatusError('Ошибка при получении статуса заявки. Пожалуйста, попробуйте снова.');
            }
        };
        fetchApplicationStatus();
    }, []);

    useEffect(() => {
        const fetchGlobalSettings = async () => {
            try {
                const response = await api.get('/global-settings/');
                setAllowEdit(response.data.allow_application_edit);
            } catch (error) {
                console.error('Ошибка при получении настроек:', error);
            } finally {
                setLoadingSettings(false);
            }
        };
        fetchGlobalSettings();
    }, []);

    const handleFileChange = (e) => {
        setPaymentScreenshot(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!paymentScreenshot) {
            setUploadMessage('Пожалуйста, выберите файл для загрузки');
            return;
        }

        const formData = new FormData();
        formData.append('payment_screenshot', paymentScreenshot);

        try {
            await api.post('/upload_payment_screenshot/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadMessage('Скриншот успешно загружен.');
        } catch (err) {
            setUploadMessage('Ошибка при загрузке файла. Пожалуйста, попробуйте снова.');
        }
    };

    const handleChangePassword = async () => {
        setPasswordMessage('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordMessage('Пожалуйста, заполните все поля.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage('Новый пароль и подтверждение пароля не совпадают.');
            return;
        }

        try {
            const response = await api.post('/change_password/', {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            setPasswordMessage(response.data.message || 'Пароль успешно изменен.');
            setIsModalOpen(false);
        } catch (err) {
            console.error("Full error response:", err.response);
            setPasswordMessage(
                err.response?.data?.error || 'Ошибка при изменении пароля. Пожалуйста, попробуйте снова.'
            );
        }
    };

    const handleEditApplicationClick = () => {
        if (loadingSettings) return;

        if (allowEdit) {
            navigate('/edit-application');
        } else {
            window.alert('Редактирование заявок отключено. Пожалуйста, свяжитесь с администрацией.');
        }
    };

    // --- Работа с аватаром ---
    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) {
            setAvatarUploadMessage('Пожалуйста, выберите изображение.');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const response = await api.post('/upload-avatar/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAvatarUploadMessage('Аватар успешно обновлен.');
            setProfile(prev => ({ ...prev, avatar: response.data.avatar }));
        } catch (err) {
            console.error(err);
            setAvatarUploadMessage('Ошибка при загрузке аватара.');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="profile-section">
                <h2>Профиль</h2>
                {loadingProfile ? (
                    <div>Загрузка...</div>
                ) : profileError ? (
                    <div className="error">{profileError}</div>
                ) : (
                    profile && (
                        <div className="profile-info">

                            {/* Блок аватара */}
                            <div className="profile-avatar-block">
                                {profile.avatar ? (
                                    <img 
                                        src={profile.avatar} 
                                        alt="Аватар" 
                                        className="profile-avatar"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }}
                                    />
                                ) : (
                                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#ddd', marginBottom: '10px' }}>
                                        Нет аватара
                                    </div>
                                )}
                                <input type="file" onChange={handleAvatarChange} accept="image/*" />
                                <button onClick={handleAvatarUpload} className="upload-button">Обновить аватар</button>
                                {avatarUploadMessage && <p className="upload-message">{avatarUploadMessage}</p>}
                            </div>

                            <div className="profile-field">
                                <span className="label">Имя:</span>
                                <span className="value">{profile.first_name}</span>
                            </div>
                            <div className="profile-field">
                                <span className="label">Фамилия:</span>
                                <span className="value">{profile.last_name}</span>
                            </div>
                            <div className="profile-field">
                                <span className="label">Email:</span>
                                <span className="value">{profile.email}</span>
                            </div>
                            <div className="profile-field">
                                <span className="label">ID студента:</span>
                                <span className="value">{profile.s}</span>
                            </div>
                            <div className="profile-field">
                                <span className="label">Телефон:</span>
                                <span className="value">{profile.phone}</span>
                            </div>

                            <button onClick={() => setIsModalOpen(true)} className="edit-password-button">
                                Изменить Пароль
                            </button>
                            <button
                                onClick={handleEditApplicationClick}
                                className="edit-password-button"
                                style={{ background: '#c32939', marginTop: '10px' }}
                            >
                                Редактировать заявку
                            </button>
                        </div>
                    )
                )}
            </div>

            <div className="status-section">
                <h2>Статус Заявки</h2>
                {statusError && <p className="error">{statusError}</p>}
                {status && <p className="status">{status}</p>}

                {status === 'Ваша заявка одобрена, внесите оплату и прикрепите сюда чек.' && (
                    <div className="upload-section">
                        <h3>Загрузите скриншот оплаты</h3>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUpload} className="upload-button">Загрузить</button>
                        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
                    </div>
                )}
            </div>

            {/* Модалка изменения пароля */}
            {isModalOpen && <div className="overlay" onClick={() => setIsModalOpen(false)}></div>}
            {isModalOpen && (
                <div className="password-modal">
                    <button onClick={() => setIsModalOpen(false)} className="close-modal">&times;</button>

                    <input
                        type="password"
                        placeholder="Старый пароль"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="password-input"
                    />
                    <input
                        type="password"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-input"
                    />
                    <input
                        type="password"
                        placeholder="Подтвердите новый пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="password-input"
                    />
                    <button onClick={handleChangePassword} className="change-password-button">
                        Изменить Пароль
                    </button>

                    {passwordMessage && <p className="password-message">{passwordMessage}</p>}
                </div>
            )}

            {/* Модалка запрета на редактирование */}
            {isEditWarningOpen && (
                <>
                    <div className="overlay" onClick={() => setIsEditWarningOpen(false)}></div>
                    <div className="warning-modal">
                        <h3>Редактирование заявок отключено</h3>
                        <p>В данный момент редактирование заявок недоступно. Пожалуйста, свяжитесь с администрацией.</p>
                        <button onClick={() => setIsEditWarningOpen(false)} className="close-modal-button">
                            Понятно
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserDashboard;
