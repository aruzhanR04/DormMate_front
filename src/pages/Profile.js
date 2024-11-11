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

    // Fetch profile information
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

    // Fetch application status
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
                            {/* <div className="profile-field">
                                <span className="label">Аватар:</span>
                                <span className="value">
                                    {profile.avatar ? <img src={profile.avatar} alt="Аватар" className="avatar-image" /> : 'Нет изображения'}
                                </span>
                            </div> */}
                        </div>
                    )
                )}
            </div>

            <div className="status-section">
                <h2>Статус Заявки</h2>
                {statusError && <p className="error">{statusError}</p>}
                {status && <p className="status">{status}</p>}
                
                {status === 'Заявка одобрена, внесите оплату и прикрепите скрин.' && (
                    <div className="upload-section">
                        <h3>Загрузите скриншот оплаты</h3>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUpload} className="upload-button">Загрузить</button>
                        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
