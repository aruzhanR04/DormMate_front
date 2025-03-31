import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/ChatList.css';

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);

  const fetchChats = async () => {
    try {
      const res = await api.get('chats/');
      const data = Array.isArray(res.data.results) ? res.data.results : res.data;
      setChats(data);
    } catch (err) {
      console.error('Ошибка при загрузке чатов:', err);
      setError('Не удалось загрузить список чатов.');
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="chat-list-container">
      <h2 className="chat-list-title">Чаты со студентами</h2>
      {error && <p className="error">{error}</p>}
      {chats.length > 0 ? (
        <table className="chat-table">
          <thead>
            <tr>
              <th>Студент</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {chats.map(chat => (
              <tr key={chat.id} className={chat.has_new_messages ? 'unread' : ''}>
                <td>{chat.student.s} {chat.student.first_name} {chat.student.last_name}</td>
                <td className="chat-actions">
                  {chat.has_new_messages && (
                    <button
                      className="reply"
                      onClick={() => onSelectChat(chat.id, `${chat.student.s} ${chat.student.first_name} ${chat.student.last_name}`)}
                    >
                      Ответить
                    </button>
                  )}
                  <button
                    className="view"
                    onClick={() => onSelectChat(chat.id, `${chat.student.s} ${chat.student.first_name} ${chat.student.last_name}`)}
                  >
                    Просмотр
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-chats">Нет активных чатов</p>
      )}
    </div>
  );
};

export default ChatList;
