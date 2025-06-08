// src/components/Footer.jsx

import React from "react";
import "../../styles/Footer.css";
import footerLogo from "../../assets/icons/footerLogo.png";
import SocialTelegram from "../../assets/icons/social-telegram.svg";
import SocialInstagram from "../../assets/icons/social-instagram.svg";
import SocialFacebook from "../../assets/icons/social-facebook.svg";
import { useI18n } from "../../i18n/I18nContext";

const Footer = () => {
  const { t } = useI18n();
  const cfg = t("footer");

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-col footer-about">
          <img src={footerLogo} alt="DormMate Logo" className="footer-logo" />
        </div>

        <div className="footer-col footer-contacts">
          <h4>{cfg.contactsTitle}</h4>
          {cfg.address.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
          <p>
            <a href={`mailto:${cfg.email}`}>{cfg.email}</a>
          </p>
          <p>
            <a href={`tel:${cfg.phone.replace(/[^+\d]/g, "")}`}>{cfg.phone}</a>
          </p>
        </div>

        <div className="footer-col footer-socials">
          <h4>{cfg.socialTitle}</h4>
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
