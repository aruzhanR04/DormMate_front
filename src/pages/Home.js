import React from "react";
import "../styles/Home.css";
import BannerCarousel from "./BannerCarousel";
import img_2 from "../assets/img_2.jpg";
import img_5 from "../assets/img_5.jpg";

const Home = () => {
  return (
    <div className="home">
      <section className="block first-block">
        <BannerCarousel />
      </section>

      <section className="block second-block">
        <div className="content-wrapper">
          <div className="text-block">
            <h1>Комфортное проживание</h1>
            <p>
              Наши общежития — это уютные комнаты, которые созданы для вашего
              удобства. Просторный коворкинг станет идеальным местом для учебы
              и работы, а современная инфраструктура помогает каждому чувствовать
              себя как дома.
            </p>
            <button className="detail-button">Подробнее</button>
          </div>
          <div className="image-block">
            <img src={img_2} alt="Комфортное проживание" />
          </div>
        </div>
      </section>

      <section className="block third-block">
        <div className="content-wrapper">
          <div className="text-block">
            <h1>Кухни и прачечные</h1>
            <p>
              В наших общежитиях предусмотрены просторные кухни с современным
              оборудованием и удобные прачечные, чтобы вы могли сосредоточиться
              на учебе и отдыхе.
            </p>
            <button className="detail-button">Подробнее</button>
          </div>
          <div className="image-block">
            <img src={img_5} alt="Кухни и прачечные" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
