import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/Application.css';

const EditApplication = () => {
  const [formData, setFormData] = useState({
    priceRange: '',
    documents: {},
  });
  const [evidenceTypes, setEvidenceTypes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get('/application_status/');
        setFormData(prev => ({ ...prev, priceRange: response.data.dormitory_cost || '' }));
      } catch (error) {
        console.error('Ошибка при получении заявки:', error);
      }
    };

    const fetchEvidenceTypes = async () => {
      try {
        const response = await api.get('/evidence-types/');
        const types = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setEvidenceTypes(types);
      } catch (error) {
        console.error('Ошибка загрузки типов документов:', error);
      }
    };

    fetchApplication();
    fetchEvidenceTypes();
  }, []);

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length) {
      setFormData((prev) => ({
        ...prev,
        documents: { ...prev.documents, [name]: files[0] },
      }));
    }
  };

  const handleRemoveFile = (code) => {
    setFormData(prev => {
      const updatedDocs = { ...prev.documents };
      delete updatedDocs[code];
      return { ...prev, documents: updatedDocs };
    });
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('dormitory_cost', formData.priceRange);

      Object.keys(formData.documents).forEach((key) => {
        if (formData.documents[key]) {
          formDataToSend.append(key, formData.documents[key]);
        }
      });

      await api.put('/update_application/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/testpage');
    } catch (error) {
      console.error('Ошибка при обновлении заявки:', error);
    }
  };

  const renderModal = () => (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setModalOpen(false)}>✖</button>
        <h3>Редактирование документов</h3>
        {evidenceTypes.map((doc) => (
          <div key={doc.code} className="file-upload-item">
            <label className="file-label">{doc.label || doc.name}</label>
            {formData.documents[doc.code] ? (
              <div className="file-actions">
                <span>{formData.documents[doc.code].name}</span>
                <button type="button" onClick={() => handleRemoveFile(doc.code)}>Удалить</button>
                <input type="file" name={doc.code} onChange={handleChange} />
              </div>
            ) : (
              <input type="file" name={doc.code} onChange={handleChange} />
            )}
          </div>
        ))}
        <button className="upload-btn" onClick={() => setModalOpen(false)}>Закрыть</button>
      </div>
    </div>
  );

  return (
    <div className="application-page">
      <div className="application-container">
        <h2>Редактировать Заявку</h2>

        <div className="input-group">
          <label>Ценовой диапазон</label>
          <select
            name="priceRange"
            value={formData.priceRange}
            onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
          >
            <option value="">Выберите стоимость</option>
            <option value="400000">400 000 тг</option>
            <option value="800000">800 000 тг</option>
          </select>
        </div>

        {Object.keys(formData.documents).length > 0 && (
          <div className="selected-files">
            <h4>Выбранные документы:</h4>
            <ul>
              {Object.entries(formData.documents).map(([code, file]) => (
                <li key={code}>{code}: {file.name} <button onClick={() => handleRemoveFile(code)}>Удалить</button></li>
              ))}
            </ul>
          </div>
        )}

        <div className="button-group">
          <button className="upload-btn" onClick={() => setModalOpen(true)}>Изменить документы</button>
          <button className="upload-btn" onClick={handleUpdate}>Сохранить изменения</button>
        </div>
      </div>

      {isModalOpen && renderModal()}
    </div>
  );
};

export default EditApplication;