import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import api from '../../api';
import '../../styles/styles.css';

const ApplicationStatus = () => {
    const navigate = useNavigate();              

    const handleEditApplicationClick = () => {
        navigate('/edit-application');
    };

    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            try {
                const response = await api.get('/application_status/');
                setStatus(response.data.status || 'Неизвестный статус');
            } catch (err) {
                console.error('Error fetching application status:', err);
                setError('Вы не подавали заявку на студенческий дом');
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
            await api.post('/upload_payment_screenshot/', formData);
            setUploadMessage('Скриншот успешно загружен.');
        } catch (err) {
            console.error('Ошибка загрузки скриншота:', err);
            setUploadMessage('Ошибка при загрузке файла. Пожалуйста, попробуйте снова.');
        }
    };

    return (
        <div className='style'>
            <h2>Статус Заявки</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {status && <p>{status}</p>}
            
            {status === 'Заявка одобрена, внесите оплату и прикрепите скрин.' && (
                <div>
                    <h3>Загрузите скриншот оплаты</h3>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Загрузить</button>
                    {uploadMessage && <p>{uploadMessage}</p>}
                </div>
            )}

            <div className="application-edit-section" style={{ marginTop: '10px' }}>
                <button
                    onClick={handleEditApplicationClick}  // <-- теперь определена
                    className="edit-password-button"
                    style={{ background: '#c32939' }}
                >
                    Редактировать заявку
                </button>
            </div>
        </div>
    );
};

export default ApplicationStatus;
