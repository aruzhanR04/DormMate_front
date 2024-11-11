import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import '../styles/ChatIcon.css';

const ChatIcon = ({ isChatOpen, toggleChat }) => (
    <div className="chat-icon-container" onClick={toggleChat}>
        <FiMessageCircle className="chat-icon" />
    </div>
);

export default ChatIcon;
