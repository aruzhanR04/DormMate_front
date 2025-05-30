import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/Application.css';

const ApplicationPage = () => {
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
  const [evidenceTypes, setEvidenceTypes] = useState([]);
  const [dormitories, setDormitories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get('studentdetail/');
        setFormData(fd => ({
          ...fd,
          firstName: res.data.first_name || '',
          lastName: res.data.last_name || '',
          course: res.data.course || '',
          birthDate: res.data.birth_date || '',
          gender: res.data.gender === 'M' || res.data.gender === 'male' ? 'Мужской' :
            res.data.gender === 'F' || res.data.gender === 'female' ? 'Женский' : '',
          parentPhone: res.data.parent_phone || '',
        }));
      } catch (err) {
        console.error('Ошибка загрузки данных студента:', err);
      }
    };
    fetchStudent();
  }, []);

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

  useEffect(() => {
    const fetchDormCosts = async () => {
      try {
        const res = await api.get('dorms/costs/');
        const list = Array.isArray(res.data) ? res.data : res.data.results || [];
        const costs = list.map(item => String(item));
        setDormitories(costs);
      } catch (err) {
        console.error('Ошибка загрузки цен общежитий:', err);
      }
    };
    fetchDormCosts();
  }, []);

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

  const handleRemoveFile = code => {
    setFormData(fd => {
      const docs = { ...fd.documents };
      delete docs[code];
      return { ...fd, documents: docs };
    });
  };

  const handleApplicationSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append('dormitory_cost', formData.priceRange);
      payload.append('ent_result', formData.entResult);
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

  return (
    <div className="application-page">
      <div className="application-box">
        <h1 className="app-title">Заявка на заселение</h1>
        <p className="app-desc">
          Заполните форму а так же предоставьте необходимые документы для подачи заявки на проживание в общежитии
        </p>
        <form
          className="app-form"
          onSubmit={e => { e.preventDefault(); handleApplicationSubmit(); }}
          autoComplete="off"
        >
          <div className="app-form-grid">
            <div className="input-block">
              <label htmlFor="firstName">Имя</label>
              <input type="text" value={formData.firstName} readOnly id="firstName" />
            </div>
            <div className="input-block">
              <label htmlFor="lastName">Фамилия</label>
              <input type="text" value={formData.lastName} readOnly id="lastName" />
            </div>
            <div className="input-block">
              <label htmlFor="course">Курс</label>
              <input type="text" value={formData.course} readOnly id="course" />
            </div>
            <div className="input-block">
              <label htmlFor="birthDate">Дата рождения</label>
              <input type="text" value={formData.birthDate} readOnly id="birthDate" />
            </div>
            <div className="input-block">
              <label htmlFor="gender">Пол</label>
              <input type="text" value={formData.gender} readOnly id="gender" />
            </div>
            <div className="input-block">
              <label htmlFor="parentPhone">Телефон родителей</label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="Введите номер родителей"
                id="parentPhone"
              />
            </div>
            <div className="input-block">
              <label htmlFor="priceRange">Ценовой диапазон</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                required
                id="priceRange"
              >
                <option value="" disabled>Выберите стоимость</option>
                {dormitories.map((cost, idx) => (
                  <option key={idx} value={cost}>{cost} тг</option>
                ))}
              </select>
            </div>
            <div className="input-block">
              <label htmlFor="entResult">Балл ЕНТ</label>
              <input
                type="number"
                min="0"
                max="140"
                value={formData.entResult}
                onChange={e => setFormData({ ...formData, entResult: e.target.value })}
                placeholder="Балл ЕНТ"
                id="entResult"
                inputMode="numeric"
              />
            </div>
          </div>
          <button
            type="button"
            className="upload-btn"
            onClick={() => setModalOpen(true)}
            style={{ marginTop: 28 }}
          >
            Загрузить документы
          </button>
          <button type="submit" className="submit-btn">Подать заявку</button>
        </form>
      </div>

      {isModalOpen && (
        <div className="modal application-modal">
          <div className="modal-content application-modal-content">
            <button className="close-btn" onClick={() => setModalOpen(false)}>✖</button>
            <h3 className="modal-title">Загрузка документов</h3>
            <div className="modal-subtext">
              Загрузка всех документов не является обязательным требованием.<br />
              Пожалуйста, предоставьте только те файлы, которые у вас есть и которые относятся к вам.<br />
              Вы сможете дополнить недостающие документы позже.
            </div>
            <div className="docs-grid">
              {evidenceTypes
                .filter(doc => doc.data_type === 'file')
                .map(doc => {
                  const file = formData.documents[doc.code];
                  return (
                    <div key={doc.code} className="doc-upload-cell">
                      <label className="file-label">{doc.label || doc.name}</label>
                      <input
                        type="file"
                        name={doc.code}
                        onChange={handleChange}
                      />
                      {file && (
                        <div className="file-name">
                          <span>{file.name}</span>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile(doc.code)}
                          >✖</button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            <div className="modal-btns">
              <button className="modal-cancel-btn" onClick={() => setModalOpen(false)}>Отмена</button>
              <button className="modal-add-btn" onClick={() => setModalOpen(false)}>Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationPage;
