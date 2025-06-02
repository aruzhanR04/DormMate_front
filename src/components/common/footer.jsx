import React from "react";
import "../../styles/Footer.css";
import footerLogo from "../../assets/icons/footerLogo.png";

import SocialTelegram from "../../assets/icons/social-telegram.svg";
import SocialInstagram from "../../assets/icons/social-instagram.svg";
import SocialFacebook from "../../assets/icons/social-facebook.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-col footer-about">
          <img src={footerLogo} alt="DormMate Logo" className="footer-logo" />
        </div>

        <div className="footer-col footer-contacts">
          <h4>Контакты</h4>
          <p>ул. Жандосова 55, Ауэзовский район <br></br>Алматы, Казахстан, 050035</p>
          <p>
            <a href="mailto:dormmate@narxoz.kz">dorm@narxoz.kz</a>
          </p>
          <p>
            <a href="tel:+77271234567">+7 (747) 364 88 99</a>
          </p>
        </div>
        {/* Соцсети */}
        <div className="footer-col footer-socials">
          <h4>Мы в соцсетях</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={SocialTelegram} alt="Telegram" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={SocialInstagram} alt="Instagram" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={SocialFacebook} alt="Facebook" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
