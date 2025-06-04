import React, { useState, useEffect } from "react";
import api from '../../api';
import '../../styles/AdminFormShared.css';

const AdminDormitoryEditModal = ({ dormId, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    total_places: "",
    cost: ""
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDormData = async () => {
      try {
        const response = await api.get(`dorms/${dormId}/`);
        setFormData({
          name: response.data.name || "",
          address: response.data.address || "",
          description: response.data.description || "",
          total_places: response.data.total_places || "",
          cost: response.data.cost || ""
        });
        setExistingImages(response.data.images || []);
      } catch {
        setMessage("Ошибка при загрузке общежития");
      }
    };
    if (dormId) fetchDormData();
  }, [dormId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewImageChange = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const handleRemoveNewImage = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDeleteExistingImage = async (imageId) => {
    try {
      await api.delete(`dorm-images/${imageId}/`);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch {
      setMessage("Ошибка при удалении фотографии");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`dorms/${dormId}/`, formData);
      for (const file of newImages) {
        const fd = new FormData();
        fd.append("dorm", dormId);
        fd.append("image", file);
        await api.post("dorm-images/", fd);
      }
      setMessage("Изменения сохранены");
      setTimeout(onClose, 900);
    } catch {
      setMessage("Ошибка при сохранении");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Изменить общежитие</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <label>Название:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>Количество мест:
            <input type="number" name="total_places" value={formData.total_places} onChange={handleChange} required />
          </label>
          <label>Цена:
            <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />
          </label>
          <label>Адрес:
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </label>
          <label>Описание:
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} required />
          </label>
          <label>Существующие фото:</label>
          <div className="dorm-images-list">
            {existingImages.map(img => (
              <div key={img.id} className="dorm-image-item">
                <img src={img.image} alt="Dorm" />
                <button type="button" onClick={() => handleDeleteExistingImage(img.id)}>Удалить</button>
              </div>
            ))}
          </div>
          <label>
            Новые фотографии:
            <input type="file" name="newImages" multiple onChange={handleNewImageChange} accept="image/*" />
          </label>
          {newImages.length > 0 && (
            <ul>
              {newImages.map((file, idx) => (
                <li key={idx}>
                  {file.name}
                  <button type="button" onClick={() => handleRemoveNewImage(idx)}>Удалить</button>
                </li>
              ))}
            </ul>
          )}
          <div className="form-actions">
            <button type="submit" className="save-button">Сохранить</button>
            <button type="button" className="cancel-button" onClick={onClose}>Отмена</button>
          </div>
          {message && <div style={{ width: "100%", color: '#c32939' }}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default AdminDormitoryEditModal;
