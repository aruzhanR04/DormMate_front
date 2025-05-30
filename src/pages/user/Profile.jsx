import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileError, setProfileError] = useState('');
    const [status, setStatus] = useState('');
    const [statusError, setStatusError] = useState('');
    const [noApplication, setNoApplication] = useState(false);
    const [allowEdit, setAllowEdit] = useState(false);
    const [loadingSettings, setLoadingSettings] = useState(true);


    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEditWarningOpen, setIsEditWarningOpen] = useState(false);


    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/studentdetail/');
                setProfile(response.data);
            } catch (err) {
                setProfileError('Не удалось загрузить данные профиля');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            try {
                const response = await api.get('/application_status/');
                setStatus(response.data.status || 'Нет данных');
            } catch (err) {
                if (err.response?.status === 404) {
                    setNoApplication(true);
                } else {
                    setStatusError('Ошибка при получении статуса заявки. Попробуйте снова.');
                }
            }
        };
        fetchApplicationStatus();
    }, []);

    useEffect(() => {
        const fetchGlobalSettings = async () => {
            try {
                const response = await api.get('/global-settings/');
                setAllowEdit(response.data.allow_application_edit);
            } catch (error) {}
            finally {
                setLoadingSettings(false);
            }
        };
        fetchGlobalSettings();
    }, []);

    function getInitials(profile) {
        if (!profile) return '??';
        const { first_name = '', last_name = '' } = profile;
        return `${(first_name[0] || '').toUpperCase()}${(last_name[0] || '').toUpperCase()}` || '??';
    }

    const handleFileChange = e => setPaymentScreenshot(e.target.files[0]);
    const handleUpload = async () => {
        if (!paymentScreenshot) {
            setUploadMessage('Пожалуйста, выберите файл для загрузки');
            return;
        }
        const formData = new FormData();
        formData.append('payment_screenshot', paymentScreenshot);
        try {
            await api.post('/upload_payment_screenshot/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadMessage('Скриншот успешно загружен.');
        } catch {
            setUploadMessage('Ошибка при загрузке файла. Попробуйте снова.');
        }
    };

    const handleChangePassword = async () => {
        setPasswordMessage('');
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordMessage('Пожалуйста, заполните все поля.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage('Пароли не совпадают.');
            return;
        }
        try {
            const response = await api.post('/change_password/', {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            setPasswordMessage(response.data.message || 'Пароль успешно изменён.');
            setTimeout(() => setIsPasswordModalOpen(false), 1200);
        } catch (err) {
            setPasswordMessage(
                err.response?.data?.error || 'Ошибка при изменении пароля. Попробуйте снова.'
            );
        }
    };

    const handleEditApplicationClick = () => {
        if (loadingSettings) return;
        if (allowEdit) {
            navigate('/edit-application');
        } else {
            setIsEditWarningOpen(true);
        }
    };

    return (
        <div className="profile-page-main">
            <h1 className="profile-title">Мой профиль</h1>
            <div className="profile-main-block">
                <div className="profile-avatar-circle">
                    <span>{getInitials(profile)}</span>
                </div>
                <div className="profile-main-info-block">
                    <div className="profile-main-fio">Имя Фамилия</div>
                    <div className="profile-main-id">S12345678</div>
                    <div className="profile-main-email">почта@mail.ru</div>
                    <button className="profile-change-password-btn" onClick={() => setIsPasswordModalOpen(true)}>
                        Сменить пароль
                    </button>
                </div>
            </div>
            <hr className="profile-hr" />

            <div className="profile-status-section">
                <div className="profile-status-title">Статус заявки</div>
                <div className="profile-status-row">
                    <span>Заявка - </span>
                    <span className="profile-status-review">На рассмотрении</span>
                </div>
                <div className="profile-status-desc">
                    Внесите оплату и прикрепите скриншот
                </div>
                <div className="profile-status-actions">
                    <label className="profile-upload-btn-label">
                        <input type="file" style={{ display: "none" }} onChange={handleFileChange} />
                        <span className="profile-upload-btn">Загрузить скриншот</span>
                    </label>
                    <button className="profile-edit-app-btn" onClick={handleEditApplicationClick}>
                        Редактировать заявку
                    </button>
                </div>
                {uploadMessage && <div className="profile-upload-message">{uploadMessage}</div>}
            </div>

            {/* Модалка смены пароля */}
            {isPasswordModalOpen && (
                <div className="profile-modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
                    <div className="profile-modal" onClick={e => e.stopPropagation()}>
                        <h3>Сменить пароль</h3>
                        <input
                            type="password"
                            placeholder="Старый пароль"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            className="profile-modal-input"
                        />
                        <input
                            type="password"
                            placeholder="Новый пароль"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="profile-modal-input"
                        />
                        <input
                            type="password"
                            placeholder="Подтвердите новый пароль"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="profile-modal-input"
                        />
                        {passwordMessage && <p className="profile-modal-message">{passwordMessage}</p>}
                        <div className="profile-modal-actions">
                            <button className="profile-modal-btn grey" onClick={() => setIsPasswordModalOpen(false)}>
                                Отмена
                            </button>
                            <button className="profile-modal-btn red" onClick={handleChangePassword}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка предупреждения об отключении редактирования */}
            {isEditWarningOpen && (
                <div className="profile-modal-overlay" onClick={() => setIsEditWarningOpen(false)}>
                    <div className="profile-modal" onClick={e => e.stopPropagation()}>
                        <h3>Редактирование заявок отключено</h3>
                        <p>В данный момент редактирование заявок недоступно. Свяжитесь с администрацией.</p>
                        <button className="profile-modal-btn grey" onClick={() => setIsEditWarningOpen(false)}>
                            Понятно
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
