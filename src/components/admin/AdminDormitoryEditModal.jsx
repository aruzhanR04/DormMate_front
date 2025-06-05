// AdminDormitoryEditModal.js
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

  // === Новый state для комнат ===
  const [rooms, setRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  // При загрузке данных подтягиваем Dorm + комнаты
  useEffect(() => {
    const fetchDormData = async () => {
      try {
        // 1) Получаем информацию об общежитии
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

      try {
        // 2) Получаем список комнат, связанных с этим dorm
        const roomsResponse = await api.get(`rooms/?dorm=${dormId}`);
        console.log(roomsResponse);
        // Формируем array: для каждой комнаты оставляем { id, number, capacity, isNew: false }
        const fetchedRooms = roomsResponse.data.results.map(r => ({
          id: r.id,
          number: r.number,
          capacity: r.capacity,
          isNew: false
        }));
        setRooms(fetchedRooms);
      } catch {
        // Если 404 или другая ошибка – просто оставляем rooms = []
        setMessage(prev => prev + "\nОшибка при загрузке списка комнат");
      }
    };

    if (dormId) {
      fetchDormData();
    }
  }, [dormId]);

  // Обработчики для полей общежития
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработчик для новых фото
  const handleNewImageChange = (e) => {
    setNewImages(prev => [...prev, ...Array.from(e.target.files)]);
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

  // === Обработчики для комнат ===

  // Изменение данных конкретной комнаты (по индексу)
  const handleChangeRoom = (index, e) => {
    const { name, value } = e.target;
    setRooms(prevRooms => {
      const updated = [...prevRooms];
      updated[index] = {
        ...updated[index],
        [name]: value
      };
      return updated;
    });
  };

  // Добавляем новую «пустую» комнату с isNew: true
  const handleAddRoom = () => {
    setRooms(prevRooms => ([
      ...prevRooms,
      { id: undefined, number: "", capacity: "", isNew: true }
    ]));
    // После добавления сразу раскрываем список, если он был скрыт
    setShowRooms(true);
  };

  // Удаление комнаты: если isNew — просто убираем из state; иначе — отправляем DELETE и убираем
  const handleRemoveRoom = async (index) => {
    const roomToDelete = rooms[index];
    if (roomToDelete.isNew) {
      // Новая комната, ещё не создана на бэке — просто удаляем из массива
      setRooms(prev => prev.filter((_, i) => i !== index));
    } else {
      // Существующая комната: удаляем через API, затем убираем из массива
      try {
        await api.delete(`rooms/${roomToDelete.id}/`);
        setRooms(prev => prev.filter((_, i) => i !== index));
      } catch {
        setMessage("Ошибка при удалении комнаты");
      }
    }
  };

  // Сохранение изменений: dorm + фотографии + комнаты
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1) Обновляем поля самого Dorm
      await api.put(`dorms/${dormId}/`, formData);

      // 2) Загружаем новые фотографии (если есть)
      for (const file of newImages) {
        const fd = new FormData();
        fd.append("dorm", dormId);
        fd.append("image", file);
        await api.post("dorm-images/", fd);
      }

      // 3) Обрабатываем массив rooms:
      //    - isNew = true  → POST /rooms/
      //    - isNew = false → PUT /rooms/{id}/
      for (const room of rooms) {
        if (room.isNew) {
          // Создаём новую комнату
          await api.post("rooms/", {
            dorm: dormId,
            number: room.number,
            capacity: room.capacity
          });
        } else {
          // Обновляем существующую комнату
          await api.put(`rooms/${room.id}/`, {
            dorm: dormId,
            number: room.number,
            capacity: room.capacity
          });
        }
      }

      setMessage("Изменения сохранены");
      setTimeout(onClose, 900);
    } catch (err) {
      console.error(err.response || err);
      setMessage("Ошибка при сохранении");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2>Изменить общежитие</h2>

        <form className="form-container" onSubmit={handleSubmit}>
          {/* Поля самого Dorm */}
          <label>
            Название:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Количество мест:
            <input
              type="number"
              name="total_places"
              value={formData.total_places}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Цена:
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Адрес:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Описание:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              required
            />
          </label>

          {/* Существующие фотографии */}
          <label>Существующие фото:</label>
          <div className="dorm-images-list">
            {existingImages.map(img => (
              <div key={img.id} className="dorm-image-item">
                <img src={img.image} alt="Dorm" />
                <button
                  type="button"
                  className="delete-image-button"
                  onClick={() => handleDeleteExistingImage(img.id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          {/* Загрузка новых фотографий */}
          <label>
            Новые фотографии:
            <input
              type="file"
              name="newImages"
              multiple
              onChange={handleNewImageChange}
              accept="image/*"
            />
          </label>
          {newImages.length > 0 && (
            <ul className="new-images-list">
              {newImages.map((file, idx) => (
                <li key={idx} className="new-image-item">
                  {file.name}
                  <button
                    type="button"
                    className="delete-new-image-button"
                    onClick={() => handleRemoveNewImage(idx)}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          )}

          <hr style={{ margin: "20px 0" }} />

          {/* Кнопка раскрыть/скрыть список комнат */}
          <button
            type="button"
            className="toggle-rooms-button"
            onClick={() => setShowRooms(prev => !prev)}
          >
            {showRooms ? "Скрыть список комнат" : "Показать список комнат"}
          </button>

          {showRooms && (
            <>
              <h3 style={{ marginTop: "10px" }}>Комнаты</h3>
              {rooms.map((room, idx) => (
                <div key={idx} className="room-row">
                  <div className="room-field">
                    <label>
                      Номер комнаты:
                      <input
                        className="room-input"
                        type="text"
                        name="number"
                        value={room.number}
                        onChange={(e) => handleChangeRoom(idx, e)}
                        placeholder="101, 102A и т.д."
                        required
                      />
                    </label>
                  </div>

                  <div className="room-field">
                    <label>
                      Вместимость:
                      <input
                        className="capacity-input"
                        type="number"
                        name="capacity"
                        value={room.capacity}
                        onChange={(e) => handleChangeRoom(idx, e)}
                        min="1"
                        placeholder="2, 3 или 4"
                        required
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    className="room-remove-btn"
                    onClick={() => handleRemoveRoom(idx)}
                    title="Удалить эту комнату"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-room-button"
                onClick={handleAddRoom}
              >
                + Добавить ещё одну комнату
              </button>
            </>
          )}

          <hr style={{ margin: "20px 0" }} />

          {/* Кнопки Сохранить/Отмена */}
          <div className="form-actions">
            <button type="submit" className="save-button">
              Сохранить
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Отмена
            </button>
          </div>

          {message && (
            <div style={{ width: "100%", color: '#c32939', marginTop: "10px" }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminDormitoryEditModal;
