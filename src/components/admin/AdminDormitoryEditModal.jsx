// src/components/AdminDormitoryEditModal.jsx
import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminDormitoryEditModal = ({ dormId, onClose }) => {
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name_ru: "",
    name_kk: "",
    name_en: "",
    address: "",
    description_ru: "",
    description_kk: "",
    description_en: "",
    total_places: "",
    cost: ""
  });
  const [rooms, setRooms] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [message, setMessage] = useState("");
  const [showRooms, setShowRooms] = useState(false);

  // Загрузить данные общежития + комнаты + изображения
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/dorms/${dormId}/`);
        setFormData({
          name_ru: data.name_ru || "",
          name_kk: data.name_kk || "",
          name_en: data.name_en || "",
          address: data.address || "",
          description_ru: data.description_ru || "",
          description_kk: data.description_kk || "",
          description_en: data.description_en || "",
          total_places: data.total_places || "",
          cost: data.cost || ""
        });
        // комнаты
        const roomsRes = await api.get(`/rooms/?dorm=${dormId}`);
        setRooms(
          roomsRes.data.results.map((r) => ({
            id: r.id,
            number: r.number,
            capacity: r.capacity
          }))
        );
        // текущие фото
        const imgs = await api.get(`/dorm-images/?dorm=${dormId}`);
        setExistingImages(imgs.data.results);
      } catch {
        setMessage(t("adminDormitoryEditModal.messages.loadError"));
      }
    })();
  }, [dormId, t]);

  const handleChangeDorm = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleChangeRoom = (idx, e) => {
    const { name, value } = e.target;
    setRooms((p) => {
      const u = [...p];
      u[idx] = { ...u[idx], [name]: value };
      return u;
    });
  };

  const handleAddRoom = () => {
    setRooms((p) => [...p, { number: "", capacity: "" }]);
  };

  const handleRemoveRoom = (idx) => {
    const room = rooms[idx];
    if (room.id) {
      api.delete(`/rooms/${room.id}/`);
    }
    setRooms((p) => p.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e) => {
    setImages((p) => [...p, ...Array.from(e.target.files)]);
  };

  const handleRemoveNewImage = (idx) => {
    setImages((p) => p.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = async (imgId) => {
    await api.delete(`/dorm-images/${imgId}/`);
    setExistingImages((p) => p.filter((img) => img.id !== imgId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // валидация как в AddModal...
    if (
      !formData.name_ru ||
      !formData.name_kk ||
      !formData.name_en ||
      !formData.address ||
      !formData.total_places ||
      !formData.cost
    ) {
      setMessage(t("adminDormitoryEditModal.messages.fillDorm"));
      return;
    }

    try {
      // обновляем общежитие
      await api.patch(`/dorms/${dormId}/`, formData);

      // обновляем/создаём комнаты
      for (const r of rooms) {
        if (r.id) {
          await api.patch(`/rooms/${r.id}/`, {
            number: r.number,
            capacity: r.capacity
          });
        } else {
          await api.post("/rooms/", {
            dorm: dormId,
            number: r.number,
            capacity: r.capacity
          });
        }
      }

      // загружаем новые фото
      for (const file of images) {
        const fd = new FormData();
        fd.append("dorm", dormId);
        fd.append("image", file);
        await api.post("dorm-images/", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setMessage(t("adminDormitoryEditModal.messages.success"));
      setTimeout(onClose, 900);
    } catch {
      setMessage(t("adminDormitoryEditModal.messages.error"));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminDormitoryEditModal.close")}
        </button>
        <h2>{t("adminDormitoryEditModal.title")}</h2>
        <form onSubmit={handleSubmit} className="form-container">
          {/* Имена */}
          {["name_ru", "name_kk", "name_en"].map((field) => (
            <label key={field}>
              {t(`adminDormitoryEditModal.labels.${field}`)}
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChangeDorm}
                required
              />
            </label>
          ))}

          {/* Адрес, места, цена */}
          <label>
            {t("adminDormitoryEditModal.labels.address")}
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChangeDorm}
              required
            />
          </label>
          <label>
            {t("adminDormitoryEditModal.labels.total_places")}
            <input
              type="number"
              name="total_places"
              value={formData.total_places}
              onChange={handleChangeDorm}
              required
            />
          </label>
          <label>
            {t("adminDormitoryEditModal.labels.cost")}
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChangeDorm}
              required
            />
          </label>

          {/* Описания */}
          {["description_ru", "description_kk", "description_en"].map(
            (field) => (
              <label key={field}>
                {t(`adminDormitoryEditModal.labels.${field}`)}
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChangeDorm}
                  rows={2}
                />
              </label>
            )
          )}

          {/* Существующие фото */}
          <hr style={{ margin: "20px 0" }} />
          <h3>{t("adminDormitoryEditModal.labels.photosSection")}</h3>
          <div className="dorm-images-list">
          {existingImages.map((img) => (
            <div key={img.id} className="dorm-image-item">
              {/* <span>{img.image.filename || img.id}</span> */}
              <img src={img.image} alt="Dorm" width="40px" />
              <button
                type="button"
                className="delete-image-button"
                onClick={() => handleRemoveExistingImage(img.id)}
              >
                ✕
              </button>
            </div>
          ))}
          </div>

          {/* Новые фото */}
          <label>
            {t("adminDormitoryEditModal.labels.images")}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          {images.map((f, i) => (
            <div key={i} className="image-row">
              <span>{f.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveNewImage(i)}
              >
                ✕
              </button>
            </div>
          ))}



          

          {/* Комнаты */}
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
            <h3>{t("adminDormitoryEditModal.labels.roomsSection")}</h3>
          {rooms.map((r, idx) => (
            <div key={idx} className="room-row">
              <label>
                {t("adminDormitoryEditModal.labels.room_number")}
                <input
                  type="text"
                  name="number"
                  value={r.number}
                  onChange={(e) => handleChangeRoom(idx, e)}
                  required
                />
              </label>
              <label>
                {t("adminDormitoryEditModal.labels.room_capacity")}
                <input
                  type="number"
                  name="capacity"
                  value={r.capacity}
                  onChange={(e) => handleChangeRoom(idx, e)}
                  required
                />
              </label>
              <button
                type="button"
                onClick={() => handleRemoveRoom(idx)}
                className="room-remove-btn"
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddRoom} className="add-room-button">
            {t("adminDormitoryEditModal.buttons.addRoom")}
          </button>
            </>
          )}

          {/* Действия */}
          <hr style={{ margin: "20px 0" }} />
          <div className="form-actions" style={{ gap: 10 }}>
            <button type="submit" className="save-button">{t("adminDormitoryEditModal.buttons.save")}</button>
            <button type="button" onClick={onClose} className="cancel-button">
              {t("adminDormitoryEditModal.buttons.cancel")}
            </button>
          </div>
          {message && <div className="error-message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default AdminDormitoryEditModal;
