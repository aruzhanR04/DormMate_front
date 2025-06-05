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
        console.error("Ошибка при загрузке общежитий:", error);
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
      {/* Блок баннера */}
      <section className="banner">
        <img src={bannerImage} alt="Banner" className="banner-img" />
      </section>

      {/* Секция с карточками общежитий */}
      <section className="dorm-section">
        <h2 className="section-title">Наши общежития</h2>
        <div className="dorm-list">
          {dormitories.map((dorm) => {
            // Определяем URL для картинки:
            // Если в API есть поле first_image, используем его;
            // Иначе пытаемся взять первую картинку из массива images;
            // Если ничего не найдено — используем заглушку defaultDormImg.
            const imageUrl =
              dorm.first_image ||
              dorm.images?.[0]?.image ||
              defaultDormImg;

            return (
              <div key={dorm.id} className="dorm-card">
                <img
                  src={imageUrl}
                  alt={dorm.name}
                  className="dorm-img"
                  onError={(e) => {
                    // На случай, если URL картинки битый, подменяем на заглушку
                    e.currentTarget.src = defaultDormImg;
                  }}
                />
                <h3 className="dorm-name">{dorm.name}</h3>
                <p className="dorm-description">
                  {dorm.description || "Общежитие нового типа с удобствами."}
                </p>
                <div className="dorm-icons">
                  <span className="dorm-icon-item">
                    <img src={DormCardIconBed} alt="Места" />{" "}
                    {dorm.total_places}
                  </span>
                  <span className="dorm-icon-item">
                    <img src={DormCardIconCanteen} alt="Столовая" /> Столовая
                  </span>
                  <span className="dorm-icon-item">
                    <img src={DormCardIconLaundry} alt="Прачечная" /> Прачечная
                  </span>
                </div>
                <Link to={`/dormitory/${dorm.id}`} className="more-btn">
                  Подробнее
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Секция с FAQ */}
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
              <p>
                Выдаётся ордер и заключается договор найма. Прописка оформляется
                через деканат. Самовольное заселение запрещено.
              </p>
            </details>
            <details>
              <summary>Как я могу оплатить проживание?</summary>
              <p>
                Оплата производится через университетскую платёжную систему или
                банк.
              </p>
            </details>
            <details>
              <summary>Какие правила проживания я должен соблюдать?</summary>
              <p>
                Соблюдение тишины, чистоты, уважение к соседям и имуществу.
              </p>
            </details>
            <details>
              <summary>Что произойдёт при нарушении правил?</summary>
              <p>Предупреждение, штраф или выселение в зависимости от серьёзности.</p>
            </details>
          </div>
        </div>

        {/* Кнопка скачивания PDF, если URL доступен */}
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
