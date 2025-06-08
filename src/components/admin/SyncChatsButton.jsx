// src/components/SyncChatsButton.jsx
import React, { useState } from "react";
import goApi from "../../goApi";
import { useI18n } from "../../i18n/I18nContext";

export default function SyncChatsButton() {
  const { t } = useI18n();
  const txt = t("syncChatsButton");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setMessage("");

    try {
      const initResp = await goApi.post("/chats/init_all");
      const cleanupResp = await goApi.delete("/chats/cleanup");

      setMessage(
        txt.messageInitCleanup
          .replace("{initMsg}", initResp.data.message)
          .replace("{deleted}", cleanupResp.data.deleted_chats)
      );
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setMessage(txt.error.replace("{error}", errMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSync} disabled={loading}>
        {loading ? txt.syncing : txt.sync}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
