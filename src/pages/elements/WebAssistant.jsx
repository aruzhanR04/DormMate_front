import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import '../../styles/ChatAssistant.css';

const WebAssistant = () => {
  const [chatId, setChatId] = useState(localStorage.getItem('chatId') || null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatActive, setChatActive] = useState(true);
  const [error, setError] = useState(null);
  const [isOperatorConnected, setIsOperatorConnected] = useState(false);

  const chatBoxRef = useRef(null);

  const userType = localStorage.getItem('user_type') || 'student';

  const fetchMessages = async (cId) => {
    try {
      const [msgRes, chatRes] = await Promise.all([
        api.get(`chats/${cId}/messages/`),
        api.get(`chats/${cId}/`)
      ]);
      const data = Array.isArray(msgRes.data) ? msgRes.data : msgRes.data.results || [];
      const transformed = data.map((msg) => {
        const senderType = msg.sender_type;
        const isUser = senderType === userType;
        let timeString = '';
        if (msg.timestamp) {
          const d = new Date(msg.timestamp);
          if (!isNaN(d)) {
            timeString = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        }
        return {
          id: msg.id,
          text: msg.content,
          type: isUser ? 'user' : 'admin',
          timestamp: timeString,
        };
      });
      setMessages(transformed);
      setIsOperatorConnected(chatRes.data.is_operator_connected);
    } catch (err) {
      if (err.response?.status === 404) {
        localStorage.removeItem('chatId');
        setChatId(null);
      }
      setError('Ошибка при загрузке сообщений.');
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chatActive) return;
    const text = userInput;
    setUserInput('');
    const fallbackMessage = 'Ваш вопрос сложный! Оператор скоро подключится и поможет вам.';
    try {
      const searchRes = await api.get(`questions/?search=${encodeURIComponent(text)}`);
      const autoAnswer = searchRes.data?.[0]?.answer;
      let currentChatId = chatId;
      if (!currentChatId) {
        const createRes = await api.post('student/chats/create/', {});
        currentChatId = createRes.data.id;
        setChatId(currentChatId);
        localStorage.setItem('chatId', currentChatId);
      }
      await api.post(`chats/${currentChatId}/send/`, { text });
      fetchMessages(currentChatId);
      if (autoAnswer && !isOperatorConnected) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            text: autoAnswer,
            type: userType === 'student' ? 'admin' : 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (autoAnswer === fallbackMessage) {
          handleRequestOperator();
        }
      } else if (!autoAnswer && !isOperatorConnected) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            text: fallbackMessage,
            type: userType === 'student' ? 'admin' : 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        handleRequestOperator();
      } else {
        fetchMessages(currentChatId);
      }
    } catch (err) {
      setError('Не удалось отправить сообщение.');
    }
  };

  const handleRequestOperator = async () => {
    // if (!chatId || !chatActive) return;
    // try {
    //   await api.post('notifications/request-admin/', { chat_id: chatId });
    //   setMessages(prev => [
    //     ...prev,
    //     {
    //       id: Date.now() + 2,
    //       text: 'Оператор вызван. Ожидайте...',
    //       type: userType === 'student' ? 'admin' : 'user',
    //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //     }
    //   ]);
    // } catch (err) {
    //   setError('Не удалось вызвать оператора.');
    // }
  };

  const handleEndChat = async () => {
    if (!chatId || !chatActive) return;
    try {
      await api.post(`chats/${chatId}/end/`);
      setChatActive(false);
      setMessages(prev => [
        ...prev,
        {
          id: 'end',
          text: 'Чат завершён.',
          type: userType === 'student' ? 'admin' : 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      localStorage.removeItem('chatId');
      setChatId(null);
    } catch (err) {
      setError('Не удалось завершить чат.');
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
      const interval = setInterval(() => fetchMessages(chatId), 5000);
      return () => clearInterval(interval);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="web-assistant">
      <div className="chat-container">
        <div className="chat-header">
          <span>Веб-помощник</span>
          <button className="chat-close-btn" title="Закрыть" onClick={handleEndChat}>×</button>
        </div>
        <div className="chat-box" ref={chatBoxRef}>
          {messages.length > 0 ? (
            messages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.type}`}>
                <span className="text">{msg.text}</span>
                {msg.timestamp && (
                  <span className="timestamp">{msg.timestamp}</span>
                )}
              </div>
            ))
          ) : (
            <p className="empty-messages">Нет сообщений</p>
          )}
        </div>

        {error && <p className="chat-error">{error}</p>}

        {chatActive ? (
          <div className="chat-footer">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Введите вопрос..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="send-btn" onClick={handleSendMessage}>➤</button>
            </div>
            <div className="chat-actions">
              <button className="operator-btn" onClick={handleRequestOperator}>Вызвать оператора</button>
              <button className="end-btn" onClick={handleEndChat}>Завершить чат</button>
            </div>
          </div>
        ) : (
          <p className="chat-ended">Чат завершён.</p>
        )}
      </div>
    </div>
  );
};

export default WebAssistant;
