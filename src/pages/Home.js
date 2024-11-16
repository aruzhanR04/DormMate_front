import React from 'react';
import '../styles/Home.css';
import banner from '../assets/banner.png'; 
import img_1 from '../assets/img_1.jpg'; 
import img_2 from '../assets/img_2.jpg';
import img_3 from '../assets/img_3.jpg';
import img_4 from '../assets/img_4.jpg';
import img_5 from '../assets/img_5.jpg';
import img_6 from '../assets/img_6.jpg';
import img_7 from '../assets/img_7.jpg';

const Home = () => {
  return (
    <div className="home">
      <section className="block first-block">
            <img src={banner} alt="Narxoz Welcome" />
      </section>

      <section className="block second-block">
        <div className="text-block">
          <h1>Комфортное проживание</h1>
          <p>Наши общежития — это уютные комнаты, которые созданы для вашего удобства. Просторный коворкинг станет идеальным местом для учебы и работы, а современная инфраструктура помогает каждому чувствовать себя как дома.</p>
        </div>
        <div className="image-block">
          <img src={img_2} alt="Narxoz 1" />
          <img src={img_3} alt="Narxoz 2" />
          <img src={img_4} alt="Narxoz 3" />
        </div>
      </section>

      <section className="block third-block">
        <div className="text-block align-left">
          <h1>Кухни и прачечные</h1>
          <p>В наших общежитиях предусмотрены просторные кухни с современным оборудованием и удобные прачечные, чтобы вы могли сосредоточиться на учебе и отдыхе. </p>
        </div>
        <div className="image-block">
          <img src={img_5} alt="Narxoz 4" />
          <img src={img_6} alt="Narxoz 5" />
          <img src={img_7} alt="Narxoz 6" />
        </div>
      </section>
    </div>
  );
};

export default Home;