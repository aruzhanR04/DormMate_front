import React, { useState, useEffect } from 'react';
import api from '../api';

const DormitoriesViewAll = () => {
  const [dormitories, setDormitories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const response = await api.get('/dormlist');
        console.log('Dormitories response:', response.data);
        let dormData = [];
        // Если API возвращает пагинированный ответ с полем results:
        if (response.data.results) {
          dormData = response.data.results;
        } else if (Array.isArray(response.data)) {
          dormData = response.data;
        } else {
          dormData = Object.values(response.data);
        }
        setDormitories(dormData);
      } catch (error) {
        console.error('Ошибка при загрузке списка общежитий:', error);
        setMessage('Ошибка при загрузке данных.');
      }
    };

    fetchDormitories();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Просмотр всех общежитий</h1>
      {dormitories && dormitories.filter(item => item && item.name).length > 0 ? (
        dormitories
          .filter(dorm => dorm && dorm.name)
          .map(dorm => (
            <div key={dorm.id}>
              <p>{dorm.name}</p>
            </div>
          ))
      ) : (
        <p>Нет данных для отображения.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DormitoriesViewAll;
