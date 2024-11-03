import React from 'react';
import '../styles/Home.css';
import img_1 from '../assets/img_1.jpg'; 
import img_2 from '../assets/img_2.jpg';

const Home = () => {
  return (
    <div className="home">
      <section className="block first-block">
        <div className="text-block large">
          <h1>The Narxoz Dorm Mate</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <div className="image-in-text">
            <img src={img_1} alt="Narxoz Welcome" />
          </div>
        </div>
      </section>

      <section className="block second-block">
        <div className="text-block">
          <h1>Lorem ipsum</h1>
          <p>Lorem ipsum odor amet, consectetur adipiscing elit.</p>
        </div>
        <div className="image-block">
          <img src={img_1} alt="Narxoz 1" />
          <img src={img_2} alt="Narxoz 2" />
          <img src={img_1} alt="Narxoz 3" />
        </div>
      </section>

      <section className="block third-block">
        <div className="text-block align-left">
          <h1>Lorem ipsum</h1>
          <p>Lorem ipsum odor amet, consectetur adipiscing elit.</p>
        </div>
        <div className="image-block">
          <img src={img_1} alt="Narxoz 4" />
          <img src={img_2} alt="Narxoz 5" />
          <img src={img_1} alt="Narxoz 6" />
        </div>
      </section>
    </div>
  );
};

export default Home;