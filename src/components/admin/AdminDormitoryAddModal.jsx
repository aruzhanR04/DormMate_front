// src/components/AdminDormitoryAddModal.jsx
import React, { useState } from "react";
import api from "../../api";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminDormitoryAddModal = ({ onClose }) => {
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
  const [rooms, setRooms] = useState([{ number: "", capacity: "" }]);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleChangeDorm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeRoom = (idx, e) => {
    const { name, value } = e.target;
    setRooms((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [name]: value };
      return updated;
    });
  };

  const handleAddRoom = () => {
    setRooms((prev) => [...prev, { number: "", capacity: "" }]);
  };

  const handleRemoveRoom = (idx) => {
    setRooms((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation: require all name_* and address, total_places, cost
    if (
      !formData.name_ru ||
      !formData.name_kk ||
      !formData.name_en ||
      !formData.address ||
      !formData.total_places ||
      !formData.cost
    ) {
      setMessage(t("adminDormitoryAddModal.messages.fillDorm"));
      return;
    }
    // require all descriptions
    if (
      !formData.description_ru ||
      !formData.description_kk ||
      !formData.description_en
    ) {
      setMessage(t("adminDormitoryAddModal.messages.fillDescription"));
      return;
    }
    // rooms validation
    if (rooms.some((r) => !r.number || !r.capacity)) {
      setMessage(t("adminDormitoryAddModal.messages.fillRooms"));
      return;
    }

    try {
      const { data: createdDorm } = await api.post("dorms/", {
        ...formData
      });

      // Create rooms
      for (const room of rooms) {
        await api.post("rooms/", {
          dorm: createdDorm.id,
          number: room.number,
          capacity: room.capacity
        });
      }

      // Upload images
      for (const file of images) {
        const fd = new FormData();
        fd.append("dorm", createdDorm.id);
        fd.append("image", file);
        await api.post("dorm-images/", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setMessage(t("adminDormitoryAddModal.messages.success"));
      setTimeout(onClose, 900);
    } catch {
      setMessage(t("adminDormitoryAddModal.messages.error"));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminDormitoryAddModal.close")}
        </button>
        <h2>{t("adminDormitoryAddModal.title")}</h2>
        <form onSubmit={handleSubmit} className="form-container">
          {/* Names in three languages */}
          <label>
            {t("adminDormitoryAddModal.labels.name_ru")}
            <input
              type="text"
              name="name_ru"
              value={formData.name_ru}
              onChange={handleChangeDorm}
              required
            />
          </label>
          <label>
            {t("adminDormitoryAddModal.labels.name_kk")}
            <input
              type="text"
              name="name_kk"
              value={formData.name_kk}
              onChange={handleChangeDorm}
              required
            />
          </label>
          <label>
            {t("adminDormitoryAddModal.labels.name_en")}
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChangeDorm}
              required
            />
          </label>

          {/* Address, total places, cost */}
          <label>
            {t("adminDormitoryAddModal.labels.address")}
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChangeDorm}
              required
            />
          </label>
          <label>
            {t("adminDormitoryAddModal.labels.total_places")}
            <input
              type="number"
              name="total_places"
              value={formData.total_places}
              onChange={handleChangeDorm}
              required
            />
          </label>
          <label>
            {t("adminDormitoryAddModal.labels.cost")}
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChangeDorm}
              required
            />
          </label>

          {/* Descriptions in three languages */}
          <label>
            {t("adminDormitoryAddModal.labels.description_ru")}
            <textarea
              name="description_ru"
              value={formData.description_ru}
              onChange={handleChangeDorm}
              rows={2}
            />
          </label>
          <label>
            {t("adminDormitoryAddModal.labels.description_kk")}
            <textarea
              name="description_kk"
              value={formData.description_kk}
              onChange={handleChangeDorm}
              rows={2}
            />
          </label>
          <label>
            {t("adminDormitoryAddModal.labels.description_en")}
            <textarea
              name="description_en"
              value={formData.description_en}
              onChange={handleChangeDorm}
              rows={2}
            />
          </label>

          {/* Photos */}
          <hr style={{ margin: "20px 0" }} />
          <h3>{t("adminDormitoryAddModal.labels.photosSection")}</h3>
          <label>
            {t("adminDormitoryAddModal.labels.images")}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          {images.length > 0 && (
            <ul style={{ marginTop: 10, paddingLeft: 20 }}>
              {images.map((file, idx) => (
                <li
                  key={idx}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  {file.name}
                  <button
                    type="button"
                    title={t("adminDormitoryAddModal.buttons.removeFile")}
                    onClick={() => handleRemoveFile(idx)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#c00",
                      cursor: "pointer"
                    }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Rooms */}
          <hr style={{ margin: "20px 0" }} />
          <h3>{t("adminDormitoryAddModal.labels.roomsSection")}</h3>
          {rooms.map((room, idx) => (
            <div key={idx} className="room-row">
              <div className="room-field">
                <label>
                  {t("adminDormitoryAddModal.labels.room_number")}
                  <input
                    type="text"
                    name="number"
                    value={room.number}
                    placeholder={t(
                      "adminDormitoryAddModal.placeholders.room_number"
                    )}
                    onChange={(e) => handleChangeRoom(idx, e)}
                    required
                  />
                </label>
              </div>
              <div className="room-field">
                <label>
                  {t("adminDormitoryAddModal.labels.room_capacity")}
                  <input
                    type="number"
                    name="capacity"
                    value={room.capacity}
                    placeholder={t(
                      "adminDormitoryAddModal.placeholders.room_capacity"
                    )}
                    onChange={(e) => handleChangeRoom(idx, e)}
                    required
                  />
                </label>
              </div>
              <button
                type="button"
                className="room-remove-btn"
                title={t("adminDormitoryAddModal.buttons.removeRoom")}
                onClick={() => handleRemoveRoom(idx)}
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
            {t("adminDormitoryAddModal.buttons.addRoom")}
          </button>

          {/* Actions */}
          <hr style={{ margin: "20px 0" }} />
          <div className="form-actions" style={{ gap: 10 }}>
            <button type="submit" className="save-button">
              {t("adminDormitoryAddModal.buttons.save")}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              {t("adminDormitoryAddModal.buttons.cancel")}
            </button>
          </div>
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
