import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Dormitory.css";
import defaultDormImg from "../../assets/images/banner.png";
import Footer from "../../components/common/footer.jsx";

import IconLocation from "../../assets/icons/DormCardIconLocation.svg";
import IconPhone from "../../assets/icons/DormCardIconPhone.svg";
import IconManager from "../../assets/icons/DormCardIconManager.svg";
import IconType from "../../assets/icons/DormCardIconDorm.svg";
import IconYear from "../../assets/icons/DormCardIconYear.svg";
import IconFloor from "../../assets/icons/DormCardIconFloor.svg";
import IconCost from "../../assets/icons/DormCardIconCost.svg";
import IconBed from "../../assets/icons/DormCardIconBed.svg";
import IconWifi from "../../assets/icons/DormCardIconWifi.svg";
import IconCanteen from "../../assets/icons/DormCardIconCanteen.svg";
import IconLibrary from "../../assets/icons/DormCardIconLibrary.svg";
import IconGym from "../../assets/icons/DormCardIconGym.svg";
import IconLaundry from "../../assets/icons/DormCardIconLaundry.svg";
import IconCleaning from "../../assets/icons/DormCardIconCleaning.svg";
import IconSecurity from "../../assets/icons/DormCardIconSecurity.svg";

const DormitoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dorm, setDorm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const images =
    dorm.images && dorm.images.length > 0
      ? dorm.images.map((img) => img.image)
      : [defaultDormImg];

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const mainInfo = [
    { icon: IconLocation, label: dorm.address || "Адрес отсутствует" },
    { icon: IconPhone, label: dorm.phone || "+7 (777) 77-77-777" },
    { icon: IconManager, label: `Комендант: ${dorm.manager || "Не указан"}` },
    { icon: IconType, label: `Тип: ${dorm.dorm_type || "Коридорный"}` },
    { icon: IconYear, label: `Год постройки: ${dorm.year_built || "2024"}` },
    { icon: IconFloor, label: `Этажей: ${dorm.floors || "9"}` },
    { icon: IconCost, label: `${dorm.cost || "80000"} тг` },
    { icon: IconBed, label: `${dorm.total_places || "250"} мест` },
  ];

  const amenities = [
    { icon: IconWifi, label: "Wi‑Fi" },
    { icon: IconCanteen, label: "Столовая" },
    { icon: IconLibrary, label: "Библиотека" },
    { icon: IconGym, label: "Спортзал" },
    { icon: IconLaundry, label: "Прачечная" },
    { icon: IconCleaning, label: "Уборка" },
    { icon: IconSecurity, label: "Охрана" },
  ];

  const dormAddress = dorm.address ? dorm.address : dorm.name;
  const encodedAddress = encodeURIComponent(dormAddress);
  const mapUrl = `https://yandex.kz/map-widget/v1/?text=${encodedAddress}&z=17.19`;

  return (
    <div className="dormitory-page">
      <h1 className="dorm-title">{dorm.name}</h1>
      <p className="dorm-desc">
        {dorm.description ||
          "Традиционное студенческое общежитие коридорного типа, расположенное в непосредственной близости от главного учебного корпуса университета."}
      </p>

      <div className="dorm-carousel">
        <button className="carousel-arrow left" onClick={handlePrev}>
          &#60;
        </button>
        <img
          src={images[carouselIndex]}
          alt={`dorm-${carouselIndex + 1}`}
          className="carousel-image"
        />
        <button className="carousel-arrow right" onClick={handleNext}>
          &#62;
        </button>
      </div>
      <div className="carousel-dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === carouselIndex ? "active" : ""}`}
            onClick={() => setCarouselIndex(idx)}
          ></span>
        ))}
      </div>

      <div className="dorm-info-section">
        <div className="dorm-info-card">
          <h3>Основная информация</h3>
          <ul className="info-list">
            {mainInfo.map((item, idx) => (
              <li key={idx}>
                <img src={item.icon} alt="" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="dorm-info-card">
          <h3>Удобства</h3>
          <div className="amenities-list">
            {amenities.map((am, idx) => (
              <span key={idx} className="amenity">
                <img src={am.icon} alt={am.label} /> {am.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="apply-section">
        <h2>Подайте заявку прямо сейчас</h2>
        <button className="apply-btn" onClick={() => navigate("/application")}>
          Подать заявку
        </button>
      </div>

      <div className="map-block">
        <iframe
          src={mapUrl}
          width="100%"
          height="420"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          title={`Карта ${dormAddress}`}
          style={{
            borderRadius: 18,
            minHeight: 350,
            width: "100%",
            border: "0",
            display: "block",
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default DormitoryDetail;
