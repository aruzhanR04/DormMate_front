import React, { useState } from 'react';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [approvedStudents, setApprovedStudents] = useState([]); 
  const [allocatedStudents, setAllocatedStudents] = useState([]); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/upload-excel/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Данные успешно загружены и обновлены' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Ошибка загрузки файла' });
      }
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
    }
  };

  const handleDistributeStudents = async (apiUrl) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.detail || 'Студенты успешно распределены' });

        if (apiUrl.includes('distribute-students/')) {
          setApprovedStudents(data.approved_students || []); 
        } else if (apiUrl.includes('distribute-students2/')) {
          setAllocatedStudents(data.allocated_students || []); 
        }
      } else {
        setMessage({ type: 'error', text: data.detail || 'Ошибка распределения студентов' });
        if (apiUrl.includes('distribute-students2/')) {
          setAllocatedStudents([]); 
        } else {
          setApprovedStudents([]);
        }
      }
    } catch (error) {
      console.error('Ошибка при распределении студентов:', error);
      setMessage({ type: 'error', text: 'Ошибка при подключении к серверу' });
      setApprovedStudents([]);
      setAllocatedStudents([]);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>

      <div className="section">
        <h2>Загрузка Excel файла</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Загрузить файл</button>
      </div>

      <div className="section">
        <h2>Распределение студентов</h2>
        <button onClick={() => handleDistributeStudents('http://127.0.0.1:8000/api/v1/distribute-students/')}>
          Распределить студентов по заявкам
        </button>
        <button onClick={() => handleDistributeStudents('http://127.0.0.1:8000/api/v1/distribute-students2/')}>
          Распределить студентов по комнатам
        </button>
      </div>

      {message && (
        <div className={message.type}>
          {message.text}
        </div>
      )}

      {approvedStudents.length > 0 && (
        <div className="section">
          <h2>Одобренные студенты</h2>
          <ol>
            {approvedStudents.map((student, index) => (
              <li key={index}>
                S: {student.student_s}, Имя: {student.first_name}, Фамилия: {student.last_name}, Курс: {student.course}
              </li>
            ))}
          </ol>
        </div>
      )}

      {allocatedStudents.length > 0 && (
        <div className="section">
          <h2>Распределённые студенты</h2>
          <ol>
            {allocatedStudents.map((student, index) => (
              <li key={index}>
                S: {student.student_s}, Имя: {student.first_name}, Фамилия: {student.last_name}, Комната: {student.room}, Общежитие: {student.dorm_id}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
