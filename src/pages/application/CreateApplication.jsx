  // src/components/ApplicationPage.jsx
  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import api from '../../api';
  import '../../styles/Application.css';
  import { useI18n } from '../../i18n/I18nContext';
  
  const ApplicationPage = () => {
    const { t } = useI18n();
    const txt = t('applicationPage');  

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
        <h1 className="app-title">{txt.title}</h1>
        <p className="app-desc">{txt.description}</p>

        <form
          className="app-form"
          onSubmit={e => { e.preventDefault(); handleApplicationSubmit(); }}
          autoComplete="off"
        >
          <div className="app-form-grid">
            {/* First name */}
            <div className="input-block">
              <label htmlFor="firstName">{txt.firstName}</label>
              <input type="text" value={formData.firstName} readOnly id="firstName" />
            </div>
            {/* Last name */}
            <div className="input-block">
              <label htmlFor="lastName">{txt.lastName}</label>
              <input type="text" value={formData.lastName} readOnly id="lastName" />
            </div>
            {/* Course */}
            <div className="input-block">
              <label htmlFor="course">{txt.course}</label>
              <input type="text" value={formData.course} readOnly id="course" />
            </div>
            {/* Birth date */}
            <div className="input-block">
              <label htmlFor="birthDate">{txt.birthDate}</label>
              <input type="text" value={formData.birthDate} readOnly id="birthDate" />
            </div>
            {/* Gender */}
            <div className="input-block">
              <label htmlFor="gender">{txt.gender}</label>
              <input type="text" value={formData.gender} readOnly id="gender" />
            </div>
            {/* Parent phone */}
            <div className="input-block">
              <label htmlFor="parentPhone">{txt.parentPhone}</label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder={txt.selectParentPhone}
                id="parentPhone"
                required
              />
            </div>
            {/* Price range */}
            <div className="input-block">
              <label htmlFor="priceRange">{txt.priceRange}</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                required
                id="priceRange"
              >
                <option value="" disabled>{txt.selectPrice}</option>
                {dormitories.map((cost, idx) => (
                  <option key={idx} value={cost}>{cost} тг</option>
                ))}
              </select>
            </div>

            {/* ENT / GPA */}
            <div className="input-block">
              <label htmlFor="entResult">
                {isFreshman
                  ? txt.entResultLabel.freshman
                  : txt.entResultLabel.other}
              </label>
              <input
                type="text"
                value={formData.entResult}
                readOnly
                placeholder={isFreshman ? txt.entPlaceholder : undefined}
                id="entResult"
              />
            </div>

            {/* ENT certificate upload for freshmen */}
            {isFreshman && (
              <div className="input-block-file">
                <label htmlFor="ent_certificate">{txt.entCertificate}</label>
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
            )}
          </div>

          {/* Selected files */}
          {Object.keys(formData.documents).length > 0 && (
            <div className="selected-files">
              <h4>{txt.uploadDocsBtn}</h4>
              <ul>
                {Object.entries(formData.documents).map(([code, fo]) => {
                  const docType = evidenceTypes.find(et => et.code === code);
                  const docLabel = docType ? (docType.label || docType.name) : code;
                  return (
                    <li key={code}>
                      <strong>{docLabel}:</strong> {fo.name}{' '}
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
            {txt.uploadDocsBtn}
          </button>
          <button type="submit" className="submit-btn">
            {txt.submitBtn}
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal application-modal">
          <div className="modal-content application-modal-content">
            <button className="close-btn" onClick={() => setModalOpen(false)}>✖</button>
            <h3 className="modal-title">{txt.modal.title}</h3>
            <p className="modal-subtext">
              {isFreshman ? txt.modal.helpFreshman : txt.modal.helpOther}
              <br />
              {txt.modal.footer}
            </p>
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
                            {txt.fileInputReplace}
                            <span className="file-upload-icon">{txt.fileInputIcon}</span>
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
                          {txt.fileInputUpload}
                          <span className="file-upload-icon">{txt.fileInputIcon}</span>
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
                {txt.modal.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationPage;
