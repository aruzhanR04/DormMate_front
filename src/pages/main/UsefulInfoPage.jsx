import React from "react";
import "../../styles/UsefulInfo.css";

const UsefulInfoPage = () => {
  return (
    <div className="useful-info-container">
      <h1 className="section-title">Полезная информация перед заселением</h1>

      {/* Правила проживания */}
      <section className="info-section">
        <h2 className="info-title">📜 Правила проживания</h2>
        <ul className="info-list">
          <li>Соблюдать тишину после 22:00.</li>
          <li>Поддерживать чистоту в комнате и местах общего пользования.</li>
          <li>Не курить и не употреблять алкоголь на территории общежития.</li>
          <li>Бережно относиться к мебели, технике и оборудованию.</li>
          <li>Сообщать о неисправностях администрации.</li>
        </ul>
      </section>

      {/* Что взять с собой */}
      <section className="info-section">
        <h2 className="info-title">🎒 Что взять с собой</h2>
        <ul className="info-list">
          <li>Постельное бельё и полотенца.</li>
          <li>Личные средства гигиены.</li>
          <li>Кружка, тарелка, ложка, вилка, чайник (по желанию).</li>
          <li>Удлинитель, переноска.</li>
          <li>Набор для уборки (тряпка, моющее средство).</li>
        </ul>
      </section>

      {/* Как улаживать конфликты */}
      <section className="info-section">
        <h2 className="info-title">🤝 Как улаживать конфликты</h2>
        <ul className="info-list numbered">
          <li><strong>Обсудите проблему спокойно</strong>: не обвиняйте, говорите о своих чувствах.</li>
          <li><strong>Установите правила</strong>: договоритесь о режиме, уборке, гостях и т.д.</li>
          <li><strong>Уважайте личные границы</strong>: дайте друг другу пространство.</li>
          <li><strong>Обратитесь к куратору или администратору</strong>, если не удаётся решить самостоятельно.</li>
        </ul>
      </section>
    </div>
  );
};

export default UsefulInfoPage;
