import React from 'react';
import '../../styles/Dormitory.css';
import img_12 from '../../assets/images/img_12.jpeg';

const Dormitory1 = () => {
  return (
    <div className="dormitory-page">
      <div className="dormitory-header">
        <div className="dormitory-info">
          <h1>Дом студентов Narxoz Residence</h1>
          <p><strong>Адрес:</strong> микрорайон 10</p>
          <p><strong>Проживание в месяц:</strong> 80 000 тг</p>
          <p><strong>Описание:</strong> Современное общежитие с удобствами и отличной транспортной доступностью.</p>
        </div>
        <div className="dormitory-image">
          <img src={img_12} alt="Narxoz Residence" />
        </div>
      </div>
      <div className="map-container">
        <iframe
          title="Карта Narxoz Residence"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.55032504427!2d76.86627087601673!3d43.21892017112602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x388369007acd6145%3A0xfa3c943b79e749fb!2z0JTQvtC8INGB0YLRg9C00LXQvdGC0L7QsiBFbWVuINCj0L3QuNCy0LXRgNGB0LjRgtC10YLQsCDQndCw0YDRhdC-0Lc!5e0!3m2!1sen!2skz!4v1741977591497!5m2!1sen!2skz"
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

export default Dormitory1;
