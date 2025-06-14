import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/Application.css';
import { useI18n } from '../../i18n/I18nContext';

const EditApplication = () => {
  const { t } = useI18n();
  const txt = t('editApplicationPage');
  const [formData, setFormData] = useState({
    firstName:   '',
    lastName:    '',
    course:      '',
    gender:      '',
    birthDate:   '',
    parentPhone: '',
    entResult:   '',
    priceRange:  '',
    documents:   {}, // { [code]: File | { id, name, url, existing: true } }
  });
  const [removedDocs, setRemovedDocs] = useState([]); // сюда складываем id удалённых ApplicationEvidence
  const [evidenceTypes, setEvidenceTypes] = useState([]); // список всех EvidenceType
  const [costOptions, setCostOptions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // При монтировании загружаем заявку, студента и уже загруженные файлы
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationRes, studentRes, evidenceRes] = await Promise.all([
          api.get('/application/'),
          api.get('/studentdetail/'),
          api.get('/application/evidences/')
        ]);

        const app     = applicationRes.data;
        const student = studentRes.data;
        const numericCourse = Number(student.course);
        const initialEnt = numericCourse > 1 && student.gpa != null
          ? student.gpa
          : app.ent_result || '';

        // Формируем словарь уже загруженных файлов: { code: { id, name, url, existing: true } }
        const existingDocs = {};
        evidenceRes.data.forEach(ev => {
          if (!ev.file) return;
          existingDocs[ev.evidence_type_code] = {
            id:       ev.id,
            name:     ev.name || ev.file.split('/').pop(),
            url:      ev.file,
            existing: true
          };
        });

        setFormData(prev => ({
          ...prev,
          firstName:   student.first_name   || '',
          lastName:    student.last_name    || '',
          course:      numericCourse,
          gender:      student.gender       || '',
          birthDate:   student.birth_date   || '',
          parentPhone: app.parent_phone     || '',
          entResult:   initialEnt,
          priceRange:  app.dormitory_cost   || '',
          documents:   { ...existingDocs }
        }));
      } catch (error) {
        console.error('Ошибка при получении данных заявки или студента:', error);
      }
    };

    const fetchEvidenceTypes = async () => {
      try {
        const response = await api.get('/evidence-types/');
        setEvidenceTypes(response.data.results || response.data || []);
      } catch (error) {
        console.error('Ошибка загрузки типов документов:', error);
      }
    };

    const fetchCosts = async () => {
      try {
        const response = await api.get('/dorms/costs/');
        setCostOptions(response.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке цен:', error);
      }
    };

    fetchCosts();
    fetchData();
    fetchEvidenceTypes();
  }, []);

  // Удаляем файл из formData.documents (помечая existing для удаления)
  const handleRemoveFile = code => {
    setFormData(prev => {
      const docs = { ...prev.documents };
      const removed = docs[code];
      delete docs[code];
      if (removed?.existing) {
        setRemovedDocs(rd => [...rd, removed.id]);
      }
      // Если удалили сертификат ЕНТ у первокурсника — сбрасываем entResult
      const newEnt = code === 'ent_certificate' && prev.course === 1
        ? ''
        : prev.entResult;
      return { ...prev, documents: docs, entResult: newEnt };
    });
  };

  // Загрузка нового файла или замена существующего
  // Если name === 'ent_certificate', сразу отправляем на /ent-extract/
  const handleChange = async e => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    const selectedFile = files[0];

    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, [name]: selectedFile }
    }));

    if (name === 'ent_certificate') {
      if (selectedFile.type !== 'application/pdf') {
        alert('Пожалуйста, загрузите PDF-файл для сертификата ЕНТ.');
        setFormData(prev => {
          const docs = { ...prev.documents };
          delete docs[name];
          return { ...prev, documents: docs };
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
        setFormData(prev => ({ ...prev, entResult: gotScore }));
      } catch (err) {
        console.error('Ошибка извлечения балла ЕНТ:', err.response?.data || err);
        setFormData(prev => {
          const docs = { ...prev.documents };
          delete docs[name];
          return { ...prev, documents: docs, entResult: '' };
        });
        alert('Не удалось получить балл ЕНТ из PDF. Проверьте файл.');
      }
    }
  };

  // Сохраняем изменения (PATCH-запрос)
  const handleUpdate = async () => {
    try {
      const payload = new FormData();
      payload.append('dormitory_cost', formData.priceRange);
      payload.append('ent_result',     formData.entResult);
      payload.append('parent_phone',   formData.parentPhone);

      // Добавляем только новые файлы (экземпляры File)
      Object.entries(formData.documents).forEach(([code, fo]) => {
        if (fo instanceof File) {
          payload.append(code, fo);
        }
      });

      // Если есть помеченные на удаление existing-файлы, отправляем их id
      if (removedDocs.length) {
        removedDocs.forEach(id => {
          payload.append('delete_evidences[]', String(id));
        });
      }

      await api.patch('/student/application/', payload);
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при обновлении заявки:', error);
    }
  };

  const isFreshman = formData.course === 1;

  // Модальное окно редактирования документов
  const renderModal = () => (
    <div className="modal application-modal">
      <div className="modal-content application-modal-content">
        <button
          className="close-btn"
          onClick={() => setModalOpen(false)}
        >✖</button>
        <h3 className="modal-title">{txt.labels.editDocs}</h3>
        <div className="modal-subtext">{txt.desc}</div>
        <div className="docs-grid">
          {evidenceTypes.map(doc => {
            if (isFreshman && doc.code === 'ent_certificate') return null;
            const fo = formData.documents[doc.code];
            const label = doc.label || doc.name;
            return (
              <div key={doc.code} className="doc-upload-cell">
                <label className="file-label" htmlFor={`input_${doc.code}`}>
                  {label}
                  {fo?.existing && (
                    <span className="existing-file-info">
                      &nbsp;—&nbsp;
                      <a href={fo.url} target="_blank" rel="noopener noreferrer">
                        {fo.name}
                      </a>
                    </span>
                  )}
                </label>
                {fo ? (
                  <div className="file-upload-item">
                    <label
                      htmlFor={`input_${doc.code}`}
                      className="file-upload-btn"
                    >
                      {txt.labels.editDocs}
                      <input
                        type="file"
                        name={doc.code}
                        accept="application/pdf"
                        onChange={handleChange}
                        id={`input_${doc.code}`}
                        className="hidden-file-input"
                      />
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor={`input_${doc.code}`}
                    className="file-upload-btn"
                  >
                    {txt.labels.uploadEnt}
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
          <button
            className="modal-cancel-btn"
            onClick={() => setModalOpen(false)}
          >
            {txt.labels.close}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="application-page">
      <div className="application-box">
        <h1 className="app-title">{txt.title}</h1>
        <p className="app-desc">{txt.desc}</p>

        <div className="app-form">
          <div className="app-form-grid">
            {['firstName','lastName','course','gender','birthDate'].map(key => (
              <div key={key} className="input-block">
                <label>{txt.labels[key]}</label>
                <input
                  type="text"
                  value={formData[key]}
                  readOnly
                />
              </div>
            ))}

            <div className="input-block">
              <label>{txt.labels.parentPhone}</label>
              <input
                type="text"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
              />
            </div>

            <div className="input-block">
              <label>{txt.labels.priceRange}</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
              >
                <option value="">{txt.labels.priceRange}</option>
                {costOptions.map(c => (
                  <option key={c} value={c}>
                    {Number(c).toLocaleString('ru-RU')} ₸
                  </option>
                ))}
              </select>
            </div>

            {isFreshman ? (
              <>
                <div className="input-block">
                  <label>{txt.labels.entResult.label}</label>
                  <input
                    type="number"
                    name="entResult"
                    value={formData.entResult}
                    readOnly
                    placeholder={txt.labels.entResult.placeholder}
                  />
                </div>
                <div className="input-block-file">
                  <label htmlFor="ent_certificate" className="file-upload-btn">
                    {txt.labels.uploadEnt}
                  </label>
                  <input
                    type="file"
                    name="ent_certificate"
                    accept=".pdf"
                    onChange={handleChange}
                    id="ent_certificate"
                    className="hidden-file-input"
                  />
                  {formData.documents.ent_certificate && (
                    <div className="file-name">
                      <span>{formData.documents.ent_certificate.name}</span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => handleRemoveFile('ent_certificate')}
                      >✖</button>
                    </div>
                  )}
                  <small className="field-note">{txt.notes.ent}</small>
                </div>
              </>
            ) : (
              <div className="input-block">
                <label>{txt.labels.gpa}</label>
                <input
                  type="text"
                  name="entResult"
                  value={formData.entResult}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>

        {Object.keys(formData.documents).length > 0 && (
          <div className="selected-files">
            <h4>{txt.labels.filesInApp}</h4>
            <ul>
              {Object.entries(formData.documents).map(([code, fo]) => {
                const docType = evidenceTypes.find(et => et.code === code);
                const docLabel = docType ? (docType.label || docType.name) : code;
                return (
                  <li key={code}>
                    <strong>{docLabel}:</strong>{' '}
                    {fo.existing
                      ? <a href={fo.url} target="_blank" rel="noreferrer">{fo.name}</a>
                      : <span>{fo.name}</span>
                    }{' '}
                    <button
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(code)}
                    >✖</button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="button-group" style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            className="upload-btn"
            onClick={() => setModalOpen(true)}
          >
            {txt.labels.editDocs}
          </button>
          <button
            type="button"
            className="submit-btn"
            onClick={handleUpdate}
          >
            {txt.labels.save}
          </button>
        </div>
      </div>

      {isModalOpen && renderModal()}
    </div>
  );
};

export default EditApplication;