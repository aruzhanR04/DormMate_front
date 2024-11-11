// components/ChatIcon.js
import React from 'react';
import { FiMessageCircle } from 'react-icons/fi'; // Используем библиотеку иконок, если установлена
import '../styles/ChatIcon.css';

const ChatIcon = ({ isChatOpen, toggleChat }) => (
    <div className="chat-icon-container" onClick={toggleChat}>
        <FiMessageCircle className="chat-icon" />
    </div>
);

export default ChatIcon;
