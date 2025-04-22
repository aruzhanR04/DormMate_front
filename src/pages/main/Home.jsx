import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import "../../styles/Home.css";
import BannerCarousel from "../elements/BannerCarousel";
import defaultDormImg from "../../assets/images/banner.png";

const Home = () => {
  const [dormitories, setDormitories] = useState([]);

  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const response = await api.get("dorms/");
        const dormData = response.data.results ? response.data.results : response.data;
        setDormitories(dormData);
      } catch (error) {
        console.error("Ошибка при загрузке общаг:", error);
      }
    };

    fetchDormitories();
  }, []);

  return (
    <div className="home">
      <section className="block first-block">
        <BannerCarousel />
      </section>

      {/* Улучшенная кнопка "Полезное" */}
      <div className="useful-button-wrapper">
        <Link to="/guide" className="useful-button">
          Полезное для студентов
        </Link>
      </div>

      {/* Карточки общежитий без рамок и с чередующимися фонами */}
      {dormitories.map((dorm, index) => (
        <section
          key={dorm.id}
          className={`dorm-fullwidth ${index % 2 === 0 ? "bg-gray" : "bg-white"}`}
        >
          <div className="dorm-content">
            <div className="dorm-image">
              <img
                src={dorm.images?.[0]?.image || defaultDormImg}
                alt={dorm.name}
              />
            </div>
            <div className="dorm-info">
              <h2>{dorm.name}</h2>
              <p>Стоимость: <strong>{dorm.cost} тг</strong></p>
              <p>Адрес: {dorm.address}</p>
              <Link to={`/dormitory/${dorm.id}`} className="dorm-more-button">
                Подробнее
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
