import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/Application.css';

const EditApplication = () => {
  const [formData, setFormData] = useState({
    firstName:   '',
    lastName:    '',
    course:      '',
    gender:      '',
    birthDate:   '',
    parentPhone: '',
    entResult:   '',
    priceRange:  '',
    documents:   {},  // новые File или { name, url, existing: true }
  });
  const [removedDocs, setRemovedDocs] = useState([]);        // коды удалённых старых файлов
  const [evidenceTypes, setEvidenceTypes] = useState([]);
  const [costOptions,    setCostOptions]    = useState([]);
  const [isModalOpen,    setModalOpen]      = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) получить заявку и студента
        const [applicationRes, studentRes] = await Promise.all([
          api.get('/application/'),
          api.get('/studentdetail/'),
        ]);
        const app = applicationRes.data;

        // 2) основные поля
        setFormData(prev => ({
          ...prev,
          firstName:   studentRes.data.first_name    || '',
          lastName:    studentRes.data.last_name     || '',
          course:      studentRes.data.course        || '',
          gender:      studentRes.data.gender        || '',
          birthDate:   studentRes.data.birth_date    || '',
          parentPhone: studentRes.data.parent_phone  || '',
          entResult:   app.ent_result                || '',
          priceRange:  app.dormitory_cost            || '',
        }));

        // 3) предзагрузка старых справок
        const evidenceRes = await api.get('/application/evidences/');
        const existingDocs = {};
        evidenceRes.data.forEach(ev => {
          if (!ev.file) return;
          const code = ev.code;
          const url  = ev.file;
          const name = ev.name || url.split('/').pop();
          existingDocs[code] = { name, url, existing: true };
        });
        setFormData(prev => ({
          ...prev,
          documents: {
            ...existingDocs,
            ...prev.documents
          }
        }));
      } catch (error) {
        console.error('Ошибка при получении данных заявки или студента:', error);
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

    const fetchCosts = async () => {
      try {
        const response = await api.get('/dorms/costs/');
        setCostOptions(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Ошибка при загрузке цен:', error);
      }
    };

    fetchCosts();
    fetchData();
    fetchEvidenceTypes();
  }, []);

  const handleChange = e => {
    const field = e.target.name;
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file
        }
      }));
    } else {
      const value = e.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleRemoveFile = code => {
    setFormData(prev => {
      const docs = { ...prev.documents };
      const fo = docs[code];
      delete docs[code];
      // если удаляем старую справку — запоминаем её код
      if (fo && fo.existing) {
        setRemovedDocs(rd => [...rd, code]);
      }
      return { ...prev, documents: docs };
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = new FormData();
      payload.append('dormitory_cost', formData.priceRange);
      payload.append('ent_result',     formData.entResult);

      // новые файлы
      Object.entries(formData.documents).forEach(([code, fo]) => {
        if (fo instanceof File) {
          payload.append(code, fo);
        }
      });

      // список удалённых старых справок
      if (removedDocs.length) {
        payload.append('deleted_documents', JSON.stringify(removedDocs));
      }

      await api.patch('/student/application/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при обновлении заявки:', error);
    }
  };

  const renderModal = () => (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setModalOpen(false)}>✖</button>
        <h3>Редактирование документов</h3>
        {evidenceTypes.map(doc => {
          const fo = formData.documents[doc.code];
          return (
            <div key={doc.code} className="file-upload-item">
              <label className="file-label">{doc.label || doc.name}</label>
              {fo ? (
                <div className="file-actions">
                  {fo.existing
                    ? <a href={fo.url} target="_blank" rel="noopener noreferrer">{fo.name}</a>
                    : <span>{fo.name}</span>
                  }
                  <button type="button" onClick={() => handleRemoveFile(doc.code)}>Удалить</button>
                  <input type="file" name={doc.code} onChange={handleChange} />
                </div>
              ) : (
                <input type="file" name={doc.code} onChange={handleChange} />
              )}
            </div>
          );
        })}
        <button className="upload-btn" onClick={() => setModalOpen(false)}>Закрыть</button>
      </div>
    </div>
  );

  return (
    <div className="application-page">
      <div className="application-container">
        <h2>Редактировать Заявку</h2>

        <div className="form-grid">
          <div className="input-group"><label>Имя</label><input type="text" value={formData.firstName} readOnly/></div>
          <div className="input-group"><label>Фамилия</label><input type="text" value={formData.lastName} readOnly/></div>
          <div className="input-group"><label>Курс</label><input type="text" value={formData.course} readOnly/></div>
          <div className="input-group">
            <label>Пол</label>
            <input
              type="text"
              value={formData.gender === 'M' ? 'Мужской'
                : formData.gender === 'F' ? 'Женский'
                : ''}
              readOnly
            />
          </div>
          <div className="input-group"><label>Дата рождения</label><input type="text" value={formData.birthDate} readOnly/></div>
          <div className="input-group">
            <label>Телефон родителя</label>
            <input type="text" name="parentPhone" value={formData.parentPhone} onChange={handleChange}/>
          </div>
          <div className="input-group">
            <label>Результат ЕНТ</label>
            <input type="number" name="entResult" value={formData.entResult} onChange={handleChange}/>
            <small style={{ color: '#888' }}>
              Загрузите ЕНТ сертификат в разделе "Загрузить документы", без этого сертификата ваш результат учитываться не будет
            </small>
          </div>
          <div className="input-group">
            <label>Ценовой диапазон</label>
            <select name="priceRange" value={formData.priceRange} onChange={handleChange} className="price-range-select">
              <option value="">Выберите стоимость</option>
              {costOptions.map(c => (
                <option key={c} value={c}>{Number(c).toLocaleString('ru-RU')} ₸</option>
              ))}
            </select>
          </div>
        </div>

        {Object.keys(formData.documents).length > 0 && (
          <div className="selected-files">
            <h4>Выбранные документы:</h4>
            <ul>
              {Object.entries(formData.documents).map(([code, fo]) => (
                <li key={code}>
                  {fo.existing
                    ? <a href={fo.url} target="_blank" rel="noopener noreferrer">{fo.name}</a>
                    : <span>{fo.name}</span>
                  }{' '}
                  <button onClick={() => handleRemoveFile(code)}>Удалить</button>
                </li>
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
