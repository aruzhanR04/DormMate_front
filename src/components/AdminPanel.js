import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import AdminChat from './AdminChat';
import '../styles/AdminPanel.css';
import sbttn from '../assets/sbttn.svg';
import dbttn from '../assets/dbttn.svg';
import abttn from '../assets/abttn.svg';

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
                {/* Check if no chat is selected and chat list is not visible */}
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
                            <div className="dashboard-button" onClick={handleShowChats}>
                                💬 Чаты
                            </div>
                        </div>
                    </>
                )}

                {/* Show the chat list if showChatList is true */}
                {showChatList && (
                    <ChatList onSelectChat={handleOpenChat} />
                )}

                {/* Show the selected chat */}
                {selectedChatId && (
                    <AdminChat chatId={selectedChatId} onClose={() => setSelectedChatId(null)} />
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
