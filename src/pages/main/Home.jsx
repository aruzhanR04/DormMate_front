// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Home.css";
import faqImage from "../../assets/images/faq.png";
import defaultDormImg from "../../assets/images/banner.png";
import { useI18n } from "../../i18n/I18nContext";

import DormCardIconCanteen from "../../assets/icons/DormCardIconCanteen.svg";
import DormCardIconBed from "../../assets/icons/DormCardIconBed.svg";
import DormCardIconLaundry from "../../assets/icons/DormCardIconLaundry.svg";
import bannerImage from "../../assets/images/banner.png";

const Home = () => {
  const { lang, t } = useI18n();
  const [dormitories, setDormitories] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get("dorms/");
        setDormitories(resp.data.results || resp.data);
      } catch (e) {
        console.error("Ошибка при загрузке общежитий:", e);
      }
    })();
    (async () => {
      try {
        const resp = await api.get("global-settings/");
        setPdfUrl(resp.data.student_home_pdf || "");
      } catch (e) {
        console.error("Ошибка при загрузке PDF:", e);
      }
    })();
  }, []);

  return (
    <div className="home">
      <section className="banner">
        <img
          src={bannerImage}
          alt={t("home.bannerAlt")}
          className="banner-img"
        />
      </section>

      <section className="dorm-section">
        <h2 className="section-title">
          {t("home.dormSectionTitle")}
        </h2>
        <div className="dorm-list">
          {dormitories.map((dorm) => {
            // выбираем название и описание по языку, с запасом на russian
            const title =
              dorm[`name_${lang}`] || dorm.name_ru || "";
            const description =
              dorm[`description_${lang}`] ||
              dorm.description_ru ||
              t("home.defaultDormDescription");

            const imageUrl =
              dorm.first_image ||
              dorm.images?.[0]?.image ||
              defaultDormImg;

            return (
              <div key={dorm.id} className="dorm-card">
                <img
                  src={imageUrl}
                  alt={title}
                  className="dorm-img"
                  onError={(e) => {
                    e.currentTarget.src = defaultDormImg;
                  }}
                />
                <h3 className="dorm-name">{title}</h3>
                <p className="dorm-description">
                  {description}
                </p>
                <div className="dorm-icons">
                  <span className="dorm-icon-item">
                    <img src={DormCardIconBed} alt="" />{" "}
                    {t("home.iconBed", {
                      count: dorm.total_places
                    })}
                  </span>
                  <span className="dorm-icon-item">
                    <img src={DormCardIconCanteen} alt="" />{" "}
                    {t("home.iconCanteen")}
                  </span>
                  <span className="dorm-icon-item">
                    <img src={DormCardIconLaundry} alt="" />{" "}
                    {t("home.iconLaundry")}
                  </span>
                </div>
                <Link
                  to={`/dormitory/${dorm.id}`}
                  className="more-btn"
                >
                  {t("home.moreButton")}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="faq-section">
        <h2 className="faq-title">
          {t("home.faqTitle")}
        </h2>
        <div className="faq-wrapper">
          <div className="faq-image-wrapper">
            <img
              src={faqImage}
              alt={t("home.faqTitle")}
              className="faq-image"
            />
          </div>
          <div className="faq-accordion">
            {t("home.faq").map((item, idx) => (
              <details key={idx}>
                <summary>{item.question}</summary>
                <p style={{textAlign:"left"}}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {pdfUrl && (
          <div className="download-pdf">
            <p>{t("home.downloadText")}</p>
            <a
              href={pdfUrl}
              download
              className="download-button"
            >
              {t("home.downloadButton")}
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
