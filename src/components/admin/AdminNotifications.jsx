// src/components/AdminNotifications.jsx

import React, { useState, useEffect } from "react";
import api from "../../api";
import { useI18n } from "../../i18n/I18nContext";

function AdminNotifications() {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Load every 5 seconds
  const fetchNotifications = async () => {
    try {
      const res = await api.get("notifications/admin/");
      setNotifications(res.data);
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке уведомлений админа:", err);
      if (err.response?.status === 401) {
        setError(t("adminNotifications.errors.unauthorized"));
      } else {
        setError(t("adminNotifications.errors.loadError"));
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post("notifications/admin/", { notification_ids: [id] });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Ошибка при отметке уведомления:", err);
    }
  };

  return (
    <div className="admin-notifications-popup">
      <h4>{t("adminNotifications.title")}</h4>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {notifications.length === 0 ? (
        <p>{t("adminNotifications.empty")}</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="admin-notif-item">
            <p>{n.message}</p>
            <button onClick={() => markAsRead(n.id)}>
              {t("adminNotifications.buttons.hide")}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminNotifications;
