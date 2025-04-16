import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Dormitory.css";
import defaultDormImg from "../../assets/images/banner.png";

const DormitoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dorm, setDorm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDorm = async () => {
      try {
        const response = await api.get(`dorms/${id}/`);
        setDorm(response.data);
      } catch (err) {
        setError("Ошибка при загрузке данных общежития.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDorm();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!dorm) return <p>Общежитие не найдено.</p>;

  const dormImg =
    dorm.images && dorm.images.length > 0 ? dorm.images[0].image : defaultDormImg;

  const dormAddress = dorm.address ? dorm.address : dorm.name;
  const encodedAddress = encodeURIComponent(dormAddress);
  const mapUrl = `https://yandex.kz/map-widget/v1/?text=${encodedAddress}&z=17.19`;

  return (
    <div className="dormitory-page">
      <div className="dormitory-header">
        <div className="dormitory-info">
          <h1>{dorm.name}</h1>
          <p>
            <strong>Описание:</strong>{" "}
            {dorm.description ? dorm.description : "Описание отсутствует"}
          </p>
          <p>
            <strong>Стоимость за 10 месяцев:</strong> {dorm.cost} тг
          </p>
          <p>
            <strong>Количество мест:</strong> {dorm.total_places}
          </p>
          {dorm.address && (
            <p>
              <strong>Адрес:</strong> {dorm.address}
            </p>
          )}
        </div>
        <div className="dormitory-image">
          <img src={dormImg} alt={dorm.name} style={{ maxWidth: "400px" }} />
        </div>
      </div>
      <div className="map-container">
        <div style={{ position: "relative", overflow: "hidden" }}>
          <a
            href={`https://yandex.kz/maps/?text=${encodedAddress}&utm_medium=mapframe&utm_source=maps`}
            style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "0px" }}
          >
            {dormAddress}
          </a>
          <a
            href={`https://yandex.kz/maps/?text=${encodedAddress}&z=17.19&utm_medium=mapframe&utm_source=maps`}
            style={{ color: "#eee", fontSize: "12px", position: "absolute", top: "14px" }}
          >
            {dormAddress} — Яндекс Карты
          </a>
          <iframe
            src={mapUrl}
            width="560"
            height="400"
            frameBorder="1"
            allowFullScreen={true}
            loading="lazy"
            style={{ position: "relative" }}
            title={`Карта ${dormAddress}`}
          ></iframe>
        </div>
      </div>
      <button className="cancel-button" onClick={() => navigate("/admin/dormitories")}>
        Назад
      </button>
    </div>
  );
};

export default DormitoryDetail;
