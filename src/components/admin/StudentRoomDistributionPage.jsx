import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';

const StudentRoomDistributionPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentFile, setPaymentFile] = useState(null);
  

  const [dormCosts, setDormCosts] = useState([]); 
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedRoomStatus, setSelectedRoomStatus] = useState('all');

  const [showAssignRoomModal, setShowAssignRoomModal] = useState(false);
  const [assignRoomNumber, setAssignRoomNumber] = useState('');
  const [assignDormId, setAssignDormId] = useState(''); 
  

  const [dormList, setDormList] = useState([]);


  const fetchApplications = async () => {
    try {
      const response = await api.get('/student-in-dorm/');
      const apps = Array.isArray(response.data)
        ? response.data
        : (response.data.results ? response.data.results : Object.values(response.data));
      setApplications(apps);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке данных.' });
    }
  };


  const fetchDormCosts = async () => {
    try {
      const response = await api.get('/dorms/costs/');
      const costs = response.data
        ? (Array.isArray(response.data) ? response.data : Object.values(response.data))
        : [];
      setDormCosts(costs);
    } catch (error) {
      console.error('Ошибка при загрузке цен:', error);
    }
  };


  const fetchDormList = async () => {
    try {
      const response = await api.get('/dorms/');
      console.log(response.data);
      const dorms = response.data.results || [];
      setDormList(dorms.filter(dorm => dorm));
    } catch (error) {
      console.error('Ошибка при загрузке общаг:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchDormCosts();
    fetchDormList();
  }, []);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedApplications(applications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (id) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(selectedApplications.filter(item => item !== id));
    } else {
      setSelectedApplications([...selectedApplications, id]);
    }
  };


  const handleCheckPayment = async () => {
    if (!paymentFile) {
      setMessage({ type: 'error', text: 'Пожалуйста, выберите файл для проверки оплаты.' });
      return;
    }
    const formData = new FormData();
    formData.append('excel_file', paymentFile);
    try {
      const response = await api.post('/payment-confirmation/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: response.data.detail });
      fetchApplications();
    } catch (error) {
      console.error('Ошибка проверки оплаты:', error);
      setMessage({ type: 'error', text: 'Ошибка проверки оплаты.' });
    }
  };


  const handleGroupDistribution = async () => {
    try {
      const response = await api.post('/distribute-students2/');
      setMessage({ type: 'success', text: response.data.detail });
      fetchApplications();
    } catch (error) {
      console.error('Ошибка распределения по группам:', error);
      setMessage({ type: 'error', text: 'Ошибка распределения по группам.' });
    }
  };


  const handleSendOrders = async () => {
    try {
      const response = await api.post('/issue-order/');
      setMessage({ type: 'success', text: response.data.detail });
      fetchApplications();
    } catch (error) {
      console.error('Ошибка отправки ордеров:', error);
      setMessage({ type: 'error', text: 'Ошибка отправки ордеров.' });
    }
  };

 
  const filteredApplications = applications.filter(app => {

    const passesPrice = selectedPrice === 'all' || 
      String(app.application.dormitory_cost) === String(selectedPrice);
 
    const studentGender = app.student.gender ? app.student.gender.toUpperCase() : '';
    let passesGender = true;
    if (selectedGender === 'Мальчики') {
      passesGender = studentGender === 'M';
    } else if (selectedGender === 'Девочки') {
      passesGender = studentGender === 'F';
    }
    
    const passesRoomStatus =
      selectedRoomStatus === 'all' ||
      (selectedRoomStatus === 'assigned' && app.room) ||
      (selectedRoomStatus === 'not_assigned' && !app.room);
    return passesPrice && passesGender && passesRoomStatus;
  });

  const openAssignRoomModal = () => {
    if (selectedApplications.length === 0) {
      setMessage({ type: 'error', text: 'Сначала выберите студентов.' });
      return;
    }

    const selectedRecords = applications.filter(app => selectedApplications.includes(app.id));
    const dormIds = selectedRecords.map(app => (app.dorm ? app.dorm.id : null));
    const uniqueDormIds = [...new Set(dormIds.filter(id => id !== null))];
    if (uniqueDormIds.length === 1) {
      setAssignDormId(uniqueDormIds[0]);
    } else {
      setAssignDormId('');
    }
    setShowAssignRoomModal(true);
  };

  const handleAssignRoom = async () => {
    if (!assignRoomNumber) {
      setMessage({ type: 'error', text: 'Введите номер комнаты.' });
      return;
    }
    try {
      const data = {
        student_ids: selectedApplications,
        room: assignRoomNumber,
        dorm_id: assignDormId,
      };
      const response = await api.post('/assign-room/', data);
      setMessage({ type: 'success', text: response.data.detail });
      setShowAssignRoomModal(false);
      setAssignRoomNumber('');
      setAssignDormId('');
      setSelectedApplications([]);
      fetchApplications();
    } catch (error) {
      console.error('Ошибка назначения комнаты:', error);
      setMessage({ type: 'error', text: 'Ошибка назначения комнаты.' });
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h1>Распределение студентов по комнатам</h1>
        <div className="distribution-actions" style={{ marginBottom: '20px' }}>
          {/* Файл для проверки оплаты */}
          <input
            type="file"
            onChange={e => setPaymentFile(e.target.files[0])}
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleCheckPayment}>
            Проверить оплату
          </button>
          <button onClick={handleGroupDistribution} style={{ marginLeft: '10px' }}>
            Расселить по группам
          </button>
          <button onClick={handleSendOrders} style={{ marginLeft: '10px' }}>
            Разослать ордера
          </button>
          <button onClick={openAssignRoomModal} style={{ marginLeft: '10px' }}>
            Назначить комнату
          </button>
        </div>

        {/* Блок фильтров */}
        <div className="filters" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '20px' }}>
            <label htmlFor="priceFilter" style={{ marginRight: '5px' }}>Цена:</label>
            <select className="modal-select"
              id="priceFilter" 
              value={selectedPrice} 
              onChange={e => setSelectedPrice(e.target.value)}
            >
              <option value="all">Все</option>
              {dormCosts.map(cost => (
                <option key={cost} value={cost}>{cost}</option>
              ))}
            </select>
          </div>
          <div style={{ marginRight: '20px' }}>
            <label htmlFor="genderFilter" style={{ marginRight: '5px' }}>Пол:</label>
            <select className="modal-select"
              id="genderFilter" 
              value={selectedGender} 
              onChange={e => setSelectedGender(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="Мальчики">Мальчики</option>
              <option value="Девочки">Девочки</option>
            </select>
          </div>
          <div>
            <label htmlFor="roomStatusFilter" style={{ marginRight: '5px' }}>Статус заселения:</label>
            <select 
            className="modal-select"
              id="roomStatusFilter" 
              value={selectedRoomStatus} 
              onChange={e => setSelectedRoomStatus(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="assigned">Заселенные</option>
              <option value="not_assigned">Не заселенные</option>
            </select>
          </div>
        </div>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}
        <div className="students-list">
          <table className="students-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th>S</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Курс</th>
                <th>Пол</th>
                <th>Группа</th>
                <th>Комната</th>
                <th>Результат теста</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications && filteredApplications.length > 0 ? (
                filteredApplications.map(app => (
                  app && (
                    <tr key={app.id} onClick={() => navigate(`/admin/applications/${app.id}`)} style={{ cursor: 'pointer' }}>
                      <td onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedApplications.includes(app.id)}
                          onChange={() => handleSelectApplication(app.id)}
                        />
                      </td>
                      <td>{app.student.s}</td>
                      <td>{app.student.first_name}</td>
                      <td>{app.student.last_name}</td>
                      <td>{app.student.course}</td>
                      <td>{app.student.gender}</td>
                      <td>{app.group}</td>
                      <td>{app.room}</td>
                      <td>{app.application.test_result}</td>
                      <td>{app.application.dormitory_cost}</td>
                    </tr>
                  )
                ))
              ) : (
                <tr>
                  <td colSpan="10">Нет данных для отображения.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно для назначения комнаты */}
      {showAssignRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Назначить комнату</h2>
            <p>Выбранные студенты:</p>
            <ul>
              {applications
                .filter(app => selectedApplications.includes(app.id))
                .map(app => (
                  <li key={app.id}>
                    {app.student.first_name} {app.student.last_name} (<strong>{app.application.dormitory_cost}</strong>)
                  </li>
                ))}
            </ul>
            <div style={{ marginTop: '10px' }}>
              <label htmlFor="dormSelect">Общага:</label>
              <select 
                id="dormSelect" 
                value={assignDormId}
                onChange={e => setAssignDormId(e.target.value)}
                style={{ marginLeft: '10px' }}
              >
                <option value="">-- Выберите общагу --</option>
                {dormList.map(dorm => (
                  <option key={dorm.id} value={dorm.id}>
                    {dorm.name}/{dorm.cost}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: '10px' }}>
              <label htmlFor="roomInput">Номер комнаты:</label>
              <input 
                type="text" 
                id="roomInput" 
                value={assignRoomNumber} 
                onChange={(e) => setAssignRoomNumber(e.target.value)} 
                style={{ marginLeft: '10px' }}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <button onClick={handleAssignRoom}>Назначить</button>
              <button onClick={() => setShowAssignRoomModal(false)} style={{ marginLeft: '10px' }}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRoomDistributionPage;
