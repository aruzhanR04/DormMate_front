// src/components/AdminDormitoryViewModal.jsx
import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/AdminFormShared.css";
import { useI18n } from "../../i18n/I18nContext";

const AdminDormitoryViewModal = ({ dormId, onClose }) => {
  const { lang, t } = useI18n();
  const [dormData, setDormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDormData = async () => {
      try {
        const { data } = await api.get(`/dorms/${dormId}/`);
        setDormData(data);
      } catch {
        setError(t("adminDormitoryViewModal.messages.errorLoad"));
      } finally {
        setLoading(false);
      }
    };
    if (dormId) fetchDormData();
  }, [dormId, t]);

  if (loading) return null;

  if (error) {
    return (
      <div className="modal">
        <div className="modal-content">
          <button className="modal-close-btn" onClick={onClose}>
            {t("adminDormitoryViewModal.buttons.close")}
          </button>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  // Выбираем name и description в нужном языке
  const titleValue =
    dormData[`name_${lang}`] || dormData.name_ru;
  const descValue =
    dormData[`description_${lang}`] ||
    dormData.description_ru ||
    "";

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          {t("adminDormitoryViewModal.buttons.close")}
        </button>
        <h2>{t("adminDormitoryViewModal.title")}</h2>

        <div className="form-container">
          <label>
            <strong>{t("adminDormitoryViewModal.labels.name")}</strong>
            <input type="text" value={titleValue} disabled />
          </label>
          <label>
            <strong>{t("adminDormitoryViewModal.labels.address")}</strong>
            <input type="text" value={dormData.address} disabled />
          </label>
          <label>
            <strong>{t("adminDormitoryViewModal.labels.description")}</strong>
            <textarea value={descValue} rows={2} disabled />
          </label>
          <label>
            <strong>{t("adminDormitoryViewModal.labels.total_places")}</strong>
            <input
              type="text"
              value={dormData.total_places}
              disabled
            />
          </label>
          <label>
            <strong>{t("adminDormitoryViewModal.labels.cost")}</strong>
            <input type="text" value={dormData.cost} disabled />
          </label>

          {dormData.images?.length > 0 && (
            <>
              <h3>{t("adminDormitoryViewModal.labels.imagesSection")}</h3>
              <div className="dorm-images-list">
                {dormData.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt={t("adminDormitoryViewModal.imageAlt", {
                      id: img.id
                    })}
                    className="preview-image"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="form-actions">
          <button className="cancel-button" onClick={onClose}>
            {t("adminDormitoryViewModal.buttons.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDormitoryViewModal;
