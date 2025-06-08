// src/components/StudentDormChat.jsx
import React, { useState, useEffect } from "react";
import api from "../../api";
import goApi from "../../goApi";
import "../../styles/AdminChat.css";
import searchIcon from "../../assets/icons/Search.svg";
import { useI18n } from "../../i18n/I18nContext";

export default function StudentDormChat() {
  const { lang, t } = useI18n();

  // 0) Авторизованный студент
  const [student, setStudent] = useState(null);

  // 1) Dorm, этаж и комната студента
  const [studentDormID, setStudentDormID] = useState(null);
  const [studentDormName, setStudentDormName] = useState("");
  const [studentFloor, setStudentFloor] = useState(null);
  const [studentRoomNumber, setStudentRoomNumber] = useState("");

  // 1.5) URL аватарки
  const [studentAvatarUrl, setStudentAvatarUrl] = useState(null);

  // 2) Все чаты из Go
  const [allChats, setAllChats] = useState([]);

  // 3) Отфильтрованные чаты
  const [visibleChats, setVisibleChats] = useState([]);

  // 4) Активный чат
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatMeta, setActiveChatMeta] = useState(null);

  // 5) Сообщения
  const [messages, setMessages] = useState([]);

  // 6) Поиск и ввод
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");

  // 7) Синхронизация
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  // === Загрузка профиля студента ===
  useEffect(() => {
    api.get("/studentdetail/").then(r => setStudent(r.data));
  }, []);

  // === Загрузка dorm/room из Django ===
  useEffect(() => {
    if (!student?.id) return;
    api
      .get(`/student-in-dorm/?student_id=${student.id}`)
      .then(r => {
        const recs = Array.isArray(r.data)
          ? r.data
          : Array.isArray(r.data.results)
            ? r.data.results
            : [];
        if (!recs.length) return;
        const first = recs[0];
        setStudentDormID(first.dorm.id);
        setStudentDormName(first.dorm[`name_${lang}`] || first.dorm.name_ru);
        setStudentFloor(first.room.floor);
        setStudentRoomNumber(first.room.number || "");
      });
  }, [student]);

  // === Нормализация URL аватарки ===
  useEffect(() => {
    if (!student?.avatar) {
      setStudentAvatarUrl(null);
      return;
    }
    const raw = student.avatar;
    setStudentAvatarUrl(
      raw.startsWith("http") ? raw : `http://127.0.0.1:8000${raw}`
    );
  }, [student]);

  // === Загрузка всех чатов из Go ===
  useEffect(() => {
    if (studentDormID == null || studentFloor == null) {
      setAllChats([]);
      return;
    }
    goApi.get("/chats").then(r => setAllChats(r.data));
  }, [studentDormID, studentFloor]);

  // === Фильтрация чатов по dorm+floor ===
  useEffect(() => {
    if (!allChats.length || studentDormID == null || studentFloor == null) {
      setVisibleChats([]);
      return;
    }
    setVisibleChats(
      allChats.filter(
        chat =>
          (chat.type === "dorm" && chat.dormID === studentDormID) ||
          (chat.type === "floor" &&
            chat.dormID === studentDormID &&
            chat.floor === studentFloor)
      )
    );
  }, [allChats, studentDormID, studentFloor]);

  // === Выбор чата и загрузка сообщений ===
  const handleSelectChat = async chat => {
    setActiveChatId(chat.chatID);
    setActiveChatMeta(chat);
    setMessages([]);

    const resp = await goApi.get(`/chats/${chat.chatID}/messages`);
    const raw = resp.data;

    const unique = Array.from(
      new Set(raw.map(m => `${m.SenderType || "student"}:${m.SenderID}`))
    ).map(s => {
      const [senderType, senderID] = s.split(":");
      return { senderType, senderID };
    });

    const studentData = await Promise.all(
      unique
        .filter(u => u.senderType === "student")
        .map(u =>
          api.get(`/student-in-dorm/?student_id=${u.senderID}`).then(r => {
            const recs = Array.isArray(r.data)
              ? r.data
              : Array.isArray(r.data.results)
                ? r.data.results
                : [];
            if (!recs.length)
              return {
                key: `student:${u.senderID}`,
                senderName: t("studentDormChat.unknown"),
                avatarUrl: null,
                roomNumber: "—",
              };
            const first = recs[0];
            return {
              key: `student:${u.senderID}`,
              senderName: `${first.student.last_name} ${first.student.first_name}`,
              avatarUrl: first.student.avatar
                ? first.student.avatar.startsWith("http")
                  ? first.student.avatar
                  : `http://127.0.0.1:8000${first.student.avatar}`
                : null,
              roomNumber: first.room.number || "—",
            };
          })
        )
    );

    const adminData = await Promise.all(
      unique
        .filter(u => u.senderType === "admin")
        .map(u =>
          api.get(`/admins/${u.senderID}/`).then(r => {
            const a = r.data;
            return {
              key: `admin:${u.senderID}`,
              senderName: `${a.last_name} ${a.first_name}`,
              avatarUrl: a.avatar
                ? a.avatar.startsWith("http")
                  ? a.avatar
                  : `http://127.0.0.1:8000${a.avatar}`
                : null,
              roomNumber: t("studentDormChat.commandant"),
            };
          })
        )
    );

    const map = {};
    [...studentData, ...adminData].forEach(u => (map[u.key] = u));

    const enriched = raw.map(m => {
      const type = m.SenderType || "student";
      const key = `${type}:${m.SenderID}`;
      const info = map[key] || {
        senderName: t("studentDormChat.unknown"),
        avatarUrl: null,
        roomNumber: "—",
      };
      const isAdmin = type === "admin";

      return {
        id: m.ID,
        chat_id: m.ChatID,
        sender_id: m.SenderID,
        sender_type: type,
        content: m.Content,
        timestamp: m.CreatedAt,
        SenderName: info.senderName,
        RoomNumber: isAdmin ? t("studentDormChat.commandant") : info.roomNumber,
        AvatarUrl: isAdmin ? null : info.avatarUrl,
      };
    });

    setMessages(enriched);
  };

  // === Отправка нового сообщения ===
  const handleSendMessage = async e => {
    e.preventDefault();
    if (!input.trim() || !activeChatId) return;

    const body = { content: input.trim(), sender_type: "student" };
    const resp = await goApi.post(
      `/chats/${activeChatId}/messages`,
      body
    );
    const m = resp.data;

    setMessages(prev => [
      ...prev,
      {
        id: m.ID,
        chat_id: m.ChatID,
        sender_id: m.SenderID,
        sender_type: m.SenderType,
        content: m.Content,
        timestamp: m.CreatedAt,
        SenderName: `${student.last_name} ${student.first_name}`,
        RoomNumber: studentRoomNumber || "—",
        AvatarUrl: studentAvatarUrl,
      },
    ]);
    setInput("");
  };

  // === Синхронизация чатов ===
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage("");
    try {
      const initResp = await goApi.post("/chats/init_all");
      const cleanupResp = await goApi.delete("/chats/cleanup");
      if (studentDormID != null && studentFloor != null) {
        const r = await goApi.get("/chats");
        setAllChats(r.data);
      }
      setSyncMessage(
        `${t("studentDormChat.sync.doneInit")}: ${initResp.data.message}, ` +
        `${t("studentDormChat.sync.doneCleanup")}: ${cleanupResp.data.deleted_chats}`
      );
    } catch {
      setSyncMessage(t("studentDormChat.sync.error"));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="admin-chat-page">
      <div className="admin-chat-content">
        {/* Левая колонка */}
        <div className="admin-chat-list">
          <div className="chat-list-header">
            <span>{t("studentDormChat.chatsTitle")}</span>
            <button onClick={handleSync} disabled={isSyncing}>
              {isSyncing
                ? t("studentDormChat.sync.syncing")
                : t("studentDormChat.sync.button")}
            </button>
          </div>
          {syncMessage && (
            <div className="sync-message">{syncMessage}</div>
          )}
          <div className="chat-list-search-row">
            <input
              type="text"
              className="chat-list-search"
              placeholder={t("studentDormChat.searchPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <img src={searchIcon} alt="" className="chat-list-search-icon" />
          </div>
          <div className="chat-list-scroll">
            {visibleChats.length ? (
              visibleChats
                .filter(chat =>
                  !search.trim()
                    ? true
                    : (chat.name || "")
                        .toLowerCase()
                        .includes(search.trim().toLowerCase())
                )
                .map(chat => {
                  const title =
                    chat.type === "dorm"
                      ? studentDormName
                      : `${t("studentDormChat.floorLabel")} ${chat.floor} (${studentDormName})`;
                  return (
                    <div
                      key={chat.chatID}
                      className={
                        "chat-list-item" +
                        (activeChatId === chat.chatID
                          ? " chat-list-item-active"
                          : "") +
                        (chat.has_new_messages
                          ? " chat-list-item-unread"
                          : "")
                      }
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="chat-list-item-title">{title}</div>
                    </div>
                  );
                })
            ) : (
              <div className="chat-list-empty">
                {t("studentDormChat.noChats")}
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка */}
        <div className="admin-chat-main">
          {activeChatMeta ? (
            <>
              <div className="chat-main-header">
                {activeChatMeta.type === "dorm"
                  ? studentDormName
                  : `${t("studentDormChat.floorLabel")} ${activeChatMeta.floor} (${studentDormName})`}
              </div>
              <div className="chat-main-messages">
                {messages.length ? (
                  messages.map(msg => {
                    const time = new Date(msg.timestamp).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    );
                    const isMe = msg.sender_id === String(student?.id);
                    return (
                      <div
                        key={msg.id}
                        className={
                          "chat-message-row " +
                          (isMe
                            ? "chat-message-row--own"
                            : "chat-message-row--other")
                        }
                      >
                        <div className="chat-avatar">
                          {msg.AvatarUrl ? (
                            <img
                              src={msg.AvatarUrl}
                              alt={msg.SenderName}
                              className="chat-avatar__img"
                            />
                          ) : (
                            <div className="chat-avatar__placeholder" />
                          )}
                        </div>
                        <div className="chat-message-body">
                          <div className="chat-message-header">
                            <span className="chat-message-sender">
                              {msg.SenderName}
                            </span>
                            <span className="chat-message-room">
                              {msg.sender_type === "student"
                                ? `, ${t("studentDormChat.roomLabel")} ${msg.RoomNumber}`
                                : `, ${msg.RoomNumber}`}
                            </span>
                          </div>
                          <div
                            className={
                              "chat-message-bubble " +
                              (isMe
                                ? "chat-message-bubble--own"
                                : "chat-message-bubble--other")
                            }
                          >
                            <span className="chat-message-text">
                              {msg.content}
                            </span>
                            <span className="chat-message-time">{time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="chat-main-empty">
                    {t("studentDormChat.noMessages")}
                  </div>
                )}
              </div>
              <form
                className="chat-main-input-row"
                onSubmit={handleSendMessage}
              >
                <input
                  className="chat-main-input"
                  placeholder={t("studentDormChat.messagePlaceholder")}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  autoComplete="off"
                />
                <button
                  className="chat-main-send-btn"
                  type="submit"
                  tabIndex={-1}
                >
                  <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                    <path
                      d="M8 24L24 16L8 8V14L20 16L8 18V24Z"
                      fill="#BF2A45"
                    />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="chat-main-empty-center">
              {t("studentDormChat.selectChatPrompt")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
