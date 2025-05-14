import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../styles/AdminChat.css';

const AdminChat = ({ chatId, onClose, studentName }) => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [error, setError] = useState(null);
  const userType = localStorage.getItem('user_type');

  const loadMessages = async () => {
    try {
      const res = await api.get(`chats/${chatId}/messages/`);
      const data = Array.isArray(res.data.results) ? res.data.results : res.data;

      const transformed = data.map(msg => {
        const timeString = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }) : '';

        return {
          id: msg.id,
          content: msg.content,
          senderType: msg.sender_type,
          isAdmin: msg.sender_type === 'admin',
          time: timeString,
        };
      });

      setMessages(transformed);
    } catch (err) {
      console.error('Ошибка при загрузке сообщений:', err);
      setError('Не удалось загрузить сообщения.');
    }
  };

  useEffect(() => {
    if (chatId) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [chatId]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      await api.post(`/chats/${chatId}/send/`, { text: reply });
      setReply('');
      await loadMessages();
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      setError('Ошибка при отправке сообщения.');
    }
  };

  const handleEndChat = async () => {
    try {
      await api.post(`chats/${chatId}/end/`);
      setMessages([{
        id: 'end',
        senderType: 'system',
        content: 'Чат завершен. До свидания!',
        isAdmin: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      console.error('Ошибка при завершении чата:', err);
      setError('Ошибка при завершении чата.');
    }
  };

  return (
    <div className="admin-chat-container">
      <div className="admin-chat-header">
        <button className='back-button' onClick={onClose}>⬅ Назад</button>
        {studentName && <h3>Чат со студентом: {studentName}</h3>}
      </div>
      <div className="admin-chat-box">
        {messages.length > 0 ? (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`admin-chat-message ${msg.isAdmin ? 'admin' : 'student'}`}
            >
              <div className={`message-bubble ${msg.isAdmin ? 'admin' : 'student'}`}>
                <p className="message-text">{msg.content}</p>
                
              </div>
              <span className="message-time">{msg.time}</span>
            </div>
          ))
        ) : (
          <p className="loading">Загрузка сообщений...</p>
        )}
      </div>
      <form onSubmit={handleSendReply} className="admin-input-container">
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button type="submit">Отправить</button>
      </form>
      <div className="admin-chat-actions">
        <button onClick={handleEndChat} className="end-chat">Завершить чат</button>
      </div>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
};

export default AdminChat;
