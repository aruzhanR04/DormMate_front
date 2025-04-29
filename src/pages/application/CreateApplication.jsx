import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/Application.css';

const ApplicationPage = () => {
  // состояние формы
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    course: '',
    priceRange: '',
    documents: {}, 
    birthDate: '',   
    gender: '',       
    parentPhone: '', 
    entResult: '',
  });
  // список типов документов
  const [evidenceTypes, setEvidenceTypes] = useState([]);
  // список цен общежитий
  const [dormitories, setDormitories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // 1) загрузить данные студента
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get('studentdetail/');
        setFormData(fd => ({
          ...fd,
          firstName:  res.data.first_name  || '',
          lastName:   res.data.last_name   || '',
          course:     res.data.course      || '',
          birthDate:  res.data.birth_date  || '',   // новое поле
          gender: res.data.gender === 'M' || res.data.gender === 'male' ? 'Мужской' :
          res.data.gender === 'F' || res.data.gender === 'female' ? 'Женский' :
          '',
          parentPhone: res.data.parent_phone || '', // новое поле
        }));
      } catch (err) {
        console.error('Ошибка загрузки данных студента:', err);
      }
    };
    fetchStudent();
  }, []);

  // 2) загрузить виды документов
  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await api.get('evidence-types/');
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setEvidenceTypes(list);
      } catch (err) {
        console.error('Ошибка загрузки типов документов:', err);
      }
    };
    fetchEvidence();
  }, []);

  // 3) загрузить цены общежитий
  useEffect(() => {
    const fetchDormCosts = async () => {
      try {
        const res = await api.get('dorms/costs/');
        const list = Array.isArray(res.data) ? res.data : res.data.results || [];
        console.log('raw dorm costs:', list);
  
        const costs = list.map(item => String(item));
  
        console.log('parsed costs:', costs);
        setDormitories(costs);
      } catch (err) {
        console.error('Ошибка загрузки цен общежитий:', err);
      }
    };
   
    fetchDormCosts();
  }, []);
  

  // логируем изменения файлов
  useEffect(() => {
    console.log('formData.documents:', formData.documents);
  }, [formData.documents]);

  // выбор файла
  const handleChange = e => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData(fd => ({
        ...fd,
        documents: {
          ...fd.documents,
          [name]: files[0],
        }
      }));
    }
  };

  // удалить файл по коду
  const handleRemoveFile = code => {
    setFormData(fd => {
      const docs = { ...fd.documents };
      delete docs[code];
      return { ...fd, documents: docs };
    });
  };

  // отправка заявки
  const handleApplicationSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append('dormitory_cost', formData.priceRange);
      Object.entries(formData.documents).forEach(([code, file]) => {
        payload.append(code, file);
      });
      await api.post('create_application/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/testpage');
    } catch (err) {
      console.error('Ошибка при создании заявки:', err.response?.data || err);
    }
  };

  // модальное окно загрузки файлов
  const renderModal = () => (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setModalOpen(false)}>✖</button>
        <h3>Загрузка документов</h3>
        <div className="file-upload">
          {evidenceTypes.map(doc => {
            const file = formData.documents[doc.code];
            return (
              <div key={doc.code} className="file-upload-item">
                <label className="file-label">{doc.label || doc.name}</label>
                {file ? (
                  <div className="file-actions">
                    <span>{file.name}</span>
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

  // список выбранных файлов
  const renderSelectedFiles = () => {
    const docs = formData.documents;
    if (!docs || !Object.keys(docs).length) return null;
    return (
      <div className="selected-files">
        <h4>Выбранные документы:</h4>
        <ul>
          {Object.entries(docs).map(([code, file]) => (
            <li key={code}>
              {code}: {file.name}{' '}
              <button type="button" onClick={() => handleRemoveFile(code)}>
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
              <label>Дата рождения</label>
              <input type="text" value={formData.birthDate} readOnly />
            </div>
            <div className="input-group">
              <label>Пол</label>
              <input type="text" value={formData.gender} readOnly />
            </div>
            <div className="input-group">
              <label>Телефон родителей</label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="Введите номер родителей"
              />
            </div>
            <div className="input-group">
              <label>Результат ЕНТ</label>
              <input
                type="number"
                min="0"
                max="140"
                value={formData.entResult}
                onChange={e => setFormData({ ...formData, entResult: e.target.value })}
              />
              <small style={{ color: 'gray', fontSize: '0.85em' }}>
                Загрузите ЕНТ сертификат в разделе "Загрузить документы", без этого сертификата ваш результат учитываться не будет
              </small>
            </div>
            <div className="input-group">
              <label>Ценовой диапазон</label>
              <div className="price-range-select">
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                >
                  <option value="" disabled>Выберите стоимость</option>
                  {dormitories.map((cost, idx) => (
                    <option key={idx} value={cost}>
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
