// AdminDormitoryAddModal.js
import React, { useState } from "react";
import api from '../../api'; // ваш axios-или-fetch API wrapper
import '../../styles/AdminFormShared.css';

const AdminDormitoryAddModal = ({ onClose }) => {
  // === 1. State для полей общежития ===
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    total_places: "",
    cost: ""
  });

  // === 2. State для динамического списка комнат ===
  // Начинаем со списка из одной «пустой» комнаты
  const [rooms, setRooms] = useState([
    { number: "", capacity: "" }
  ]);

  // === 3. State для работы с фотографиями ===
  // Здесь будем хранить загруженные пользователем файлы
  const [images, setImages] = useState([]);

  const [message, setMessage] = useState("");

  // Обработчик изменения полей общежития
  const handleChangeDorm = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик изменения полей конкретной комнаты (number или capacity)
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

  // Добавить ещё одну «пустую» комнату
  const handleAddRoom = () => {
    setRooms(prevRooms => ([...prevRooms, { number: "", capacity: "" }]));
  };

  // Удалить комнату по индексу
  const handleRemoveRoom = (index) => {
    setRooms(prevRooms => prevRooms.filter((_, i) => i !== index));
  };

  // === Обработчики для работы с фотографиями ===

  // Когда пользователь выбирает новые файлы
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevFiles => [...prevFiles, ...files]);
  };

  // Когда пользователь нажимает «Удалить» рядом с именем файла
  const handleRemoveFile = (index) => {
    setImages(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // === Главный сабмит: создаём общежитие → комнаты → загружаем фото ===
  const handleSubmit = async (e) => {
    e.preventDefault();



    

    // 1) Проверяем, что поля общежития заполнены:
    if (!formData.name || !formData.address || !formData.total_places || !formData.cost) {
      setMessage("Пожалуйста, заполните все обязательные поля общежития.");
      return;
    }

    // 2) Проверяем, что каждая комната имеет номер и вместимость:
    const invalidRoom = rooms.some(r => !r.number || !r.capacity);
    if (invalidRoom) {
      setMessage("Все комнаты должны иметь номер и вместимость.");
      return;
    }
    
    try {
      // 3) Создаём Dorm через API
      const dormResponse = await api.post("dorms/", {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        total_places: formData.total_places,
        cost: formData.cost
      });
      const createdDorm = dormResponse.data;
      console.log("Создаём комнаты для dorm ID:", createdDorm.id);
      // 4) Циклично создаём комнаты, указывая в каждой поле dorm=createdDorm.id
      for (const room of rooms) {
        await api.post("rooms/", {
          dorm: createdDorm.id,
          number: room.number,
          capacity: room.capacity
          // поле floor заполнится на бэке автоматически через модель Room.save()
        });
      }

      // 5) После того, как общежитие и комнаты созданы, загружаем фотографии
      for (const file of images) {
        const formDataFile = new FormData();
        formDataFile.append("dorm", createdDorm.id);
        formDataFile.append("image", file);
        // Эндпоинт для загрузки картинки: "dorm-images/"
        await api.post("dorm-images/", formDataFile, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setMessage("Общежитие, комнаты и фотографии успешно добавлены.");
      // Закрываем модалку через 0.9 сек, чтобы успело появиться сообщение
      setTimeout(onClose, 900);
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при добавлении общежития/комнат/фотографий.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button
          className="modal-close-btn"
          onClick={onClose}
        >
          ✕
        </button>
        <h2>Добавить общежитие</h2>

        <form onSubmit={handleSubmit} className="form-container">

          {/* ====== ПОЛЯ ОБЩЕЖИТИЯ ====== */}
          <label>
            Название:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChangeDorm}
              required
            />
          </label>

          <label>
            Количество мест:
            <input
              type="number"
              name="total_places"
              value={formData.total_places}
              onChange={handleChangeDorm}
              required
            />
          </label>

          <label>
            Цена:
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChangeDorm}
              required
            />
          </label>

          <label>
            Адрес:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChangeDorm}
              required
            />
          </label>

          <label>
            Описание:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChangeDorm}
              rows={2}
            />
          </label>

          <hr style={{ margin: "20px 0" }} />


           {/* ====== СЕКЦИЯ ДЛЯ ЗАГРУЗКИ ФОТОГРАФИЙ ====== */}
           <h3>Фотографии</h3>
          <label>
            Выбрать фотографии:
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>

          {images.length > 0 && (
            <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
              {images.map((file, index) => (
                <li key={index} style={{ marginBottom: "5px", display: "flex", alignItems: "center", gap: "10px" }}>
                  {file.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#c00",
                      cursor: "pointer",
                      fontSize: "16px",
                      lineHeight: "1"
                    }}
                    title="Удалить этот файл"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* ====== ДИНАМИЧЕСКИЙ СПИСОК КОМНАТ ====== */}


          <hr style={{ margin: "20px 0" }} />



          <h3>Комнаты</h3>
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

         

          <hr style={{ margin: "20px 0" }} />

          {/* ====== КНОПКИ СОХРАНЕНИЯ / ОТМЕНЫ ====== */}
          <div className="form-actions" style={{ display: "flex", gap: "10px" }}>
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

          {/* Отображаем поль�?зовательское сообщение об ошибке или успехе */}
          {message && (
            <div className="error-message" style={{ marginTop: 10 }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminDormitoryAddModal;
