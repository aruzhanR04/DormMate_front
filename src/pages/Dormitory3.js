import React from 'react';
import '../styles/Dormitory.css';
import img_14 from '../assets/img_14.jpg'; // Импортируем изображение

const Dormitory3 = () => {
  return (
    <div className="dormitory-page">
      <div className="dormitory-header">
        <div className="dormitory-info">
          <h1>Дом студентов №3</h1>
          <p><strong>Адрес:</strong> мкрн 1-й., 81</p>
          <p><strong>Проживание в месяц:</strong> 46 000 тг</p>
          <p><strong>Описание:</strong> Комфортное место проживания с доступом ко всем необходимым удобствам.</p>
        </div>
        <div className="dormitory-image">
          <img src={img_14} alt="Дом студентов №3" />
        </div>
      </div>
      <div className="map-container">
        <iframe
          title="Карта Дом студентов №3"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d363.3959007057771!2d76.84590290847717!3d43.22695386443267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x388369d4a6b97979%3A0xa1cfcf2c06c9567!2sYesdaulet%20I%20Toma%20Zhatatyn%20Obshchaga!5e0!3m2!1sen!2skz!4v1741977835839!5m2!1sen!2skz"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Dormitory3;