// src/components/WebAssistant.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import "../../styles/ChatAssistant.css";
import { useI18n } from "../../i18n/I18nContext";

const WebAssistant = () => {
  const { t } = useI18n();
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [chatId, setChatId] = useState(
    localStorage.getItem("chatId") || null
  );
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chatActive, setChatActive] = useState(true);
  const [error, setError] = useState(null);
  const [isOperatorConnected, setIsOperatorConnected] = useState(false);

  const chatBoxRef = useRef(null);
  const userType =
    localStorage.getItem("user_type") || "student";

  const fallbackMessage = t("webAssistant.fallbackMessage");

  const fetchMessages = async (cId) => {
    try {
      const [msgRes, chatRes] = await Promise.all([
        api.get(`chats/${cId}/messages/`),
        api.get(`chats/${cId}/`)
      ]);
      const data = Array.isArray(msgRes.data)
        ? msgRes.data
        : Array.isArray(msgRes.data.results)
        ? msgRes.data.results
        : [];
      const transformed = data.map((msg) => {
        const isUser = msg.sender_type === userType;
        let timeString = "";
        if (msg.timestamp) {
          const d = new Date(msg.timestamp);
          if (!isNaN(d)) {
            timeString = d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            });
          }
        }
        return {
          id: msg.id,
          text: msg.content,
          type: isUser ? "user" : "admin",
          timestamp: timeString
        };
      });
      setMessages(transformed);
      setIsOperatorConnected(
        !!chatRes.data.is_operator_connected
      );
    } catch {
      localStorage.removeItem("chatId");
      setChatId(null);
      setError(t("webAssistant.loadingError"));
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chatActive) return;

    const text = userInput.trim();
    setUserInput("");

    try {
      const searchRes = await api.get(
        `questions/?search=${encodeURIComponent(text)}`
      );
      const autoAnswer =
        Array.isArray(searchRes.data) &&
        searchRes.data.length > 0
          ? searchRes.data[0].answer
          : null;

      let currentChatId = chatId;
      if (!currentChatId) {
        const createRes = await api.post(
          "student/chats/create/",
          {}
        );
        currentChatId = createRes.data.id;
        setChatId(currentChatId);
        localStorage.setItem(
          "chatId",
          currentChatId
        );
      }

      await api.post(
        `chats/${currentChatId}/send/`,
        { text }
      );
      await fetchMessages(currentChatId);

      if (autoAnswer && !isOperatorConnected) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: autoAnswer,
            type: "admin",
            timestamp: new Date().toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            )
          }
        ]);
        if (autoAnswer === fallbackMessage) {
          await handleRequestOperator(
            currentChatId
          );
        }
      } else if (!autoAnswer && !isOperatorConnected) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: fallbackMessage,
            type: "admin",
            timestamp: new Date().toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            )
          }
        ]);
        await handleRequestOperator(currentChatId);
      } else {
        await fetchMessages(currentChatId);
      }
    } catch {
      setError(t("webAssistant.sendError"));
    }
  };

  const handleRequestOperator = async (cId) => {
    if (!cId || !chatActive) return;
    try {
      await api.post(
        "notifications/request-admin/",
        { chat_id: cId }
      );
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: t("webAssistant.operatorCalled"),
          type: "admin",
          timestamp: new Date().toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )
        }
      ]);
    } catch {
      setError(
        t("webAssistant.requestOperatorError")
      );
    }
  };

  const handleEndChat = async () => {
    if (!chatId || !chatActive) return;
    try {
      await api.post(`chats/${chatId}/end/`);
      setChatActive(false);
      setMessages((prev) => [
        ...prev,
        {
          id: "end",
          text: t("webAssistant.chatEnded"),
          type: "admin",
          timestamp: new Date().toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )
        }
      ]);
      localStorage.removeItem("chatId");
      setChatId(null);
    } catch {
      setError(
        t("webAssistant.endChatError")
      );
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
      const interval = setInterval(
        () => fetchMessages(chatId),
        5000
      );
      return () => clearInterval(interval);
    }
  }, [chatId, isOperatorConnected, t]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isChatVisible) return null;

  return (
    <div className="web-assistant">
      <div className="chat-container">
        <div className="chat-header">
          <span>{t("webAssistant.title")}</span>
          <button
            className="chat-close-btn"
            title={t("webAssistant.closeTitle")}
            onClick={() => setIsChatVisible(false)}
          >
            {t("webAssistant.close")}
          </button>
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.type}`}
              >
                <span className="text">{msg.text}</span>
                {msg.timestamp && (
                  <span className="timestamp">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="empty-messages">
              {t("webAssistant.emptyMessages")}
            </p>
          )}
        </div>

        {error && (
          <p className="chat-error">{error}</p>
        )}

        {chatActive ? (
          <div className="chat-footer">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder={t(
                  "webAssistant.placeholder"
                )}
                value={userInput}
                onChange={(e) =>
                  setUserInput(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSendMessage()
                }
              />
              <button
                className="send-btn"
                onClick={handleSendMessage}
              >
                {t("webAssistant.send")}
              </button>
            </div>
            <div className="chat-actions">
              <button
                className="operator-btn"
                onClick={() =>
                  handleRequestOperator(chatId)
                }
              >
                {t("webAssistant.operatorButton")}
              </button>
              <button
                className="end-btn"
                onClick={handleEndChat}
              >
                {t("webAssistant.endButton")}
              </button>
            </div>
          </div>
        ) : (
          <p className="chat-ended">
            {t("webAssistant.chatEnded")}
          </p>
        )}
      </div>
    </div>
  );
};

export default WebAssistant;
