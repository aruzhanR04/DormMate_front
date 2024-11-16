import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/DormDetails.css";

const DormDetails = () => {
  const { id } = useParams();
  const [dorm, setDorm] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/v1/dormlist/${id}`)
      .then((response) => setDorm(response.data))
      .catch((error) => console.error("Error fetching dorm details:", error));
  }, [id]);

  if (!dorm) {
    return <p>Загрузка информации об общежитии...</p>;
  }

  return (
    <div className="dorm-details-container">
      <h2>{dorm.name}</h2>
      <img
        src={dorm.image || ""}
        alt={dorm.name}
        className="dorm-image"
      />
      <p>{dorm.description || "Нет описания для этого общежития."}</p>
      <div className="dorm-meta">
        {/* <p><strong>Адрес:</strong> {dorm.address || "Не указан"}</p>
        <p><strong>Контактный телефон:</strong> {dorm.phone || "Не указан"}</p> */}
        <p><strong>Вместимость:</strong> {dorm.capacity || "Не указана"}</p>
      </div>
    </div>
  );
};

export default DormDetails;
