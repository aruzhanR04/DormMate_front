import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Application.css';
import img_11 from '../assets/img_11.svg';
import Ellipse1 from '../assets/Ellipse1.svg';
import Ellipse2 from '../assets/Ellipse2.svg';
import Ellipse3 from '../assets/Ellipse3.svg';

const ApplicationPage = () => {
  return (
    <div className="application-page">
      <div className="form-section">
        <input type="text" placeholder="name" />
        <input type="text" placeholder="surname" />
        <input type="text" placeholder="course" />
        <select>
          <option>Ценовой диапазон</option>
          <option>400 000</option>
          <option>800 000</option>
        </select>
        <button className="submit-btn"><Link to="/testpage">Перейти к тесту</Link></button>
      </div>
      <div className="visual-section">
        <img src={Ellipse1} alt="Ellipse 1" className="ellipse ellipse1" />
        <img src={Ellipse2} alt="Ellipse 2" className="ellipse ellipse2" />
        <img src={Ellipse3} alt="Ellipse 3" className="ellipse ellipse3" />
        <img src={img_11} alt="img_11" className="img_11" />
      </div>
    </div>
  );
};

export default ApplicationPage;
