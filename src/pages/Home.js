import React from "react";
import { Link } from "react-router-dom"; // Импортируем Link
import "../styles/Home.css";
import BannerCarousel from "./BannerCarousel";
import img_12 from "../assets/img_12.jpeg";
import img_13 from "../assets/img_13.jpg";
import img_14 from "../assets/img_14.jpg";

const Home = () => {
  const dormitories = [
    {
      id: 1,
      title: "Дом студентов Narxoz Residence",
      address: "микрорайон 10",
      price: "80 000тг",
      description: "Современное общежитие с удобствами и отличной транспортной доступностью.",
      rooms: [2, 3, 4],
      img: img_12,
    },
    {
      id: 2,
      title: "Дом студентов №2 Б",
      address: "мкрн. Таугуль, 34",
      price: "46 000 тг.",
      description: "Общежитие для студентов с уютной атмосферой и развитой инфраструктурой.",
      rooms: [2, 3],
      img: img_13,
    },
    {
      id: 3,
      title: "Дом студентов №3",
      address: "мкрн 1-й., 81",
      price: "46 000 тг.",
      description: "Комфортное место проживания с доступом ко всем необходимым удобствам.",
      rooms: [3, 4],
      img: img_14,
    },
  ];

  return (
    <div className="home">
      <section className="block first-block">
        <BannerCarousel />
      </section>

      {dormitories.map((dorm) => (
        <section key={dorm.id} className="block second-block">
          <div className="content-wrapper">
            <div className="text-block">
              <h1>{dorm.title}</h1>
              <p>
                <span>Адрес: {dorm.address}</span>
                <br />
                <span>Проживание в месяц: {dorm.price}</span>
              </p>
              {/* Используем Link для перехода на страницу общежития */}
              <Link to={`/dormitory${dorm.id}`} className="detail-button">
                Подробнее
              </Link>
            </div>
            <div className="image-block">
              <img src={dorm.img} alt="Dormitory" />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;