import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Application.css';

const ApplicationPage = () => {
  // Состояния
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    course: '',
    priceRange: '',
    documents: {},
  });

  const dormitories = ['400000', '800000']; // Константа вместо состояния
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

  // Обработчик изменения файлов
  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        documents: { ...prevData.documents, [name]: files[0] },
      }));
    }
  };

  // Обработчик отправки заявки
  const handleApplicationSubmit = async () => {
    try {
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
      console.error('Ошибка при создании заявки:', error);
    }
  };

  // Рендер модального окна
  const renderModal = () => (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setModalOpen(false)}>✖</button>
        <h3>Загрузка документов</h3>
        <div className="file-upload">
          {[
            { name: 'orphan_certificate', label: 'Справка сироты' },
            { name: 'disability_1_2_certificate', label: 'Справка инвалидности 1-2 группы' },
            { name: 'disability_3_certificate', label: 'Справка инвалидности 3 группы' },
            { name: 'parents_disability_certificate', label: 'Справка инвалидности родителей' },
            { name: 'loss_of_breadwinner_certificate', label: 'Справка о потере кормильца' },
            { name: 'social_aid_certificate', label: 'Справка о получении социальной помощи' },
            { name: 'mangilik_el_certificate', label: 'Сертификат "Мәңгілік Ел"' },
            { name: 'olympiad_winner_certificate', label: 'Сертификат победителя олимпиады' },
          ].map((doc) => (
            <label key={doc.name} className="file-label">
              {doc.label}
              <input type="file" name={doc.name} onChange={handleChange} />
            </label>
          ))}
        </div>
        <button className="upload-btn">Загрузить</button>
      </div>
    </div>
  );

  return (
    <div className="application-page">
      <div className="application-container">
        {/* Карточка контактов */}
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
                  onChange={(e) => {
                    setFormData({ ...formData, priceRange: e.target.value });
                  }}
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

          {/* Кнопки */}
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

      {/* Модальное окно */}
      {isModalOpen && renderModal()}
    </div>
  );
};

export default ApplicationPage;