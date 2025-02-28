import React, { useState, useEffect } from 'react';
import api from '../api';

const StudentsViewAll = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/studentlist'); // Проверьте, что эндпоинт корректный
        console.log('Students response:', response.data);
        let studentData = [];
        // Если API возвращает пагинированный ответ с полем results:
        if (response.data.results) {
          studentData = response.data.results;
        } else if (Array.isArray(response.data)) {
          studentData = response.data;
        } else {
          studentData = Object.values(response.data);
        }
        setStudents(studentData);
      } catch (error) {
        console.error('Ошибка при загрузке списка студентов:', error);
        setMessage('Ошибка при загрузке данных.');
      }
    };

    fetchStudents();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Просмотр всех студентов</h1>
      {students && students.filter(item => item && item.first_name && item.last_name).length > 0 ? (
        students
          .filter(student => student && student.first_name && student.last_name)
          .map(student => (
            <div key={student.id}>
              <p>
                {student.first_name} {student.last_name}
              </p>
            </div>
          ))
      ) : (
        <p>Нет данных для отображения.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default StudentsViewAll;
