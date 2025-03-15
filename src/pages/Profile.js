import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/UserDashboard.css';

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('studentdetail/');
                setProfile(response.data);
                setLoadingProfile(false);
            } catch (err) {
                setProfileError('Failed to load profile data');
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

    return (
        <div className="dashboard-container">
            {}
            <div className="profile-section">
                <h2>Профиль</h2>
                {loadingProfile ? (
                    <div>Загрузка...</div>
                ) : profileError ? (
                    <div className="error">{profileError}</div>
                ) : (
                    profile && (
                        <div className="profile-info">
                            {}
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
    
                            {}
                            <div className="profile-field">
                                <span className="label">ID студента:</span>
                                <span className="value">{profile.s}</span>
                            </div>
                            <div className="profile-field">
                                <span className="label">Телефон:</span>
                                <span className="value">{profile.phone}</span>
                            </div>
    
                            {}
                            <button onClick={() => setIsModalOpen(true)} className="edit-password-button">
                                Изменить Пароль
                            </button>
                        </div>
                    )
                )}
            </div>
    
            {}
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
    
            {}
            {isModalOpen && <div className="overlay" onClick={() => setIsModalOpen(false)}></div>}
    
            {}
            {isModalOpen && (
                <div className="password-modal">
                    {}
                    <button onClick={() => setIsModalOpen(false)} className="close-modal">
                        &times;
                    </button>
    
                    {}
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
    
                    {}
                    <button onClick={handleChangePassword} className="change-password-button">
                        Изменить Пароль
                    </button>
    
                    {}
                    {passwordMessage && <p className="password-message">{passwordMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;