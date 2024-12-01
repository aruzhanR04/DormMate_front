import React from "react";
import "../styles/Home.css";
import BannerCarousel from "./BannerCarousel";
import img_12 from "../assets/img_12.jpeg";
import img_13 from "../assets/img_13.jpg";
import img_14 from "../assets/img_14.jpg";
import img_15 from "../assets/img_15.jpg";


const Home = () => {
  return (
    <div className="home">
      <section className="block first-block">
        <BannerCarousel />
      </section>

      <section className="block second-block">
        <div className="content-wrapper">
          <div className="text-block">
            <h1>Дом студентов Narxoz Residence</h1>
            <p>
              <span>Адрес: микрорайон 10</span>
              <br />
              <span>Проживание в месяц: 80 000тг</span>
            </p>
            <button className="detail-button">Подробнее</button>
          </div>
          <div className="image-block">
            <img src={img_12} alt="img" />
          </div>
        </div>
      </section>

      <section className="block third-block">
        <div className="content-wrapper">
          <div className="text-block">
            <h1>Дом студентов №2 А</h1>
            <p>
              <span>Адрес: мкрн. Таугуль, 32</span>
              <br />
              <span>Проживание в месяц: 46 000 тг.</span>
            </p>
            <button className="detail-button">Подробнее</button>
          </div>
          <div className="image-block">
            <img src={img_15} alt="img" />
          </div>
        </div>
      </section>

      <section className="block third-block">
        <div className="content-wrapper">
          <div className="text-block">
            <h1>Дом студентов №2 Б</h1>
            <p>
              <span>Адрес: мкрн. Таугуль, 34</span>
              <br />
              <span>Проживание в месяц: 46 000 тг.</span>
            </p>
            <button className="detail-button">Подробнее</button>
          </div>
          <div className="image-block">
            <img src={img_13} alt="img" />
          </div>
        </div>
      </section>

      <section className="block third-block">
        <div className="content-wrapper">
          <div className="text-block">
            <h1>Дом студентов №3</h1>
            <p>
              <span>Адрес: мкрн 1-й., 81</span>
              <br />
              <span>Проживание в месяц: 46 000 тг.</span>
            </p>
            <button className="detail-button">Подробнее</button>
          </div>
          <div className="image-block">
            <img src={img_14} alt="img" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
