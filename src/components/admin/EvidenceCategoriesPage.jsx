import React, { useEffect, useState } from "react";
import api from "../../api";

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
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-[#C32939] mb-6">Категории справок</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Название</th>
              <th className="border px-4 py-2">Код</th>
              <th className="border px-4 py-2">Тип данных</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {evidenceTypes.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">{type.id}</td>
                <td className="border px-4 py-2">{type.name}</td>
                <td className="border px-4 py-2">{type.code}</td>
                <td className="border px-4 py-2">{type.data_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Добавить категорию</h3>
        <form>
          <input
            type="text"
            placeholder="Название"
            className="border px-4 py-2 rounded w-full mb-3 focus:outline-none focus:ring focus:border-blue-300"
          />
          <input
            type="text"
            placeholder="Код"
            className="border px-4 py-2 rounded w-full mb-3 focus:outline-none focus:ring focus:border-blue-300"
          />
          <select className="border px-4 py-2 rounded w-full mb-4 focus:outline-none focus:ring focus:border-blue-300">
            <option value="file">Файл</option>
            <option value="numeric">Число</option>
          </select>
          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
          >
            Добавить
          </button>
        </form>
      </div>
    </div>
  );
};

export default EvidenceCategoriesPage;
