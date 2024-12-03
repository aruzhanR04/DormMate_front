import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Application.css';
import img_11 from '../assets/img_11.svg';

const ApplicationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    course: '',
    priceRange: '',
    priority: null,
    orphan_certificate: null,
    disability_1_2_certificate: null,
    disability_3_certificate: null,
    parents_disability_certificate: null,
    loss_of_breadwinner_certificate: null,
    social_aid_certificate: null,
    mangilik_el_certificate: null,
    olympiad_winner_certificate: null,
  });

  const [dormitories, setDormitories] = useState([]);
  const [selectedDormPrice, setSelectedDormPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, setNotification] = useState(''); // Уведомление
  const [showFileFields, setShowFileFields] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await api.get('studentdetail/');
        setFormData({
          firstName: response.data.first_name || '',
          lastName: response.data.last_name || '',
          birthDate: response.data.birth_date || '',
          gender: response.data.gender === 'F' ? 'Женский' : response.data.gender === 'M' ? 'Мужской' : 'Не указан',
          course: response.data.course || '',
          priceRange: '',
        });
      } catch (error) {
        console.error('Ошибка загрузки данных студента:', error);
        setErrorMessage('Не удалось загрузить данные студента');
      }
    };

    const fetchDormitories = async () => {
      try {
        const response = await api.get('http://127.0.0.1:8000/api/v1/dormlist');
        setDormitories(response.data);
      } catch (error) {
        console.error('Ошибка загрузки общежитий:', error);
        setErrorMessage('Не удалось загрузить список общежитий');
      }
    };

    fetchStudentData();
    fetchDormitories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (name === 'priceRange') {
      const selectedDorm = dormitories.find((dorm) => dorm.id.toString() === value);
      setSelectedDormPrice(selectedDorm ? selectedDorm.cost : '');
    }
  };

  const handleApplicationAndRedirect = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('dormitory_choice', formData.priceRange);

    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await api.post('http://127.0.0.1:8000/api/v1/create_application/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setNotification(`Заявка успешно создана! ID заявки: ${response.data.application_id}`); // Уведомление
        navigate('/testpage');
      } else {
        setErrorMessage(`Ошибка: ${response.data.message || 'Не удалось создать заявку'}`);
      }
    } catch (error) {
      console.error('Ошибка при создании заявки:', error);
      setErrorMessage('Ошибка при соединении с сервером');
    }
  };

  const toggleFileFields = () => {
    setShowFileFields((prev) => !prev);
  };

  return (
    <div className="application-page">
      <div className="form-section">
        {notification && <div className="notification">{notification}</div>} {/* Уведомление */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <input type="text" placeholder="Имя" name="firstName" value={formData.firstName || ''} readOnly />
        <input type="text" placeholder="Фамилия" name="lastName" value={formData.lastName || ''} readOnly />
        <input type="text" placeholder="Дата рождения" name="birthDate" value={formData.birthDate || ''} readOnly />
        <input type="text" placeholder="Пол" name="gender" value={formData.gender || ''} readOnly />
        <input type="text" placeholder="Курс" name="course" value={formData.course || ''} readOnly />
        <select name="priceRange" value={formData.priceRange || ''} onChange={handleChange}>
          <option value="">Выберите общежитие</option>
          {dormitories.map((dorm) => (
            <option key={dorm.id} value={dorm.id}>
              {dorm.name} - {dorm.cost} тг
            </option>
          ))}
        </select>
        {selectedDormPrice && <p>Стоимость: {selectedDormPrice} тг</p>}

        <button className='test-btn' onClick={toggleFileFields}>
          {showFileFields ? 'Скрыть формы' : 'Прикрепите необходимые справки и документы'}
        </button>

        {showFileFields && (
          <div className="file-fields">
            <label>
              Справка сироты:
              <input type="file" name="orphan_certificate" onChange={handleChange} />
            </label>
            <label>
              Справка инвалидности 1-2 группы:
              <input type="file" name="disability_1_2_certificate" onChange={handleChange} />
            </label>
            <label>
              Справка инвалидности 3 группы:
              <input type="file" name="disability_3_certificate" onChange={handleChange} />
            </label>
            <label>
              Справка инвалидности родителей:
              <input type="file" name="parents_disability_certificate" onChange={handleChange} />
            </label>
            <label>
              Справка о потере кормильца:
              <input type="file" name="loss_of_breadwinner_certificate" onChange={handleChange} />
            </label>
            <label>
              Справка о получении социальной помощи:
              <input type="file" name="social_aid_certificate" onChange={handleChange} />
            </label>
            <label>
              Сертификат "Мәңгілік Ел":
              <input type="file" name="mangilik_el_certificate" onChange={handleChange} />
            </label>
            <label>
              Сертификат победителя олимпиады:
              <input type="file" name="olympiad_winner_certificate" onChange={handleChange} />
            </label>
          </div>
        )}
        <button className="submit-btn" onClick={handleApplicationAndRedirect}>Отправить заявку и перейти к тесту</button>
      </div>
      <div className="visual-section">
        <img src={img_11} alt="img_11" className="img_11" />
      </div>
    </div>
  );
};

export default ApplicationPage;
