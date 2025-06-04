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
    documents: {},     // { [evidenceCode]: File }
    birthDate: '',
    gender: '',
    parentPhone: '',
    entResult: '',     // Для первокурсников — балл ЕНТ, для остальных — GPA
  });
  const [evidenceTypes, setEvidenceTypes] = useState([]);
  const [dormitories, setDormitories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // 1) При монтировании: загрузка данных студента
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get('studentdetail/');
        const data = res.data;

        const numericCourse = Number(data.course);
        const initialEnt = numericCourse > 1 && data.gpa != null
          ? data.gpa
          : '';

        setFormData(fd => ({
          ...fd,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          course: numericCourse,
          birthDate: data.birth_date || '',
          gender:
            data.gender === 'M' || data.gender === 'male'
              ? 'Мужской'
              : data.gender === 'F' || data.gender === 'female'
              ? 'Женский'
              : '',
          parentPhone: data.parent_phone || '',
          entResult: initialEnt,
        }));
      } catch (err) {
        console.error('Ошибка загрузки данных студента:', err);
      }
    };
    fetchStudent();
  }, []);

  // 2) Загружаем справочники EvidenceType (только названия/коды, без существующих файлов)
  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await api.get('evidence-types/');
        const list = Array.isArray(res.data) ? res.data : res.data.results || [];
        setEvidenceTypes(list);
      } catch (err) {
        console.error('Ошибка загрузки типов документов:', err);
      }
    };
    fetchEvidence();
  }, []);

  // 3) Загружаем список цен общежитий
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

  /**
   * 4) Обработчик выбора файла.
   *    Для первокурсников: если name === 'ent_certificate', отправляем PDF на /ent-extract/,
   *    чтобы получить балл ЕНТ и записать в entResult.
   *    Для прочих: просто сохраняем файл в formData.documents.
   */
  const handleChange = async e => {
    const { name, files } = e.target;
    if (!files?.[0]) return;

    const selectedFile = files[0];
    setFormData(fd => ({
      ...fd,
      documents: {
        ...fd.documents,
        [name]: selectedFile,
      },
    }));

    if (name === 'ent_certificate') {
      if (selectedFile.type !== 'application/pdf') {
        alert('Пожалуйста, загрузите PDF-файл для сертификата ЕНТ.');
        setFormData(fd => {
          const docs = { ...fd.documents };
          delete docs[name];
          return { ...fd, documents: docs };
        });
        return;
      }

      try {
        const fdUpload = new FormData();
        fdUpload.append('file', selectedFile);

        const resp = await api.post('ent-extract/', fdUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const gotScore = resp.data.total_score;
        setFormData(fd => ({
          ...fd,
          entResult: gotScore,
        }));
      } catch (err) {
        console.error('Ошибка извлечения балла ЕНТ:', err.response?.data || err);
        setFormData(fd => {
          const docs = { ...fd.documents };
          delete docs[name];
          return { ...fd, documents: docs, entResult: '' };
        });
        alert('Не удалось получить балл ЕНТ из PDF. Проверьте файл.');
      }
    }
  };

  // 5) Удаляем загруженный файл, и если это сертификат ЕНТ, сбрасываем entResult
  const handleRemoveFile = code => {
    setFormData(fd => {
      const docs = { ...fd.documents };
      delete docs[code];
      const newEnt = code === 'ent_certificate' ? '' : fd.entResult;
      return { ...fd, documents: docs, entResult: newEnt };
    });
  };

  /**
   * 6) Отправка формы заявки.
   *    ent_result отправляем из formData.entResult.
   *    Все файлы из formData.documents просто передаются под их кодами.
   */
  const handleApplicationSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append('dormitory_cost', formData.priceRange);
      payload.append('parent_phone', formData.parentPhone);
      payload.append('ent_result', formData.entResult);

      Object.entries(formData.documents).forEach(([code, fileObj]) => {
        if (fileObj instanceof File) {
          payload.append(code, fileObj);
        }
      });

      await api.post('create_application/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/testpage');
    } catch (err) {
      console.error('Ошибка при создании заявки:', err.response?.data || err);
      if (err.response?.data?.error) {
        alert(`Ошибка: ${err.response.data.error}`);
      }
    }
  };

  const isFreshman = formData.course === 1;

  return (
    <div className="application-page">
      <div className="application-box">
        <h1 className="app-title">Заявка на заселение</h1>
        <p className="app-desc">
          Заполните форму и предоставьте необходимые документы для подачи заявки на проживание в общежитии
        </p>
        <form
          className="app-form"
          onSubmit={e => {
            e.preventDefault();
            handleApplicationSubmit();
          }}
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
                required
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

            {/* Если первокурсник, показываем поля для ЕНТ */}
            {isFreshman ? (
              <>
                <div className="input-block">
                  <label htmlFor="entResult">Балл ЕНТ</label>
                  <input
                    type="number"
                    min="0"
                    max="140"
                    value={formData.entResult}
                    readOnly
                    placeholder="Будет заполнено автоматически"
                    id="entResult"
                  />
                </div>
                <div className="input-block-file">
                  <label htmlFor="ent_certificate">Сертификат ЕНТ (PDF)</label>
                  <input
                    type="file"
                    name="ent_certificate"
                    accept=".pdf"
                    onChange={handleChange}
                    id="ent_certificate"
                  />
                  {formData.documents.ent_certificate && (
                    <div className="file-name">
                      <span>{formData.documents.ent_certificate.name}</span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => handleRemoveFile('ent_certificate')}
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="input-block">
                <label htmlFor="entResult">GPA</label>
                <input
                  type="text"
                  value={formData.entResult}
                  readOnly
                  id="entResult"
                />
              </div>
            )}
          </div>

          {/* Показ списка файлов, загруженных на этом этапе (только новые) */}
          {Object.keys(formData.documents).length > 0 && (
            <div className="selected-files">
              <h4>Выбранные файлы:</h4>
              <ul>
                {Object.entries(formData.documents).map(([code, fo]) => {
                  // Найдём label у EvidenceType, чтобы подписать справа
                  const docType = evidenceTypes.find(et => et.code === code);
                  const docLabel = docType ? (docType.label || docType.name) : code;

                  return (
                    <li key={code}>
                      <strong>{docLabel}:</strong>{' '}
                      <span>{fo.name}</span>{' '}
                      <button
                        className="remove-file-btn"
                        onClick={() => handleRemoveFile(code)}
                      >
                        ✖
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="upload-btn"
            onClick={() => setModalOpen(true)}
            style={{ marginTop: 28 }}
          >
            Загрузить остальные документы
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
              Здесь можно загрузить дополнительные файлы (не обязательно).<br />
              {isFreshman
                ? 'Загрузка «Сертификата ЕНТ» уже сделана выше. Вы можете добавить остальные документы.'
                : 'Если у вас есть какие-либо документы (справки и т.п.), можете прикрепить их здесь.'}
              <br />
              Недостающие файлы можно будет прикрепить позже.
            </div>
            <div className="docs-grid">
              {evidenceTypes
                .filter(doc =>
                  doc.data_type === 'file' &&
                  (isFreshman ? doc.code !== 'ent_certificate' : true)
                )
                .map(doc => {
                  const fileObj = formData.documents[doc.code];
                  return (
                    <div key={doc.code} className="doc-upload-cell">
                      <label className="file-label">{doc.label || doc.name}</label>

                      {fileObj ? (
                        <div className="file-upload-item">
                          <span>{fileObj.name}</span>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile(doc.code)}
                          >
                            ✖
                          </button>
                          <label htmlFor={`input_${doc.code}`} className="file-upload-btn">
                            Заменить<span className="file-upload-icon">📄</span>
                          </label>
                          <input
                            type="file"
                            name={doc.code}
                            accept="application/pdf"
                            onChange={handleChange}
                            id={`input_${doc.code}`}
                            className="hidden-file-input"
                          />
                        </div>
                      ) : (
                        <label htmlFor={`input_${doc.code}`} className="file-upload-btn">
                          Загрузить<span className="file-upload-icon">📄</span>
                          <input
                            type="file"
                            name={doc.code}
                            accept="application/pdf"
                            onChange={handleChange}
                            id={`input_${doc.code}`}
                            className="hidden-file-input"
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
            </div>
            <div className="modal-btns">
              <button className="modal-cancel-btn" onClick={() => setModalOpen(false)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationPage;
