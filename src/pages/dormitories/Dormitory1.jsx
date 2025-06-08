// src/pages/DormitoryDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Dormitory.css";
import defaultDormImg from "../../assets/images/banner.png";
import { useI18n } from "../../i18n/I18nContext";

import IconLocation from "../../assets/icons/DormCardIconLocation.svg";
import IconPhone from "../../assets/icons/DormCardIconPhone.svg";
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
  const { lang, t } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();

  const [dorm, setDorm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`dorms/${id}/`);
        setDorm(data);
      } catch {
        setError(t("dormDetail.errorLoad"));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, t]);

  if (loading) return <p>{t("dormDetail.loading")}</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!dorm) return <p>{t("dormDetail.notFound")}</p>;

  const title = dorm[`name_${lang}`] || dorm.name_ru;
  const description =
    dorm[`description_${lang}`] ||
    dorm.description_ru ||
    t("dormDetail.defaultDescription");

  const images =
    dorm.images?.length > 0
      ? dorm.images.map((img) => img.image)
      : [defaultDormImg];

  const handlePrev = () =>
    setCarouselIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const handleNext = () =>
    setCarouselIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const mainInfo = [
    {
      icon: IconLocation,
      label: dorm.address || t("dormDetail.addressMissing")
    },
    {
      icon: IconPhone,
      label: dorm.phone || t("dormDetail.phoneMissing")
    },
    {
      icon: IconFloor,
      label: t("dormDetail.floors", { count: dorm.floors_count || "9" })
    },
    {
      icon: IconCost,
      label: t("dormDetail.cost", { cost: dorm.cost || "80000" })
    },
    {
      icon: IconBed,
      label: t("dormDetail.places", { count: dorm.total_places || "250" })
    }
  ];

  const amenitiesData = [
    "wifi",
    "canteen",
    "library",
    "gym",
    "laundry",
    "cleaning",
    "security"
  ].map((key) => ({
    icon: {
      wifi: IconWifi,
      canteen: IconCanteen,
      library: IconLibrary,
      gym: IconGym,
      laundry: IconLaundry,
      cleaning: IconCleaning,
      security: IconSecurity
    }[key],
    label: t(`dormDetail.amenities.${key}`)
  }));

  const dormAddress = dorm.address || title;
  const mapUrl = `https://yandex.kz/map-widget/v1/?text=${encodeURIComponent(
    dormAddress
  )}&z=17.19`;

  return (
    <div className="dormitory-page">
      <h1 className="dorm-title">{title}</h1>
      <p className="dorm-desc">{description}</p>

      <div className="dorm-carousel-wrapper">
        <button className="carousel-arrow left" onClick={handlePrev}>
          {t("dormDetail.leftArrow")}
        </button>
        <img
          src={images[carouselIndex]}
          alt={`dorm-${carouselIndex + 1}`}
          className="carousel-image"
          onError={(e) => (e.currentTarget.src = defaultDormImg)}
        />
        <button className="carousel-arrow right" onClick={handleNext}>
          {t("dormDetail.rightArrow")}
        </button>
      </div>

      <div className="carousel-dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === carouselIndex ? "active" : ""}`}
            onClick={() => setCarouselIndex(idx)}
          />
        ))}
      </div>

      <div className="dorm-info-section">
        <div className="dorm-info-card">
          <h3>{t("dormDetail.mainInfoTitle")}</h3>
          <ul className="info-list">
            {mainInfo.map((item, idx) => (
              <li key={idx} className="info-item">
                <img src={item.icon} alt="" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="dorm-info-card">
          <h3>{t("dormDetail.amenitiesTitle")}</h3>
          <div className="amenities-list">
            {amenitiesData.map((am, idx) => (
              <span key={idx} className="amenity-item">
                <img src={am.icon} alt={am.label} />
                <span>{am.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="apply-section">
        <h2>{t("dormDetail.applyTitle")}</h2>
        <button className="apply-btn" onClick={() => navigate("/create-application")}>
          {t("dormDetail.applyButton")}
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
          title={t("dormDetail.mapLabel", { address: dormAddress })}
          style={{
            borderRadius: 18,
            minHeight: 350,
            width: "100%",
            border: 0,
            display: "block"
          }}
        />
      </div>
    </div>
  );
};

export default DormitoryDetail;
