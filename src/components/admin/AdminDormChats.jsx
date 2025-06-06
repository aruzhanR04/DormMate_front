// src/pages/admin/AdminDormChatPage.jsx
import React, { useState, useEffect } from "react";
import api from "../../api";      // Axios-инстанс для Django
import goApi from "../../goApi";  // Axios-инстанс для Go
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminChat.css";
import searchIcon from "../../assets/icons/Search.svg";

export default function AdminDormChatPage() {
  // 0) Данные текущего админа
  const [admin, setAdmin] = useState(null);

  // 1) ID общежитий, где admin — комендант
  const [dormIDs, setDormIDs] = useState([]);

  // 2) Список всех чатов (фильтруем по dormIDs)
  const [allChats, setAllChats] = useState([]);
  const [visibleChats, setVisibleChats] = useState([]);

  // 3) Поисковая строка
  const [search, setSearch] = useState("");

  // 4) Выбранный чат и его мета
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatMeta, setActiveChatMeta] = useState(null);

  // 5) Сообщения в выбранном чате (обогащённые)
  const [messages, setMessages] = useState([]);

  // 6) Текст нового сообщения
  const [input, setInput] = useState("");

  // ============================
  // 0) Подгружаем данные админа через /admins/me/
  // ============================
  useEffect(() => {
    api
      .get("/admins/me/")
      .then((resp) => {
        setAdmin(resp.data);
      })
      .catch((err) => {
        console.error("Ошибка при запросе /admins/me/:", err);
      });
  }, []);

  // ============================
  // 1) Когда админ получен, запрашиваем все dorm, где он — комендант
  // ============================
  useEffect(() => {
    if (!admin || !admin.id) return;

    api
      .get(`/dorms/?commandant=${admin.id}`)
      .then((resp) => {
        const dorms = Array.isArray(resp.data)
          ? resp.data
          : Array.isArray(resp.data.results)
          ? resp.data.results
          : [];
        const ids = dorms.map((d) => d.id);
        setDormIDs(ids);
        console.log("AdminDormChatPage: dormIDs for admin:", ids);
      })
      .catch((err) => {
        console.error("Ошибка при запросе /dorms/?commandant=:", err);
      });
  }, [admin]);

  // ============================
  // 2) Получаем все чаты из Go и фильтруем по dormIDs
  // ============================
  useEffect(() => {
    if (!dormIDs.length) {
      console.log("У этого админа нет подчинённых общежитий, чатов нет.");
      setAllChats([]);
      setVisibleChats([]);
      return;
    }

    goApi
      .get("/chats")
      .then((resp) => {
        // resp.data = [{ chatID, dormID, floor, type, has_new_messages, … }, …]
        const filtered = resp.data.filter((chat) =>
          dormIDs.includes(chat.dormID)
        );
        setAllChats(filtered);
        setVisibleChats(filtered);
        console.log(`Найдено ${filtered.length} чат(ов).`, filtered);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке списка чатов (Go):", err);
      });
  }, [dormIDs]);

  // ============================
  // 3) Фильтрация visibleChats по поиску (по названию: “общежитие X” или “этаж Y”)
  // ============================
  useEffect(() => {
    if (!search.trim()) {
      setVisibleChats(allChats);
      return;
    }
    const lower = search.trim().toLowerCase();
    setVisibleChats(
      allChats.filter((chat) => {
        const title =
          chat.type === "dorm"
            ? `общежитие ${chat.dormID}`
            : `этаж ${chat.floor} (общежитие ${chat.dormID})`;
        return title.toLowerCase().includes(lower);
      })
    );
  }, [search, allChats]);

  // ============================
  // 4) При выборе чата загружаем сообщения и обогащаем их
  // ============================
  const handleSelectChat = async (chat) => {
    setActiveChatId(chat.chatID);
    setActiveChatMeta(chat);
    setMessages([]);

    try {
      // 4.1) Получаем «сырые» сообщения
      const resp = await goApi.get(`/chats/${chat.chatID}/messages`);
      // rawMessages: [{ ID, ChatID, SenderID, SenderType, Content, CreatedAt }, …]
      const rawMessages = resp.data;
      console.log("Raw messages from Go:", rawMessages);

      // 4.2) Собираем уникальный набор “тип:ID” для отправителей,
      //      но если SenderType пуст – определяем по соответствию ID текущему админу
      const uniqueSenders = Array.from(
        new Set(
          rawMessages.map((m) => {
            // Если Go не присылает SenderType, проверяем: совпадает ли SenderID с admin.id
            const stype =
              m.SenderType ||
              (m.SenderID === String(admin?.id) ? "admin" : "student");
            return `${stype}:${m.SenderID}`;
          })
        )
      ).map((composite) => {
        const [senderType, senderID] = composite.split(":");
        return { senderType, senderID };
      });
      console.log("Unique senders:", uniqueSenders);

      // 4.3) Для каждого uniqueSender делаем запрос к нужному эндпоинту
      //   – если student: GET /student-in-dorm/?student_id={id}
      //   – если admin:   GET /admins/{id}/
      const studentFetches = uniqueSenders
        .filter((u) => u.senderType === "student")
        .map((u) =>
          api.get(`/student-in-dorm/?student_id=${u.senderID}`).then((r) => {
            const records = Array.isArray(r.data)
              ? r.data
              : Array.isArray(r.data.results)
              ? r.data.results
              : [];
            if (!records.length) {
              return {
                key: `student:${u.senderID}`,
                senderName: "Неизвестный",
                avatarUrl: null,
                roomNumber: "—",
              };
            }
            const first = records[0];
            const fullName = `${first.student.last_name} ${first.student.first_name}`;
            const roomNum = first.room?.number || "—";
            let avatarUrl = null;
            if (first.student.avatar) {
              const rawAvatar = first.student.avatar;
              avatarUrl = rawAvatar.startsWith("http")
                ? rawAvatar
                : `http://127.0.0.1:8000${rawAvatar}`;
            }
            return {
              key: `student:${u.senderID}`,
              senderName: fullName,
              avatarUrl,
              roomNumber: roomNum,
            };
          })
        );

      const adminFetches = uniqueSenders
        .filter((u) => u.senderType === "admin")
        .map((u) =>
          api.get(`/admins/${u.senderID}/`).then((r) => {
            const a = r.data; // { id, first_name, last_name, avatar, … }
            const fullName = `${a.last_name} ${a.first_name}`;
            let avatarUrl = null;
            if (a.avatar) {
              avatarUrl = a.avatar.startsWith("http")
                ? a.avatar
                : `http://127.0.0.1:8000${a.avatar}`;
            }
            return {
              key: `admin:${u.senderID}`,
              senderName: fullName,
              avatarUrl,
              roomNumber: "комендант",
            };
          })
        );

      // 4.4) Ждём, пока оба массива промисов выполнятся
      const [studentsData, adminsData] = await Promise.all([
        Promise.all(studentFetches),
        Promise.all(adminFetches),
      ]);
      console.log("studentsData:", studentsData);
      console.log("adminsData:", adminsData);

      // 4.5) Собираем единый словарь: key → { senderName, avatarUrl, roomNumber }
      const senderMap = {};
      studentsData.forEach((u) => {
        senderMap[u.key] = {
          senderName: u.senderName,
          avatarUrl: u.avatarUrl,
          roomNumber: u.roomNumber,
        };
      });
      adminsData.forEach((u) => {
        senderMap[u.key] = {
          senderName: u.senderName,
          avatarUrl: u.avatarUrl,
          roomNumber: u.roomNumber, // здесь "комендант"
        };
      });
      console.log("senderMap:", senderMap);

      // 4.6) Перебираем каждое “сырое” сообщение и добавляем поля
      const enrichedMessages = rawMessages.map((m) => {
        // m = { ID, ChatID, SenderID, SenderType, Content, CreatedAt }
        const senderTypeNormalized =
          m.SenderType ||
          (m.SenderID === String(admin?.id) ? "admin" : "student");
        const compositeKey = `${senderTypeNormalized}:${m.SenderID}`;
        const info = senderMap[compositeKey] || {
          senderName: "Неизвестный",
          avatarUrl: null,
          roomNumber: "—",
        };

        // Если отправитель — текущий админ, то берём из admin
        const isCurrentAdmin =
          senderTypeNormalized === "admin" && m.SenderID === String(admin?.id);

        const finalName = isCurrentAdmin
          ? `${admin.last_name} ${admin.first_name}`
          : info.senderName;

        console.log(
          `Message ID=${m.ID} → SenderType="${senderTypeNormalized}", SenderID="${m.SenderID}", ` +
          `resolved SenderName="${finalName}", room="${info.roomNumber}"`
        );

        return {
          id: m.ID,
          chat_id: m.ChatID,
          sender_id: m.SenderID,
          sender_type: senderTypeNormalized,
          content: m.Content,
          timestamp: m.CreatedAt,
          SenderName: finalName,
          RoomNumber: info.roomNumber,
          AvatarUrl: isCurrentAdmin ? null : info.avatarUrl,
        };
      });

      setMessages(enrichedMessages);
    } catch (err) {
      console.error("Не удалось загрузить/обогатить сообщения:", err);
    }
  };

  // ============================
  // 5) Отправляем новое сообщение (Go)
  // ============================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChatId) return;

    try {
      // Обязательно указываем поле SenderType с заглавной буквой
      const body = {
        content: input.trim(),
        sender_type: "admin",
      };
      const resp = await goApi.post(
        `/chats/${activeChatId}/messages`,
        body
      );
      // resp.data: { ID, ChatID, SenderID, SenderType, Content, CreatedAt }
      console.log("Отправлено новое сообщение (Go ответ):", resp.data);

      const newMsg = {
        id: resp.data.ID,
        chat_id: resp.data.ChatID,
        sender_id: resp.data.SenderID,
        sender_type: "admin", // теперь гарантированно "admin"
        content: resp.data.Content,
        timestamp: resp.data.CreatedAt,
        SenderName: `${admin.last_name} ${admin.first_name}`,
        RoomNumber: "комендант",
        AvatarUrl: null,
      };

      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    } catch (err) {
      console.error("Ошибка при отправке сообщения (Go):", err);
    }
  };

  // ============================
  // 6) JSX-разметка
  // ============================
  return (
    <div className="admin-chat-page">
      <AdminSidebar />

      <div className="admin-chat-content">
        {/* Левая колонка: список чатов (по dorm/floor) */}
        <div className="admin-chat-list">
          <div className="chat-list-header">Чаты общежитий</div>

          <div className="chat-list-search-row">
            <input
              type="text"
              className="chat-list-search"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <img src={searchIcon} alt="" className="chat-list-search-icon" />
          </div>

          <div className="chat-list-scroll">
            {visibleChats.length > 0 ? (
              visibleChats.map((chat) => {
                const title =
                  chat.type === "dorm"
                    ? `Общежитие № ${chat.dormID}`
                    : `Этаж ${chat.floor} (общежитие № ${chat.dormID})`;

                return (
                  <div
                    key={chat.chatID}
                    className={
                      "chat-list-item" +
                      (activeChatId === chat.chatID
                        ? " chat-list-item-active"
                        : "") +
                      (chat.has_new_messages ? " chat-list-item-unread" : "")
                    }
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="chat-list-item-title">{title}</div>
                  </div>
                );
              })
            ) : (
              <div className="chat-list-empty">Нет чатов</div>
            )}
          </div>
        </div>

        {/* Правая колонка: переписка выбранного чата */}
        <div className="admin-chat-main">
          {activeChatMeta ? (
            <>
              <div className="chat-main-header">
                {activeChatMeta.type === "dorm"
                  ? `Чат: Общежитие № ${activeChatMeta.dormID}`
                  : `Чат: Этаж ${activeChatMeta.floor} (общежитие № ${activeChatMeta.dormID})`}
              </div>

              <div className="chat-main-messages">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    // форматируем время
                    const timeString = new Date(msg.timestamp).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    );
                    const isStudentMessage = msg.sender_type === "student";
                    const bubbleClass = isStudentMessage
                      ? "chat-message-bubble--student"
                      : "chat-message-bubble--admin";

                    return (
                      <div
                        key={msg.id}
                        className={
                          "chat-message-row " +
                          (isStudentMessage
                            ? "chat-message-row--other"
                            : "chat-message-row--own")
                        }
                      >
                        {/* Аватарка */}
                        <div className="chat-avatar">
                          {msg.AvatarUrl ? (
                            <img
                              src={msg.AvatarUrl}
                              alt={msg.SenderName}
                              className="chat-avatar__img"
                              width="30px"
                            />
                          ) : (
                            <div className="chat-avatar__placeholder" />
                          )}
                        </div>

                        {/* Тело сообщения */}
                        <div className="chat-message-body">
                          {/* Заголовок: имя + комната */}
                          <div className="chat-message-header">
                            <span className="chat-message-sender">
                              {msg.SenderName}
                            </span>
                            <span className="chat-message-room">
                              {isStudentMessage
                                ? `, комната ${msg.RoomNumber}`
                                : ""}
                            </span>
                          </div>

                          {/* Пузырёк с текстом и временем */}
                          <div className={"chat-message-bubble " + bubbleClass}>
                            <span className="chat-message-text">
                              {msg.content}
                            </span>
                            <span className="chat-message-time">
                              {timeString}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="chat-main-empty">Нет сообщений</div>
                )}
              </div>

              <form className="chat-main-input-row" onSubmit={handleSendMessage}>
                <input
                  className="chat-main-input"
                  placeholder="Введите ваше сообщение..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  autoComplete="off"
                />
                <button className="chat-main-send-btn" type="submit" tabIndex={-1}>
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
              Выберите чат для переписки
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
