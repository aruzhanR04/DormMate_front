// src/components/NotificationsPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import notificationSound from "../../assets/audio/notification.mp3";
import "../../styles/Notifications.css";
import { useI18n } from "../../i18n/I18nContext";

function NotificationsPopup({ onOpenChat }) {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef(null);
  const prevCount = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.7;
    audioRef.current.muted = true;
    audioRef.current.play().catch(() => {});
  }, []);

  const enableSound = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      setAudioEnabled(true);
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => {
        console.log("Ошибка включения звука:", e);
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("notifications/");
      setNotifications(res.data);
    } catch {
      setError(t("notifications.errorLoad"));
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      notifications.length > prevCount.current &&
      audioEnabled
    ) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => {
          console.log("Ошибка проигрывания аудио:", e);
        });
      }
    }
    prevCount.current = notifications.length;
  }, [notifications, audioEnabled]);

  const markNotificationRead = async (id) => {
    try {
      await api.post("notifications/", {
        notification_ids: [id],
      });
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    } catch {
      console.error("Ошибка отметки уведомления:", id);
    }
  };

  const handleOpenChat = (id) => {
    if (onOpenChat) onOpenChat();
    markNotificationRead(id);
  };

  return (
    <div className="notifications-popup neon-glow">
      <h3 className="popup-title">
        {t("notifications.title")}
      </h3>

      {!audioEnabled && (
        <button
          className="sound-btn"
          onClick={enableSound}
        >
          {t("notifications.enableSound")}
        </button>
      )}

      {error && (
        <p className="error">{error}</p>
      )}

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="no-notifs">
            {t("notifications.noNotifs")}
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="notification-card swing-in-top-fwd"
            >
              <p className="notif-msg">{n.message}</p>
              <div className="notif-actions">
                <button
                  onClick={() => handleOpenChat(n.id)}
                >
                  {t("notifications.openChat")}
                </button>
                <button
                  onClick={() =>
                    markNotificationRead(n.id)
                  }
                >
                  {t("notifications.hide")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPopup;
