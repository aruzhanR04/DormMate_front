// src/pages/admin/AdminDormChatPage.jsx

import React, { useState, useEffect } from "react";
import api from "../../api";      // Axios-инстанс для Django
import goApi from "../../goApi";  // Axios-инстанс для Go
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminChat.css";
import searchIcon from "../../assets/icons/Search.svg";
import { useI18n } from "../../i18n/I18nContext";

export default function AdminDormChatPage() {
  const { lang, t } = useI18n();

  // 0) Данные текущего админа
  const [admin, setAdmin] = useState(null);

  // 1) Список подчинённых общежитий { id, name }
  const [dorms, setDorms] = useState([]);

  // 2) Все чаты + отфильтрованные
  const [allChats, setAllChats] = useState([]);
  const [visibleChats, setVisibleChats] = useState([]);

  // 3) Поисковая строка
  const [search, setSearch] = useState("");

  // 4) Активный чат и его мета
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatMeta, setActiveChatMeta] = useState(null);

  // 5) Сообщения
  const [messages, setMessages] = useState([]);

  // 6) Новый текст сообщения
  const [input, setInput] = useState("");

  // === Загрузка профиля администратора ===
  useEffect(() => {
    api.get("/admins/me/").then(r => setAdmin(r.data));
  }, []);

  // === Загрузка списка dorms с названиями ===
  useEffect(() => {
    if (!admin?.id) return;
    api.get(`/dorms/?commandant=${admin.id}`).then(r => {
      const list = Array.isArray(r.data)
        ? r.data
        : Array.isArray(r.data.results)
          ? r.data.results
          : [];
      setDorms(list.map(d => ({ id: d.id, name: d[`name_${lang}`]})));
    });
  }, [admin]);

  // === Загрузка всех чатов из Go и фильтрация по подчинённым dorms ===
  useEffect(() => {
    if (!dorms.length) {
      setAllChats([]);
      setVisibleChats([]);
      return;
    }
    const ids = dorms.map(d => d.id);
    goApi.get("/chats").then(r => {
      const filtered = r.data.filter(chat => ids.includes(chat.dormID));
      setAllChats(filtered);
      setVisibleChats(filtered);
    });
  }, [dorms]);

  // === Фильтрация чатов по строке поиска ===
  useEffect(() => {
    if (!search.trim()) {
      setVisibleChats(allChats);
      return;
    }
    const q = search.trim().toLowerCase();
    setVisibleChats(
      allChats.filter(chat => {
        if (chat.type === "dorm") {
          const name = dorms.find(d => d.id === chat.dormID)?.name || "";
          return name.toLowerCase().includes(q);
        } else {
          const name = dorms.find(d => d.id === chat.dormID)?.name || "";
          const floorLabel = `${t("adminDormChatPage.floorLabel")} ${chat.floor}`.toLowerCase();
          return (
            name.toLowerCase().includes(q) ||
            floorLabel.includes(q)
          );
        }
      })
    );
  }, [search, allChats, dorms, t]);

  // === Обогащение и установка сообщений ===
  const handleSelectChat = async chat => {
    setActiveChatId(chat.chatID);
    setActiveChatMeta(chat);
    setMessages([]);

    // 1) Получаем «сырые» сообщения
    const resp = await goApi.get(`/chats/${chat.chatID}/messages`);
    const raw = resp.data;

    // 2) Собираем уникальных отправителей
    const unique = Array.from(
      new Set(raw.map(m => `${m.SenderType || ""}:${m.SenderID}`))
    ).map(s => {
      const [senderType, senderID] = s.split(":");
      return { senderType: senderType || "student", senderID };
    });

    // 3) Для каждого — запрашиваем данные из Django
    const studentFetches = unique
      .filter(u => u.senderType === "student")
      .map(async u => {
        const r = await api.get(`/student-in-dorm/?student_id=${u.senderID}`);
        const recs = Array.isArray(r.data)
          ? r.data
          : Array.isArray(r.data.results)
            ? r.data.results
            : [];
        if (!recs.length) {
          return {
            key: `student:${u.senderID}`,
            name: t("adminDormChatPage.unknown"),
            avatar: null,
            room: "—"
          };
        }
        const first = recs[0];
        return {
          key: `student:${u.senderID}`,
          name: `${first.student.last_name} ${first.student.first_name}`,
          avatar: first.student.avatar
            ? first.student.avatar.startsWith("http")
              ? first.student.avatar
              : `http://127.0.0.1:8000${first.student.avatar}`
            : null,
          room: first.room.number || "—"
        };
      });

    const adminFetches = unique
      .filter(u => u.senderType === "admin")
      .map(async u => {
        const r = await api.get(`/admins/${u.senderID}/`);
        const a = r.data;
        return {
          key: `admin:${u.senderID}`,
          name: `${a.last_name} ${a.first_name}`,
          avatar: a.avatar
            ? a.avatar.startsWith("http")
              ? a.avatar
              : `http://127.0.0.1:8000${a.avatar}`
            : null,
          room: t("adminDormChatPage.commandant")
        };
      });

    const studentsData = await Promise.all(studentFetches);
    const adminsData = await Promise.all(adminFetches);

    // 4) Собираем словарь
    const map = {};
    [...studentsData, ...adminsData].forEach(u => {
      map[u.key] = u;
    });

    // 5) Обогащаем каждое сообщение
    const enriched = raw.map(m => {
      const type = m.SenderType || "student";
      const key = `${type}:${m.SenderID}`;
      const info = map[key] || {
        name: t("adminDormChatPage.unknown"),
        avatar: null,
        room: "—"
      };
      const isAdmin = type === "admin";

      return {
        id: m.ID,
        chat_id: m.ChatID,
        sender_type: type,
        sender_id: m.SenderID,
        content: m.Content,
        timestamp: m.CreatedAt,
        senderName: info.name,
        roomNumber: isAdmin
          ? t("adminDormChatPage.commandant")
          : info.room,
        avatarUrl: isAdmin ? null : info.avatar
      };
    });

    setMessages(enriched);
  };

  // === Отправка нового сообщения ===
  const handleSendMessage = async e => {
    e.preventDefault();
    if (!input.trim() || !activeChatId) return;

    const body = {
      content: input.trim(),
      sender_type: "admin"
    };
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
        sender_type: "admin",
        sender_id: m.SenderID,
        content: m.Content,
        timestamp: m.CreatedAt,
        senderName: `${admin.last_name} ${admin.first_name}`,
        roomNumber: t("adminDormChatPage.commandant"),
        avatarUrl: null
      }
    ]);
    setInput("");
  };

  return (
    <div className="admin-chat-page">
      <AdminSidebar />

      <div className="admin-chat-content">
        {/* Левая колонка */}
        <div className="admin-chat-list">
          <div className="chat-list-header">
            {t("adminDormChatPage.headerListTitle")}
          </div>

          <div className="chat-list-search-row">
            <input
              type="text"
              className="chat-list-search"
              placeholder={t("adminDormChatPage.searchPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <img
              src={searchIcon}
              alt={t("adminDormChatPage.icons.alt.search")}
              className="chat-list-search-icon"
            />
          </div>

          <div className="chat-list-scroll">
            {visibleChats.length > 0 ? (
              visibleChats.map(chat => {
                let title;
                if (chat.type === "dorm") {
                  title =
                    dorms.find(d => d.id === chat.dormID)?.name ||
                    chat.dormID;
                } else {
                  const name =
                    dorms.find(d => d.id === chat.dormID)?.name ||
                    chat.dormID;
                  title = `${name}, ${t(
                    "adminDormChatPage.floorLabel"
                  )} ${chat.floor}`;
                }
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
                {t("adminDormChatPage.noChats")}
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
                  ? dorms.find(d => d.id === activeChatMeta.dormID)?.name ||
                    activeChatMeta.dormID
                  : `${dorms.find(d => d.id === activeChatMeta.dormID)
                      ?.name || activeChatMeta.dormID}, ${t(
                      "adminDormChatPage.floorLabel"
                    )} ${activeChatMeta.floor}`}
              </div>

              <div className="chat-main-messages">
                {messages.length > 0 ? (
                  messages.map(msg => {
                    const time = new Date(msg.timestamp).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    );
                    const isStudent = msg.sender_type === "student";

                    return (
                      <div
                        key={msg.id}
                        className={`chat-message-row ${
                          isStudent
                            ? "chat-message-row--other"
                            : "chat-message-row--own"
                        }`}
                      >
                        <div className="chat-avatar">
                          {msg.avatarUrl ? (
                            <img
                              src={msg.avatarUrl}
                              alt={msg.senderName}
                              className="chat-avatar__img"
                              width="30"
                            />
                          ) : (
                            <div className="chat-avatar__placeholder" />
                          )}
                        </div>
                        <div className="chat-message-body">
                          <div className="chat-message-header">
                            <span className="chat-message-sender">
                              {msg.senderName}
                            </span>
                            <span className="chat-message-room">
                              {isStudent
                                ? `, ${t(
                                    "adminDormChatPage.roomLabel"
                                  )} ${msg.roomNumber}`
                                : ""}
                            </span>
                          </div>
                          <div
                            className={`chat-message-bubble ${
                              isStudent
                                ? "chat-message-bubble--student"
                                : "chat-message-bubble--admin"
                            }`}
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
                    {t("adminDormChatPage.noMessages")}
                  </div>
                )}
              </div>

              <form
                className="chat-main-input-row"
                onSubmit={handleSendMessage}
              >
                <input
                  className="chat-main-input"
                  placeholder={t("adminDormChatPage.inputPlaceholder")}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  autoComplete="off"
                />
                <button
                  className="chat-main-send-btn"
                  type="submit"
                  tabIndex={-1}
                  aria-label={t("adminDormChatPage.icons.alt.send")}
                >
                  <svg
                    width={32}
                    height={32}
                    viewBox="0 0 32 32"
                    fill="none"
                  >
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
              {t("adminDormChatPage.selectChat")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
