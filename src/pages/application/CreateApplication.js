import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/Application.css';

const ApplicationPage = () => {
  // Начальное состояние формы
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    course: '',
    priceRange: '',
    documents: {}, // ключ – код документа, значение – объект File
  });
  const [evidenceTypes, setEvidenceTypes] = useState([]); // Список EvidenceType с сервера
  const dormitories = ['400000', '800000'];
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Загрузка данных студента
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await api.get('studentdetail/');
        setFormData((prevData) => ({
          ...prevData,
          firstName: response.data.first_name || '',
          lastName: response.data.last_name || '',
          course: response.data.course || '',
        }));
      } catch (error) {
        console.error('Ошибка загрузки данных студента:', error);
      }
    };

    fetchStudentData();
  }, []);

  // Загрузка списка EvidenceType от сервера
  useEffect(() => {
    const fetchEvidenceTypes = async () => {
      try {
        const response = await api.get('evidence-types/');
        console.log('Ответ evidence-types:', response.data);
        const types = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setEvidenceTypes(types);
      } catch (error) {
        console.error('Ошибка загрузки типов документов:', error);
      }
    };

    fetchEvidenceTypes();
  }, []);

  // Лог изменений выбранных документов (для отладки)
  useEffect(() => {
    console.log('Файлы в состоянии formData.documents:', formData.documents);
  }, [formData.documents]);

  // Обработчик выбора файла
  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length) {
      setFormData((prevData) => {
        const updatedDocuments = { ...prevData.documents, [name]: files[0] };
        console.log(`Выбран файл для ${name}:`, files[0]);
        return { ...prevData, documents: updatedDocuments };
      });
    }
  };

  // Обработчик удаления файла для заданного evidenceType (по коду)
  const handleRemoveFile = (code) => {
    setFormData((prevData) => {
      const updatedDocuments = { ...prevData.documents };
      delete updatedDocuments[code];
      return { ...prevData, documents: updatedDocuments };
    });
  };

  // Обработчик отправки заявки
  const handleApplicationSubmit = async () => {
    try {
      console.log('Отправка заявки. Текущие документы:', formData.documents);
      const formDataToSend = new FormData();
      formDataToSend.append('dormitory_cost', formData.priceRange);

      Object.keys(formData.documents).forEach((key) => {
        if (formData.documents[key]) {
          formDataToSend.append(key, formData.documents[key]);
        }
      });

      await api.post('http://127.0.0.1:8000/api/v1/create_application/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/testpage');
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Ошибка при создании заявки:', error.response.data);
      } else {
        console.error('Ошибка при создании заявки:', error);
      }
    }
  };

  // Рендер модального окна с динамическим списком EvidenceType
  const renderModal = () => (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setModalOpen(false)}>
          ✖
        </button>
        <h3>Загрузка документов</h3>
        <div className="file-upload">
          {evidenceTypes.map((doc) => {
            const selectedFile = formData.documents[doc.code];
            return (
              <div key={doc.code} className="file-upload-item">
                <label className="file-label">{doc.label || doc.name}</label>
                {selectedFile ? (
                  <div className="file-actions">
                    <span>{selectedFile.name}</span>
                    <button type="button" onClick={() => handleRemoveFile(doc.code)}>
                      Удалить
                    </button>
                    <input type="file" name={doc.code} onChange={handleChange} />
                  </div>
                ) : (
                  <input type="file" name={doc.code} onChange={handleChange} />
                )}
              </div>
            );
          })}
        </div>
        <button className="upload-btn" onClick={() => setModalOpen(false)}>
          Закрыть
        </button>
      </div>
    </div>
  );

  // Отображение выбранных файлов для наглядности в основной форме
  const renderSelectedFiles = () => {
    const docs = formData.documents;
    if (!docs || Object.keys(docs).length === 0) return null;
    return (
      <div className="selected-files">
        <h4>Выбранные документы:</h4>
        <ul>
          {Object.keys(docs).map((key) => (
            <li key={key}>
              {key}: {docs[key].name}{' '}
              <button type="button" onClick={() => handleRemoveFile(key)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="application-page">
      <div className="application-container">
        {/* Контактная информация */}
        <div className="contact-card">
          <h3>Контакты для информации</h3>
          <p>При случае Lorem ipsum odor amet, consectetuer adipiscing elit.</p>
          <div className="contact-info">
            <p>📞 +777 777 77 77</p>
            <p>📞 +777 777 88 88</p>
            <p>📧 Support@narxoz.kz</p>
          </div>
        </div>

        {/* Форма заявки */}
        <div className="form-section">
          <div className="form-grid">
            <div className="input-group">
              <label>Имя</label>
              <input type="text" value={formData.firstName} readOnly />
            </div>
            <div className="input-group">
              <label>Фамилия</label>
              <input type="text" value={formData.lastName} readOnly />
            </div>
            <div className="input-group">
              <label>Курс</label>
              <input type="text" value={formData.course} readOnly />
            </div>
            <div className="input-group">
              <label>Ценовой диапазон</label>
              <div className="price-range-select">
                <select
                  name="priceRange"
                  value={formData.priceRange || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, priceRange: e.target.value })
                  }
                >
                  {dormitories.map((cost, index) => (
                    <option key={index} value={cost}>
                      {cost} тг
                    </option>
                  ))}
                </select>
              </div>
              {formData.priceRange && (
                <p className="selected-price">
                  Стоимость: <strong>{formData.priceRange} тг</strong>
                </p>
              )}
            </div>
          </div>

          {renderSelectedFiles()}

          <div className="button-group">
            <button className="upload-btn" onClick={() => setModalOpen(true)}>
              Загрузить документы
            </button>
            <button className="upload-btn" onClick={handleApplicationSubmit}>
              Отправить заявку
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && renderModal()}
    </div>
  );
};

export default ApplicationPage;
