// src/components/StudentDormChat.jsx
import React, { useState, useEffect } from "react";
import api from "../../api";         // Axios-инстанс для Django
import goApi from "../../goApi";     // Axios-инстанс для Go
import "../../styles/AdminChat.css";
import searchIcon from "../../assets/icons/Search.svg";

export default function StudentDormChat() {
  // 0) Данные залогиненного студента (из Django)
  const [student, setStudent] = useState(null);

  // 1) dormID, dormName, floor и номер комнаты студента (из StudentInDorm)
  const [studentDormID, setStudentDormID] = useState(null);
  const [studentDormName, setStudentDormName] = useState("");
  const [studentFloor, setStudentFloor] = useState(null);
  const [studentRoomNumber, setStudentRoomNumber] = useState("");

  // 1.5) Нормализованный URL аватарки текущего студента
  const [studentAvatarUrl, setStudentAvatarUrl] = useState(null);

  // 2) Все чаты из Go-базы
  const [allChats, setAllChats] = useState([]);

  // 3) Отфильтрованные чаты (по dormID + floor)
  const [visibleChats, setVisibleChats] = useState([]);

  // 4) Выбранный чат
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatMeta, setActiveChatMeta] = useState(null);

  // 5) Сообщения в выбранном чате (обогащённые полями: SenderName, RoomNumber, AvatarUrl)
  const [messages, setMessages] = useState([]);

  // 6) Поле поиска и ввод нового сообщения
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");

  // 7) Состояние синхронизации чатов
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  // ============================
  // 0) Загрузка данных текущего студента (Django)
  // ============================
  useEffect(() => {
    async function fetchStudentDetail() {
      try {
        const resp = await api.get("/studentdetail/");
        setStudent(resp.data);
      } catch (err) {
        console.error("Ошибка при запросе /studentdetail/:", err);
      }
    }
    fetchStudentDetail();
  }, []);

  // ============================
  // 1) Получаем dormID, dormName, floor и номер комнаты из StudentInDorm (Django)
  // ============================
  useEffect(() => {
    if (!student || !student.id) return;

    async function fetchStudentInDorm() {
      try {
        const resp = await api.get(
          `/student-in-dorm/?student_id=${student.id}`
        );
        const records = Array.isArray(resp.data)
          ? resp.data
          : Array.isArray(resp.data.results)
          ? resp.data.results
          : [];
        if (records.length === 0) return;

        const first = records[0];
        if (
          first.dorm &&
          typeof first.dorm.id === "number" &&
          typeof first.dorm.name === "string" &&
          first.room &&
          typeof first.room.floor === "number"
        ) {
          setStudentDormID(first.dorm.id);
          setStudentDormName(first.dorm.name);
          setStudentFloor(first.room.floor);
          if (first.room.number) {
            setStudentRoomNumber(first.room.number);
          }
        }
      } catch (err) {
        console.error("Ошибка при запросе StudentInDorm:", err);
      }
    }

    fetchStudentInDorm();
  }, [student]);

  // ============================
  // 1.5) Нормализуем URL своей аватарки (если есть)
  // ============================
  useEffect(() => {
    if (!student) {
      setStudentAvatarUrl(null);
      return;
    }
    if (!student.avatar) {
      setStudentAvatarUrl(null);
      return;
    }
    const raw = student.avatar;
    if (raw.startsWith("http")) {
      setStudentAvatarUrl(raw);
    } else {
      setStudentAvatarUrl(`http://127.0.0.1:8000${raw}`);
    }
  }, [student]);

  // ============================
  // 2) Загружаем все чаты из Go, когда знаем dormID + floor
  // ============================
  useEffect(() => {
    if (studentDormID == null || studentFloor == null) {
      setAllChats([]);
      return;
    }
    async function fetchChats() {
      try {
        const resp = await goApi.get("/chats");
        setAllChats(resp.data);
      } catch (err) {
        console.error("Ошибка при загрузке списка чатов из Go:", err);
      }
    }
    fetchChats();
  }, [studentDormID, studentFloor]);

  // ============================
  // 3) Фильтрация чатов по dormID + floor
  // ============================
  useEffect(() => {
    if (!Array.isArray(allChats) || allChats.length === 0) {
      setVisibleChats([]);
      return;
    }
    if (studentDormID == null || studentFloor == null) {
      setVisibleChats([]);
      return;
    }
    const filtered = allChats.filter((chat) => {
      if (chat.type === "dorm" && chat.dormID === studentDormID) return true;
      if (
        chat.type === "floor" &&
        chat.dormID === studentDormID &&
        chat.floor === studentFloor
      )
        return true;
      return false;
    });
    setVisibleChats(filtered);
  }, [allChats, studentDormID, studentFloor]);

  // ============================
  // 4) При выборе чата: загружаем сообщения (Go) и обогащаем их данными из Django или Admin
  // ============================
  const handleSelectChat = async (chat) => {
    setActiveChatId(chat.chatID);
    setActiveChatMeta(chat);
    setMessages([]);

    try {
      // 4.1 Получаем «сырые» сообщения из Go
      const resp = await goApi.get(`/chats/${chat.chatID}/messages`);
      const rawMessages = resp.data;

      // 4.2 Собираем уникальный набор “тип:ID” для отправителей
      const uniqueSenders = Array.from(
        new Set(
          rawMessages.map((m) => {
            // Если Go не присылает SenderType, считаем «student»
            const stype = m.SenderType || "student";
            return `${stype}:${m.SenderID}`;
          })
        )
      ).map((composite) => {
        const [senderType, senderID] = composite.split(":");
        return { senderType, senderID };
      });

      // 4.3 Для каждого uniqueSender запрашиваем данные:
      //      – если student: GET /student-in-dorm/?student_id={id}
      //      – если admin:   GET /admins/{id}/
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

      // 4.4 Ждём, пока оба массива промисов выполнятся
      const [studentsData, adminsData] = await Promise.all([
        Promise.all(studentFetches),
        Promise.all(adminFetches),
      ]);

      // 4.5 Собираем единый словарь: key → { senderName, avatarUrl, roomNumber }
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
          roomNumber: u.roomNumber,
        };
      });

      // 4.6 Обогащаем каждое сообщение и записываем в стейт
      const enrichedMessages = rawMessages.map((m) => {
        const senderTypeNormalized = m.SenderType || "student";
        const compositeKey = `${senderTypeNormalized}:${m.SenderID}`;
        const info = senderMap[compositeKey] || {
          senderName: "Неизвестный",
          avatarUrl: null,
          roomNumber: "—",
        };

        const finalName = info.senderName;
        const finalRoom =
          senderTypeNormalized === "admin" ? "комендант" : info.roomNumber;

        return {
          ID: m.ID,
          ChatID: m.ChatID,
          SenderID: m.SenderID,
          SenderType: senderTypeNormalized,
          Content: m.Content,
          CreatedAt: m.CreatedAt,
          SenderName: finalName,
          RoomNumber: finalRoom,
          AvatarUrl:
            senderTypeNormalized === "admin" ? null : info.avatarUrl,
        };
      });

      setMessages(enrichedMessages);
    } catch (err) {
      console.error("Не удалось загрузить/обогатить сообщения:", err);
    }
  };

  // ============================
  // 5) Отправка нового сообщения (Go)
  // ============================
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChatId) return;
  
    try {
      const body = {
        content: input.trim(),
        sender_type: "student"
      };
      const resp = await goApi.post(
        `/chats/${activeChatId}/messages`,
        body
      );
  
      const currentFullName = student
        ? `${student.last_name} ${student.first_name}`
        : "Я";
      const currentRoom = studentRoomNumber || "—";
      const newMsg = {
        ID: resp.data.ID,
        ChatID: resp.data.ChatID,
        SenderID: resp.data.SenderID,
        SenderType: resp.data.SenderType,
        Content: resp.data.Content,
        CreatedAt: resp.data.CreatedAt,
        SenderName: currentFullName,
        RoomNumber: currentRoom,
        AvatarUrl: studentAvatarUrl,
      };
  
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    } catch (err) {
      console.error("Ошибка при отправке сообщения в Go:", err);
    }
  };
  

  // ============================
  // 6) Синхронизация чатов: init_all и cleanup (опционально)
  // ============================
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage("");
    try {
      const initResp = await goApi.post("/chats/init_all");
      const cleanupResp = await goApi.delete("/chats/cleanup");
      if (studentDormID != null && studentFloor != null) {
        const resp = await goApi.get("/chats");
        setAllChats(resp.data);
      }
      setSyncMessage(
        `Синхронизация выполнена. init_all: ${initResp.data.message}. ` +
          `cleanup: удалено ${cleanupResp.data.deleted_chats} чатов.`
      );
    } catch (err) {
      console.error("Ошибка синхронизации чатов:", err);
      setSyncMessage(
        `Ошибка синхронизации: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // ============================
  // JSX-разметка
  // ============================
  return (
    <div className="admin-chat-page">
      <div className="admin-chat-content">
        {/* Левая колонка: кнопка синхронизации + список чатов */}
        <div className="admin-chat-list">
          <div className="chat-list-header">
            <span>Чаты</span>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              style={{
                marginLeft: "10px",
                padding: "4px 8px",
                fontSize: "14px",
                cursor: isSyncing ? "not-allowed" : "pointer",
              }}
            >
              {isSyncing ? "Синхронизируем..." : "Синхронизировать чаты"}
            </button>
          </div>
          {syncMessage && (
            <div
              style={{
                padding: "6px 8px",
                fontSize: "13px",
                color: "#333",
                background: "#f0f0f0",
                margin: "4px 0",
                borderRadius: "4px",
              }}
            >
              {syncMessage}
            </div>
          )}

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
              visibleChats
                .filter((chat) => {
                  if (!search.trim()) return true;
                  return chat.name
                    .toLowerCase()
                    .includes(search.trim().toLowerCase());
                })
                .map((chat) => {
                  const title =
                    chat.type === "dorm"
                      ? studentDormName
                      : `Этаж ${chat.floor} (${studentDormName})`;
                  return (
                    <div
                      key={chat.id}
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
              <div className="chat-list-empty">Нет чатов</div>
            )}
          </div>
        </div>

        {/* Правая колонка: переписка выбранного чата */}
        <div className="admin-chat-main">
          {activeChatMeta ? (
            <>
              {/* Заголовок: название текущего чата */}
              <div className="chat-main-header">
                {activeChatMeta.type === "dorm"
                  ? studentDormName
                  : `Этаж ${activeChatMeta.floor} (${studentDormName})`}
              </div>

              {/* Список сообщений */}
              <div className="chat-main-messages">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    // Время сообщения в формате hh:mm
                    const timeString = new Date(msg.CreatedAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );
                    const isStudentMessage = msg.SenderType === "student";
                    const bubbleClass = isStudentMessage
                      ? "chat-message-bubble--student"
                      : "chat-message-bubble--admin";

                    return (
                      <div
                        key={msg.ID}
                        className={
                          "chat-message-row " +
                          (msg.SenderID === String(student?.id)
                            ? "chat-message-row--own"
                            : "chat-message-row--other")
                        }
                      >
                        {/* Автарка слева */}
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

                        {/* ===== Тело сообщения ===== */}
                        <div className="chat-message-body">
                          {/* 1) ФИО + роль/комната */}
                          <div className="chat-message-header">
                            <span className="chat-message-sender">
                              {msg.SenderName}
                            </span>
                            <span className="chat-message-room">
                              {msg.SenderType === "student"
                                ? `, комната ${msg.RoomNumber}`
                                : `, ${msg.RoomNumber}`}
                            </span>
                          </div>

                          {/* 2) Пузырёк с текстом + временем */}
                          <div
                            className={
                              "chat-message-bubble " +
                              (msg.SenderID === String(student?.id)
                                ? "chat-message-bubble--own"
                                : "chat-message-bubble--other")
                            }
                          >
                            <span className="chat-message-text">
                              {msg.Content}
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

              {/* Поле ввода + кнопка отправки */}
              <form
                className="chat-main-input-row"
                onSubmit={handleSendMessage}
              >
                <input
                  className="chat-main-input"
                  placeholder="Введите ваше сообщение..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
              Выберите чат для переписки
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
