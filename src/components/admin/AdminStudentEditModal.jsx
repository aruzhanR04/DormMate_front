// src/components/AdminStudentEditModal.jsx

import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminStudentEditModal = ({ student, onClose, onSaved }) => {
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
  });
  const [regions, setRegions] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!student) return;
    const regionId =
      student.region && typeof student.region === "object"
        ? student.region.id
        : student.region || "";
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
      region: regionId,
    });
  }, [student]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const resp = await api.get("/regions/");
        const data = resp.data.results || resp.data;
        setRegions(data);
      } catch (err) {
        console.error("Не удалось загрузить регионы:", err);
      }
    };
    fetchRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: name === "region" ? parseInt(value, 10) : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    try {
      const resp = await api.patch(`/students/${student.id}/`, formData);
      setMessage(t("adminStudentEditModal.messages.saveSuccess"));
      onSaved();
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
      } else {
        setMessage(t("adminStudentEditModal.messages.saveError"));
      }
    }
  };

  const renderFieldErrors = (field) =>
    errors[field]?.map((msg, i) => (
      <p key={i} className="error-message">
        {msg}
      </p>
    ));

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 500 }}>
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminStudentEditModal.close")}
        </button>
        <h2>{t("adminStudentEditModal.title")}</h2>
        <form className="form-container" onSubmit={handleSave}>
          {/* S */}
          <label>
            {t("adminStudentEditModal.labels.s")}
            <input type="text" name="s" value={formData.s} disabled />
          </label>

          {/* Text fields */}
          {[
            "first_name",
            "last_name",
            "middle_name",
            "email",
            "phone_number",
            "birth_date",
            "course",
          ].map((field) => (
            <label key={field}>
              {t(`adminStudentEditModal.labels.${field}`)}
              <input
                type={field === "birth_date" ? "date" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
              {renderFieldErrors(field)}
            </label>
          ))}

          {/* Region */}
          <label>
            {t("adminStudentEditModal.labels.region")}
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
            >
              <option value="">
                {t("adminStudentEditModal.regionPlaceholder")}
              </option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.region_name}
                </option>
              ))}
            </select>
            {renderFieldErrors("region")}
          </label>

          {/* Gender */}
          <label>
            {t("adminStudentEditModal.labels.gender")}
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              {Object.entries(t("adminStudentEditModal.genderOptions")).map(
                ([val, lbl]) => (
                  <option key={val} value={val}>
                    {lbl}
                  </option>
                )
              )}
            </select>
            {renderFieldErrors("gender")}
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              {t("adminStudentEditModal.buttons.cancel")}
            </button>
            <button type="submit" className="save-button">
              {t("adminStudentEditModal.buttons.save")}
            </button>
          </div>
        </form>
        {message && <div className="error-message">{message}</div>}
      </div>
    </div>
  );
};

export default AdminStudentEditModal;
