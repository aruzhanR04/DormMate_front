import React, { useEffect, useState } from "react";
import api from "../../api";
import AdminSidebar from "../admin/AdminSidebar";
import "../../styles/AdminFormShared.css"; 

const EvidenceCategoriesPage = () => {
  const [evidenceTypes, setEvidenceTypes] = useState([]);

  useEffect(() => {
    const fetchEvidenceTypes = async () => {
      try {
        const res = await api.get("evidence-types/");
        setEvidenceTypes(res.data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };
    fetchEvidenceTypes();
  }, []);

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <h2 className="text-3xl font-bold text-[#C32939] mb-6">Категории справок</h2>

        <div className="dormitories-table-container">
          <table className="dormitories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Код</th>
                <th>Тип данных</th>
              </tr>
            </thead>
            <tbody>
              {evidenceTypes.map((type) => (
                <tr key={type.id}>
                  <td>{type.id}</td>
                  <td>{type.name}</td>
                  <td>{type.code}</td>
                  <td>{type.data_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-form-container" style={{ marginTop: "40px" }}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Добавить категорию</h3>
          <form className="form-container">
            <label>
              Название:
              <input
                type="text"
                name="name"
                placeholder="Название"
              />
            </label>
            <label>
              Код:
              <input
                type="text"
                name="code"
                placeholder="Код"
              />
            </label>
            <label>
              Тип данных:
              <select name="data_type">
                <option value="file">Файл</option>
                <option value="numeric">Число</option>
              </select>
            </label>
            <div className="form-actions">
              <button type="button" className="save-button">
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvidenceCategoriesPage;
