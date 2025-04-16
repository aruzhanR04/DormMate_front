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

      {dormitories.map((dorm) => (
        <section key={dorm.id} className="block second-block">
          <div className="content-wrapper">
            <div className="text-block">
              <h1>{dorm.name}</h1>
              <p>
                <span>Стоимость: {dorm.cost} тг</span>
                <br />
                <span>Адрес: {dorm.address}</span>
                <br />
              </p>
              <Link to={`/dormitory/${dorm.id}`} className="detail-button">
                Подробнее
              </Link>
            </div>
            <div className="image-block">
              <img
                src={
                  dorm.images && dorm.images.length > 0
                    ? dorm.images[0].image
                    : defaultDormImg
                }
                alt="Dormitory"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
