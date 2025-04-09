import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from '../chat/ChatList';
import AdminChat from './AdminChat';
import '../../styles/AdminPanel.css';
import sbttn from '../../assets/icons/sbttn.svg';
import dbttn from '../../assets/icons/dbttn.svg';
import abttn from '../../assets/icons/abttn.svg';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showChatList, setShowChatList] = useState(false);

  const handleOpenChat = (chatId) => {
    setSelectedChatId(chatId);
    setShowChatList(false);
  };

  const handleShowChats = () => {
    setSelectedChatId(null);
    setShowChatList(true);
  };

  return (
    <div className="admin-panel">
      <div className="content-container">
        {/* Если чат не выбран и список чатов не отображается */}
        {!selectedChatId && !showChatList && (
          <>
            <div className="dashboard-buttons">
              <div className="dashboard-button" onClick={() => navigate('/admin/students')}>
                <img src={sbttn} alt="Студенты" />
              </div>
              <div className="dashboard-button" onClick={() => navigate('/admin/dormitories')}>
                <img src={dbttn} alt="Общежития" />
              </div>
              <div className="dashboard-button" onClick={() => navigate('/admin/applications')}>
                <img src={abttn} alt="Заявки" />
              </div>
            </div>

            <div className="chat-button" onClick={handleShowChats}>
              💬 Чаты
            </div>
          </>
        )}

        {showChatList && <ChatList onSelectChat={handleOpenChat} />}
        {selectedChatId && <AdminChat chatId={selectedChatId} onClose={() => setSelectedChatId(null)} />}
      </div>
    </div>
  );
};

export default AdminPanel;
