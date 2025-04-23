import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminFormShared.css';

const AdminDormitoryViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dormData, setDormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDormData = async () => {
      try {
        const response = await api.get(`/dorms/${id}/`);
        setDormData(response.data);
      } catch (err) {
        setError('Ошибка при загрузке данных общежития.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDormData();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="admin-form-container">
          <h2>Просмотр общежития</h2>

          <div className="form-container">
            <p><strong>Название:</strong> {dormData.name}</p>
            <p><strong>Мест всего:</strong> {dormData.total_places}</p>
            <p><strong>Комнат на 2:</strong> {dormData.rooms_for_two}</p>
            <p><strong>Комнат на 3:</strong> {dormData.rooms_for_three}</p>
            <p><strong>Комнат на 4:</strong> {dormData.rooms_for_four}</p>
            <p><strong>Стоимость:</strong> {dormData.cost} тг</p>
          </div>

          {dormData.images && dormData.images.length > 0 && (
            <div className="dormitory-images" style={{ marginTop: '30px' }}>
              <h3>Фотографии</h3>
              <div className="images-container">
                {dormData.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt={`Фото ${img.id}`}
                    className="preview-image"
                  />
                ))}
              </div>
            </div>
          )}

          <button className="cancel-button" onClick={() => navigate('/admin/dormitories')}>
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDormitoryViewPage;
