import React from 'react';
import '../styles/Dormitory.css';
import img_13 from '../assets/img_13.jpg'; // Импортируем изображение

const Dormitory2 = () => {
  return (
    <div className="dormitory-page">
      <div className="dormitory-header">
        <div className="dormitory-info">
          <h1>Дом студентов №2 Б</h1>
          <p><strong>Адрес:</strong> мкрн. Таугуль, 34</p>
          <p><strong>Проживание в месяц:</strong> 46 000 тг</p>
          <p><strong>Описание:</strong> Общежитие для студентов с уютной атмосферой и развитой инфраструктурой.</p>
        </div>
        <div className="dormitory-image">
          <img src={img_13} alt="Дом студентов №2 Б" />
        </div>
      </div>
      <div className="map-container">
        <iframe
          title="Карта Дом студентов №2 Б"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.037534184652!2d76.87142227601619!3d43.20870207112669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3883690010b2debf%3A0xad72bd251bee6e0b!2z0JTQvtC8INGB0YLRg9C00LXQvdGC0L7QsiAoTmFyeG96IFVuaXZlcnNpdHkp!5e0!3m2!1sen!2skz!4v1741977088149!5m2!1sen!2skz"
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

export default Dormitory2;