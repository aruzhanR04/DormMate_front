import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import "../../styles/Home.css";
import faqImage from "../../assets/images/faq.png";
import Footer from "../../components/common/footer.jsx";
import defaultDormImg from "../../assets/images/banner.png";

// SVG-иконки
import DormCardIconCanteen from "../../assets/icons/DormCardIconCanteen.svg";
import DormCardIconBed from "../../assets/icons/DormCardIconBed.svg";
import DormCardIconLaundry from "../../assets/icons/DormCardIconLaundry.svg";
import bannerImage from "../../assets/images/banner.png";

const Home = () => {
  const [dormitories, setDormitories] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const response = await api.get("dorms/");
        setDormitories(response.data.results || response.data);
      } catch (error) {
        console.error("Ошибка при загрузке общаг:", error);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await api.get("global-settings/");
        setPdfUrl(response.data.student_home_pdf || "");
      } catch (error) {
        console.error("Ошибка при загрузке PDF:", error);
      }
    };

    fetchDormitories();
    fetchSettings();
  }, []);

  return (
    <div className="home">
      <section className="banner">
        <img src={bannerImage} alt="Banner" className="banner-img" />
      </section>

      <section className="dorm-section">
        <h2 className="section-title">Наши общежития</h2>
        <div className="dorm-list">
          {dormitories.map((dorm) => (
            <div key={dorm.id} className="dorm-card">
              <img
                src={dorm.images?.[0]?.image || defaultDormImg}
                alt={dorm.name}
                className="dorm-img"
              />
              <h3>{dorm.name}</h3>
              <p>{dorm.description || "Общежитие нового типа с удобствами."}</p>
              <div className="dorm-icons">
                <span>
                  <img src={DormCardIconBed} alt="Места" /> {dorm.total_places}
                </span>
                <span>
                  <img src={DormCardIconCanteen} alt="Столовая" /> Столовая
                </span>
                <span>
                  <img src={DormCardIconLaundry} alt="Прачечная" /> Прачечная
                </span>
              </div>
              <Link to={`/dormitory/${dorm.id}`} className="more-btn">
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <h2 className="faq-title">Часто задаваемые вопросы</h2>
        <div className="faq-wrapper">
          <div className="faq-image-wrapper">
            <img src={faqImage} alt="FAQ" className="faq-image" />
          </div>
          <div className="faq-accordion">
            <details>
              <summary>Что входит в стоимость проживания?</summary>
              <p>Проживание, коммунальные услуги, пользование кухней и душем.</p>
            </details>
            <details>
              <summary>Как долго можно проживать в Доме студентов?</summary>
              <p>На протяжении всего периода обучения при соблюдении правил.</p>
            </details>
            <details>
              <summary>Кто может получить место в общежитии?</summary>
              <p>Студенты, подавшие заявку и прошедшие отбор.</p>
            </details>
            <details>
              <summary>Как происходит заселение?</summary>
              <p>Выдаётся ордер и заключается договор найма. Прописка оформляется через деканат. Самовольное заселение запрещено.</p>
            </details>
            <details>
              <summary>Как я могу оплатить проживание?</summary>
              <p>Оплата производится через университетскую платёжную систему или банк.</p>
            </details>
            <details>
              <summary>Какие правила проживания я должен соблюдать?</summary>
              <p>Соблюдение тишины, чистоты, уважение к соседям и имуществу.</p>
            </details>
            <details>
              <summary>Что произойдёт при нарушении правил?</summary>
              <p>Предупреждение, штраф или выселение в зависимости от серьёзности.</p>
            </details>
          </div>
        </div>

        {pdfUrl && (
          <div className="download-pdf">
            <p>Скачать Положение о доме студентов</p>
            <a href={pdfUrl} download className="download-button">
              Скачать
            </a>
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
