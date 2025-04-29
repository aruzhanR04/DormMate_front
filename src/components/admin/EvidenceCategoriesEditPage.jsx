import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import api from "../../api";
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminFormShared.css";

const EvidenceEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [keywords, setKeywords] = useState([]);
  const [evidence, setEvidence] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    data_type: "file",
    priority: 0,
    auto_fill_field: "",
    keywords: []
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // загрузка одного EvidenceType и списка ключевых слов
  useEffect(() => {
    const fetch = async () => {
      try {
        const [resEvi, resKw] = await Promise.all([
          api.get(`/evidence-types/${id}/`),
          api.get("/keywords/")
        ]);
        setEvidence(resEvi.data);
        setFormData({
          name:           resEvi.data.name           || "",
          code:           resEvi.data.code           || "",
          data_type:      resEvi.data.data_type      || "file",
          priority:       resEvi.data.priority       ?? 0,
          auto_fill_field:resEvi.data.auto_fill_field|| "",
          keywords:       Array.isArray(resEvi.data.keywords) ? resEvi.data.keywords : []
        });
        const kw = Array.isArray(resKw.data)
          ? resKw.data
          : resKw.data.results || [];
        setKeywords(kw);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setMessage("Не удалось загрузить данные категории.");
      }
    };
    fetch();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const keywordOptions = keywords.map(k => ({ value: k.id, label: k.keyword }));
  const selectedKeywordOptions = keywordOptions.filter(opt =>
    formData.keywords.includes(opt.value)
  );

  const handleKeywordSelect = selected => {
    setFormData(fd => ({
      ...fd,
      keywords: selected ? selected.map(o => o.value) : []
    }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    try {
      await api.put(`/evidence-types/${id}/`, formData);
      setMessage("Категория успешно сохранена.");
      navigate("/admin/evidence-types");
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setMessage("Ошибка при сохранении категории.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/evidence-types");
  };

  if (!evidence) {
    return (
      <div className="admin-page-container">
        <AdminSidebar />
        <div className="content-area">
          <p>Загрузка...</p>
          {message && <p className="error-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="admin-form-container">
          <h2>Редактирование категории справок</h2>
          {message && (
            <div className={`message ${Object.keys(errors).length ? "error" : "success"}`}>
              {message}
            </div>
          )}
          <form className="form-container" onSubmit={handleSave}>
            <label>
              Название:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </label>
            <label>
              Код:
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
              />
              {errors.code && <p className="error-message">{errors.code}</p>}
            </label>
            <label>
              Тип данных:
              <select
                name="data_type"
                value={formData.data_type}
                onChange={handleChange}
              >
                <option value="file">Файл</option>
                <option value="numeric">Число</option>
              </select>
              {errors.data_type && <p className="error-message">{errors.data_type}</p>}
            </label>
            <label>
              Приоритет:
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              />
              {errors.priority && <p className="error-message">{errors.priority}</p>}
            </label>
            <label>
              Автозаполнение:
              <input
                type="text"
                name="auto_fill_field"
                value={formData.auto_fill_field}
                onChange={handleChange}
              />
              {errors.auto_fill_field && (
                <p className="error-message">{errors.auto_fill_field}</p>
              )}
            </label>
            <label>
              Ключевые слова:
              <Select
                options={keywordOptions}
                isMulti
                closeMenuOnSelect={false}
                value={selectedKeywordOptions}
                onChange={handleKeywordSelect}
                placeholder="Выберите ключевые слова…"
              />
              {errors.keywords && <p className="error-message">{errors.keywords}</p>}
            </label>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Отмена
              </button>
              <button type="submit" className="save-button">
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvidenceEditPage;
