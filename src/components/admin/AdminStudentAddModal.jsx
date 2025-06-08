// src/components/AdminStudentAddModal.jsx

import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminStudentAddModal = ({ onClose, onSaved }) => {
  const { t } = useI18n();

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
    region: "",
    password: "",
  });
  const [regions, setRegions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await api.get("/regions/");
        const data = response.data.results || response.data;
        setRegions(data);
      } catch (err) {
        console.error("Не удалось загрузить список регионов", err);
      }
    };
    fetchRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "region" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const payload = { ...formData, s: String(formData.s) };
    try {
      const response = await api.post("/students/", payload);
      if (response.status === 201 || response.status === 200) {
        onSaved();
      }
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        console.error("Ошибка при добавлении студента", error);
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 500 }}>
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminStudentAddModal.close")}
        </button>
        <h2>{t("adminStudentAddModal.title")}</h2>
        <form onSubmit={handleSubmit} className="form-container">
          {[
            "s",
            "first_name",
            "last_name",
            "middle_name",
            "email",
            "birth_date",
            "phone_number",
            "course",
            "password",
          ].map((field) => (
            <label key={field}>
              {t(`adminStudentAddModal.labels.${field}`)}
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "birth_date"
                    ? "date"
                    : field === "password"
                    ? "password"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required={
                  ["s", "first_name", "last_name", "email", "gender", "course", "region", "password"].includes(
                    field
                  )
                }
              />
              {errors[field] && <p className="error-message">{errors[field]}</p>}
            </label>
          ))}

          <label>
            {t("adminStudentAddModal.labels.gender")}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              {Object.entries(t("adminStudentAddModal.genderOptions")).map(
                ([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                )
              )}
            </select>
            {errors.gender && <p className="error-message">{errors.gender}</p>}
          </label>

          <label>
            {t("adminStudentAddModal.labels.region")}
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            >
              <option value="">{t("adminStudentAddModal.regionPlaceholder")}</option>
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.region_name}
                </option>
              ))}
            </select>
            {errors.region && <p className="error-message">{errors.region}</p>}
          </label>

          <div className="form-actions">
            <button type="submit" className="save-button">
              {t("adminStudentAddModal.buttons.save")}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              {t("adminStudentAddModal.buttons.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminStudentAddModal;
