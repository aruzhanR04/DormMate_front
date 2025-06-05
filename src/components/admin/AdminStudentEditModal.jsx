// src/components/admin/AdminStudentEditModal.jsx

import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/AdminFormShared.css";

const AdminStudentEditModal = ({ student, onClose, onSaved }) => {
  // 1) Инициализируем формдата, включая region как ID (число)
  const [formData, setFormData] = useState({
    s: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    birth_date: "",
    phone_number: "",
    gender: "",
    course: "",
    region: "",    // здесь будет числовой ID региона
  });

  const [regions, setRegions] = useState([]);
  const [errors, setErrors] = useState({}); // { fieldName: [ "msg1", "msg2" ], ... }
  const [message, setMessage] = useState("");

  // 2) При получении нового student сразу заполняем formData
  useEffect(() => {
    if (!student) return;

    // Если student.region — объект { id, region_name }, возьмём .id, иначе сам числовой ID
    let regionId = "";
    if (student.region != null) {
      regionId =
        typeof student.region === "object" ? student.region.id : student.region;
    }

    setFormData({
      s: student.s || "",
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      middle_name: student.middle_name || "",
      email: student.email || "",
      birth_date: student.birth_date || "",
      phone_number: student.phone_number || "",
      gender: student.gender || "",
      course: student.course || "",
      region: regionId || "",
    });
  }, [student]);

  // 3) Загружаем список регионов для селекта
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await api.get("/regions/");
        // Берём или response.data.results, или сразу response.data, в зависимости от того, как API рендерит
        const data = response.data.results || response.data;
        setRegions(data);
      } catch (err) {
        console.error("Не удалось загрузить регионы:", err);
      }
    };
    fetchRegions();
  }, []);

  // 4) Обработчик изменения любого поля формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Если это селект region, конвертируем в число
      [name]: name === "region" ? parseInt(value, 10) : value,
    }));
  };

  // 5) Когда нажали «Сохранить», отправляем PUT и ловим ошибки
  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      // formData содержит field region как число (ID), остальные поля — строки
      const response = await api.patch(`/students/${student.id}/`, formData);

      // Если статус 200/201, считаем, что всё успешно
      if (response.status === 200 || response.status === 201) {
        setMessage("Данные успешно сохранены.");
        onSaved(); // Передаём сигнал родителю, чтобы он обновил список и закрыл модалку
      }
    } catch (error) {
      // Если сервер вернул валидационные ошибки (status=400), error.response.data будет содержать подробности
      if (error.response && error.response.status === 400) {
        console.error("Validation errors:", error.response.data);
        setErrors(error.response.data);
      } else {
        console.error("Ошибка при PUT /students/:id:", error);
        setMessage("Произошла ошибка при сохранении данных.");
      }
    }
  };

  // Вспомогательная функция: если errors[field] — массив, выводим каждый <p>
  const renderFieldErrors = (fieldName) => {
    if (!errors[fieldName]) return null;
    return errors[fieldName].map((msg, idx) => (
      <p key={idx} className="error-message">
        {msg}
      </p>
    ));
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 500 }}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Редактирование студента</h2>

        <form className="form-container" onSubmit={handleSave}>
          {/* S (идентификатор) – только для просмотра */}
          <label>
            S:
            <input
              type="text"
              name="s"
              value={formData.s}
              disabled
            />
          </label>

          {/* Имя */}
          <label>
            Имя:
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            {renderFieldErrors("first_name")}
          </label>

          {/* Фамилия */}
          <label>
            Фамилия:
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            {renderFieldErrors("last_name")}
          </label>

          {/* Отчество */}
          <label>
            Отчество:
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
            />
            {renderFieldErrors("middle_name")}
          </label>

          {/* Email */}
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {renderFieldErrors("email")}
          </label>

          {/* Телефон */}
          <label>
            Телефон:
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
            {renderFieldErrors("phone_number")}
          </label>

          {/* Дата рождения */}
          <label>
            Дата рождения:
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
            {renderFieldErrors("birth_date")}
          </label>

          {/* Курс */}
          <label>
            Курс:
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
            />
            {renderFieldErrors("course")}
          </label>

          {/* Область (селект) */}
          <label>
            Область:
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
            >
              <option value="">Выберите регион</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.region_name}
                </option>
              ))}
            </select>
            {renderFieldErrors("region")}
          </label>

          {/* Пол */}
          <label>
            Пол:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Выберите</option>
              <option value="M">М</option>
              <option value="F">Ж</option>
            </select>
            {renderFieldErrors("gender")}
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="save-button">
              Сохранить
            </button>
          </div>
        </form>

        {/* Если есть общее сообщение об успехе/ошибке, показываем его здесь */}
        {message && <div className="error-message">{message}</div>}
      </div>
    </div>
  );
};

export default AdminStudentEditModal;
