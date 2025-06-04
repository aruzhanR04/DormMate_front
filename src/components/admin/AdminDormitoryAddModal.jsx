import React, { useState } from "react";
import api from '../../api';
import '../../styles/AdminFormShared.css';

const AdminDormitoryAddModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    total_places: "",
    cost: ""
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevFiles => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setImages(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dormResponse = await api.post("dorms/", formData);
      const createdDorm = dormResponse.data;
      for (const file of images) {
        const formDataFile = new FormData();
        formDataFile.append("dorm", createdDorm.id);
        formDataFile.append("image", file);
        await api.post("dorm-images/", formDataFile);
      }
      setMessage("Общежитие успешно добавлено");
      setTimeout(onClose, 900);
    } catch (error) {
      setMessage("Ошибка при добавлении");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Добавить общежитие</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <label>
            Название:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Количество мест:
            <input type="number" name="total_places" value={formData.total_places} onChange={handleChange} required />
          </label>
          <label>
            Цена:
            <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />
          </label>
          <label>
            Адрес:
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </label>
          <label>
            Описание:
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} required />
          </label>
          <label>
            Фотографии:
            <input type="file" name="images" multiple onChange={handleFileChange} accept="image/*" />
          </label>
          {images.length > 0 && (
            <ul>
              {images.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <button type="button" onClick={() => handleRemoveFile(index)}>Удалить</button>
                </li>
              ))}
            </ul>
          )}
          <div className="form-actions">
            <button type="submit" className="save-button">Добавить</button>
            <button type="button" className="cancel-button" onClick={onClose}>Отмена</button>
          </div>
          {message && <div className="error-message" style={{ marginTop: 10 }}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default AdminDormitoryAddModal;
