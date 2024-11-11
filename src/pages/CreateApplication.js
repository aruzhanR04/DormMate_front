// src/pages/ApplicationPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Application.css';

const ApplicationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    course: '',
    priceRange: '',
  });
  const [dormitories, setDormitories] = useState([]);
  const [selectedDormPrice, setSelectedDormPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate(); // Навигация для редиректа после успешного создания заявки

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await api.get('studentdetail/');
        setFormData({
          firstName: response.data.first_name || '',
          lastName: response.data.last_name || '',
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
        const response = await api.get('http://127.0.0.1:8000/api/v1/dormlist'); // Полный URL для списка общежитий
        console.log("Общежития:", response.data);
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'priceRange') {
      const selectedDorm = dormitories.find((dorm) => dorm.id.toString() === value);
      setSelectedDormPrice(selectedDorm ? selectedDorm.cost : '');
    }
  };

  const handleApplicationAndRedirect = async () => {
    try {
      const response = await api.post('http://127.0.0.1:8000/api/v1/create_application/', {
        dormitory_choice: formData.priceRange,
      });

      if (response.status === 201) {
        alert(`Заявка успешно создана! ID заявки: ${response.data.application_id}`);
        navigate('/testpage'); // Переход на страницу теста после успешного создания заявки
      } else {
        setErrorMessage(`Ошибка: ${response.data.message || 'Не удалось создать заявку'}`);
      }
    } catch (error) {
      console.error('Ошибка при создании заявки:', error);
      setErrorMessage('Ошибка при соединении с сервером');
    }
  };

  return (
    <div className="application-page">
      <div className="form-section">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <input type="text" placeholder="Имя" name="firstName" value={formData.firstName || ''} readOnly />
        <input type="text" placeholder="Фамилия" name="lastName" value={formData.lastName || ''} readOnly />
        <input type="text" placeholder="Курс" name="course" value={formData.course || ''} readOnly />
        <select
          name="priceRange"
          value={formData.priceRange || ''}
          onChange={handleChange}
        >
          <option value="">Выберите общежитие</option>
          {dormitories.map((dorm) => (
            <option key={dorm.id} value={dorm.id}>
              {dorm.name} - {dorm.cost} тг
            </option>
          ))}
        </select>
        {selectedDormPrice && (
          <p>Стоимость: {selectedDormPrice} тг</p>
        )}
        <button className="submit-btn" onClick={handleApplicationAndRedirect}>Отправить заявку и перейти к тесту</button>
      </div>
    </div>
  );
};

export default ApplicationPage;
