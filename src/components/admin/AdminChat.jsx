import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminChat.css";
import searchIcon from "../../assets/icons/Search.svg";

const AdminChatPage = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatStudent, setActiveChatStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chats/");
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setChats(data);
      } catch (err) {
        setChats([]);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chats/${activeChatId}/messages/`);
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setMessages(data);
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [activeChatId]);

  const filteredChats = chats.filter(chat =>
    `${chat.student.last_name} ${chat.student.first_name} ${chat.student.s}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChatId) return;
    try {
      await api.post(`/chats/${activeChatId}/send/`, { text: input });
      setInput("");
      const res = await api.get(`/chats/${activeChatId}/messages/`);
      const data = Array.isArray(res.data.results) ? res.data.results : res.data;
      setMessages(data);
    } catch {}
  };

  const handleSelectChat = (chat) => {
    setActiveChatId(chat.id);
    setActiveChatStudent(chat.student);
  };

  return (
    <div className="admin-chat-page">
           <AdminSidebar />
      <div className="admin-chat-content">
      <div className="admin-chat-list">
        <div className="chat-list-header">Студенты</div>
        <div className="chat-list-search-row">
          <input
            type="text"
            className="chat-list-search"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <img src={searchIcon} alt="" className="chat-list-search-icon" />
        </div>
        <div className="chat-list-scroll">
          {filteredChats.length ? filteredChats.map(chat => (
            <div
              key={chat.id}
              className={
                "chat-list-item" +
                (activeChatId === chat.id ? " chat-list-item-active" : "") +
                (chat.has_new_messages ? " chat-list-item-unread" : "")
              }
              onClick={() => handleSelectChat(chat)}
            >
              <div className="chat-list-item-title">
                {chat.student.last_name} {chat.student.first_name} {chat.student.middle_name}
              </div>
              <div className="chat-list-item-sub">{chat.student.s}</div>
            </div>
          )) : (
            <div className="chat-list-empty">Нет чатов</div>
          )}
        </div>
      </div>

      <div className="admin-chat-main">
        {activeChatStudent ? (
          <>
            <div className="chat-main-header">
              Студент {activeChatStudent.s}
            </div>
            <div className="chat-main-messages">
              {messages.length ? messages.map(msg => (
                <div
                  key={msg.id}
                  className={
                    "chat-message " +
                    (msg.sender_type === "student"
                      ? "chat-message-student"
                      : "chat-message-admin")
                  }
                >
                  <div className="cnt"><div className="chat-message-text">{msg.content}</div>
                  <div className="chat-message-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></div>
                </div>
              )) : (
                <div className="chat-main-empty">Нет сообщений</div>
              )}
            </div>
            <form className="chat-main-input-row" onSubmit={handleSend}>
              <input
                className="chat-main-input"
                placeholder="Введите ваше сообщение..."
                value={input}
                onChange={e => setInput(e.target.value)}
                autoComplete="off"
              />
              <button className="chat-main-send-btn" type="submit" tabIndex={-1}>
                <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                  <path d="M8 24L24 16L8 8V14L20 16L8 18V24Z" fill="#BF2A45" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="chat-main-empty-center">
            Выберите студента для переписки
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
