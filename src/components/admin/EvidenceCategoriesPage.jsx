import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import "../../styles/AdminFormShared.css";
import cicon from '../../assets/icons/cicon.png';

const EvidenceCategoriesPage = () => {
  const navigate = useNavigate();
  const [evidenceTypes, setEvidenceTypes] = useState([]);
  const [keywords, setKeywords] = useState([]);
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

  // Модалка для редактирования ключевых слов
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [editedKeyword, setEditedKeyword] = useState("");

  // загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTypes, resKeywords] = await Promise.all([
          api.get("/evidence-types/"),
          api.get("/keywords/")
        ]);
        setEvidenceTypes(Array.isArray(resTypes.data) ? resTypes.data : resTypes.data.results || []);
        setKeywords(Array.isArray(resKeywords.data) ? resKeywords.data : resKeywords.data.results || []);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setMessage("Ошибка при загрузке данных");
      }
    };
    fetchData();
  }, []);

  // Обработка обычных инпутов
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // Обработка выбора ключевых слов
  const handleKeywordSelect = selectedOptions => {
    setFormData(fd => ({
      ...fd,
      keywords: selectedOptions ? selectedOptions.map(o => o.value) : []
    }));
  };

  // Добавление новой категории
  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    try {
      await api.post("/evidence-types/", formData);
      setMessage("Категория успешно добавлена");
      const res = await api.get("/evidence-types/");
      setEvidenceTypes(Array.isArray(res.data) ? res.data : res.data.results || []);
      setFormData({
        name: "",
        code: "",
        data_type: "file",
        priority: 0,
        auto_fill_field: "",
        keywords: []
      });
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        console.error(err);
        setMessage("Ошибка при добавлении категории");
      }
    }
  };

  const handleDeleteCategory = async (type) => {
    if (!window.confirm(`Точно удалить категорию "${type.name}"?`)) return;
    try {
      await api.delete(`/evidence-types/${type.id}/`);
      setEvidenceTypes(prev => prev.filter(t => t.id !== type.id));
      setMessage(`Категория "${type.name}" удалена`);
    } catch (err) {
      console.error("Ошибка при удалении категории:", err);
      setMessage("Не удалось удалить категорию");
    }
  };

  const handleDeleteKeyword = async (keyword) => {
    if (!window.confirm(`Точно удалить ключевое слово "${keyword.keyword}"?`)) return;
    try {
      await api.delete(`/keywords/${keyword.id}/`);
      setKeywords(prev => prev.filter(k => k.id !== keyword.id));
      setMessage(`Ключевое слово "${keyword.keyword}" удалено`);
    } catch (err) {
      console.error("Ошибка при удалении ключевого слова:", err);
      setMessage("Не удалось удалить ключевое слово");
    }
  };

  // Открыть модалку редактирования
  const openEditKeywordModal = (keyword) => {
    setEditingKeyword(keyword);
    setEditedKeyword(keyword.keyword);
    setIsKeywordModalOpen(true);
  };

  // Сохранить изменения ключевого слова
  const handleSaveEditedKeyword = async () => {
    try {
      await api.patch(`/keywords/${editingKeyword.id}/`, { keyword: editedKeyword });
      setKeywords(prev =>
        prev.map(k => (k.id === editingKeyword.id ? { ...k, keyword: editedKeyword } : k))
      );
      setMessage("Ключевое слово обновлено");
      setIsKeywordModalOpen(false);
    } catch (err) {
      console.error("Ошибка при обновлении ключевого слова:", err);
      setMessage("Не удалось обновить ключевое слово");
    }
  };

  // Опции для select
  const keywordOptions = keywords.map(k => ({
    value: k.id,
    label: k.keyword
  }));

  const selectedKeywordOptions = keywordOptions.filter(opt =>
    formData.keywords.includes(opt.value)
  );

  const renderKeywordNames = ids => {
    if (!Array.isArray(ids) || ids.length === 0) return "-";
    return ids
      .map(id => {
        const kw = keywords.find(k => k.id === id);
        return kw ? kw.keyword : id;
      })
      .join(", ");
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h2 className="text-3xl font-bold text-[#C32939] mb-6">Категории справок</h2>

        {message && (
          <div className={`message ${Object.keys(errors).length ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="dormitories-table-container">
          <table className="dormitories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Код</th>
                <th>Тип данных</th>
                <th>Приоритет</th>
                <th>Автозаполнение</th>
                <th>Ключевые слова</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {evidenceTypes.map(type => (
                <tr key={type.id}>
                  <td>{type.id}</td>
                  <td>{type.name}</td>
                  <td>{type.code}</td>
                  <td>{type.data_type}</td>
                  <td>{type.priority}</td>
                  <td>{type.auto_fill_field || "-"}</td>
                  <td>{renderKeywordNames(type.keywords)}</td>
                  <td>
                    <button
                      className="operation-icon delete-icon"
                      onClick={() => handleDeleteCategory(type)}
                    >
                      🗑️
                    </button>
                    <img
                      src={cicon}
                      alt="Редактировать"
                      className="operation-icon"
                      onClick={() => navigate(`/admin/evidence-types/edit/${type.id}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dormitories-table-container" style={{ marginTop: 40 }}>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ключевые слова</h3>
          <table className="dormitories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ключевое слово</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map(keyword => (
                <tr key={keyword.id}>
                  <td>{keyword.id}</td>
                  <td>{keyword.keyword}</td>
                  <td>
                    <button
                      className="operation-icon delete-icon"
                      onClick={() => handleDeleteKeyword(keyword)}
                    >
                      🗑️
                    </button>
                    <img
                      src={cicon}
                      alt="Редактировать"
                      className="operation-icon"
                      onClick={() => openEditKeywordModal(keyword)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-form-container" style={{ marginTop: 40 }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Добавить категорию</h3>
          <form className="form-container" onSubmit={handleSubmit}>
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
                required
              >
                <option value="file">Файл</option>
                <option value="numeric">Числовое значение</option>
              </select>
            </label>

            <label>
              Приоритет:
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
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
            </label>

            <label>
              Ключевые слова:
              <Select
                options={keywordOptions}
                isMulti
                value={selectedKeywordOptions}
                onChange={handleKeywordSelect}
              />
            </label>

            <button type="submit" className="submit-btn">
              Добавить категорию
            </button>
          </form>
        </div>

        {/* МОДАЛКА редактирования ключевого слова */}
        {isKeywordModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="text-xl font-bold mb-4">Редактировать ключевое слово</h3>
              <input
                type="text"
                value={editedKeyword}
                onChange={(e) => setEditedKeyword(e.target.value)}
                className="input"
              />
              <div className="modal-actions">
                <button className="submit-btn" onClick={handleSaveEditedKeyword}>
                  Сохранить
                </button>
                <button className="cancel-btn" onClick={() => setIsKeywordModalOpen(false)}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceCategoriesPage;