import React, { useEffect, useState } from "react";
import api from '../../api';
import '../../styles/AdminFormShared.css';

const AdminDormitoryViewModal = ({ dormId, onClose }) => {
  const [dormData, setDormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDormData = async () => {
      try {
        const response = await api.get(`/dorms/${dormId}/`);
        setDormData(response.data);
      } catch {
        setError('Ошибка при загрузке данных общежития.');
      } finally {
        setLoading(false);
      }
    };
    if (dormId) fetchDormData();
  }, [dormId]);

  if (loading) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Просмотр общежития</h2>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="form-container">
            <label>
              <strong>Название:</strong>
              <input type="text" value={dormData.name} disabled />
            </label>
            <label>
              <strong>Адрес:</strong>
              <input type="text" value={dormData.address} disabled />
            </label>
            <label>
              <strong>Описание:</strong>
              <textarea value={dormData.description} rows={2} disabled />
            </label>
            <label>
              <strong>Мест всего:</strong>
              <input type="text" value={dormData.total_places} disabled />
            </label>
            <label>
              <strong>Комнат на 2:</strong>
              <input type="text" value={dormData.rooms_for_two} disabled />
            </label>
            <label>
              <strong>Комнат на 3:</strong>
              <input type="text" value={dormData.rooms_for_three} disabled />
            </label>
            <label>
              <strong>Комнат на 4:</strong>
              <input type="text" value={dormData.rooms_for_four} disabled />
            </label>
            <label>
              <strong>Стоимость:</strong>
              <input type="text" value={dormData.cost} disabled />
            </label>
            {dormData.images && dormData.images.length > 0 && (
              <div className="dorm-images-list">
                {dormData.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt={`Фото ${img.id}`}
                    className="preview-image"
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="form-actions">
          <button className="cancel-button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDormitoryViewModal;
