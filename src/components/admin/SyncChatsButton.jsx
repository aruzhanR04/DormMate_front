// src/components/SyncChatsButton.jsx
import React, { useState } from "react";
import goApi from "../../goApi";

export default function SyncChatsButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setMessage("");

    try {
      // 1) Создаём/дополняем недостающие чаты
      const initResp = await goApi.post("/chats/init_all");
      // После этого можно (опционально) сразу очистить устаревшие
      const cleanupResp = await goApi.delete("/chats/cleanup");

      setMessage(
        `init_all: ${initResp.data.message}. cleanup: удалено ${cleanupResp.data.deleted_chats} чатов.`
      );
    } catch (err) {
      console.error(err);
      setMessage(
        `Ошибка синхронизации: ${
          err.response?.data?.error || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSync} disabled={loading}>
        {loading ? "Синхронизируем..." : "Синхронизировать чаты"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
