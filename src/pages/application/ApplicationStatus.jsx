// src/components/ApplicationStatus.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import api from '../../api';
import '../../styles/styles.css';
import { useI18n } from '../../i18n/I18nContext';

const ApplicationStatus = () => {
  const { t } = useI18n();
  const txt = t('applicationStatus');

  const navigate = useNavigate();              
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    api.get('/application_status/')
      .then(res => {
        setStatus(res.data.status || '—');
      })
      .catch(err => {
        console.error('Error fetching application status:', err);
        setError(txt.errorNoApplication);
      });
  }, [txt.errorNoApplication]);

  const handleFileChange = e => {
    setPaymentScreenshot(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!paymentScreenshot) {
      setUploadMessage(txt.selectFileError);
      return;
    }
    const formData = new FormData();
    formData.append('payment_screenshot', paymentScreenshot);
    try {
      await api.post('/upload_payment_screenshot/', formData);
      setUploadMessage(txt.uploadSuccess);
    } catch (err) {
      console.error('Ошибка загрузки скриншота:', err);
      setUploadMessage(txt.uploadError);
    }
  };

  const handleEditApplicationClick = () => {
    navigate('/edit-application');
  };

  return (
    <div className='style'>
      <h2>{txt.title}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {status && <p>{status}</p>}

      {status === txt.statusApproved && (
        <div>
          <h3>{txt.uploadSectionTitle}</h3>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>{txt.uploadButton}</button>
          {uploadMessage && <p>{uploadMessage}</p>}
        </div>
      )}

      <div className="application-edit-section" style={{ marginTop: '10px' }}>
        <button
          onClick={handleEditApplicationClick}
          className="edit-password-button"
          style={{ background: '#c32939' }}
        >
          {txt.editApplication}
        </button>
      </div>
    </div>
  );
};

export default ApplicationStatus;
