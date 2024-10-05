import React from 'react';
import '../styles/Home.css';
import img_1 from '../assets/img_1.jpg'; 

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
    </div>
  );
}

export default Home;
