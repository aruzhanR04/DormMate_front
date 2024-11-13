import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChatAssistant.css';

const WebAssistant = () => {
    const [messages, setMessages] = useState([{ type: 'assistant', text: 'Здравствуйте! Чем могу помочь?' }]);
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState(null);
    const [isChatEnded, setIsChatEnded] = useState(false);
    const [frequentQuestions, setFrequentQuestions] = useState([]); 
    
    const fetchFrequentQuestions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/web_assistant/questions/');
            // Сохраняем только два вопроса в состоянии
            setFrequentQuestions(response.data.slice(0, 2));
        } catch (err) {
            console.error('Ошибка при загрузке частых вопросов:', err);
        }
    };
    fetchFrequentQuestions();

    useEffect(() => {
        const fetchFrequentQuestions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/web_assistant/frequent_questions/?limit=2');
                setFrequentQuestions(response.data);
            } catch (err) {
                console.error('Ошибка при загрузке частых вопросов:', err);
            }
        };
        fetchFrequentQuestions();
    }, []);
    
    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        setMessages(prevMessages => [...prevMessages, { type: 'user', text: userInput }]);

        let assistantReply = '';

        if (/привет|здравствуйте|добрый день/i.test(userInput)) {
            assistantReply = 'Здравствуйте! Чем могу помочь? Вот несколько часто задаваемых вопросов:';
        } 
        else if (/пока|до свидания/i.test(userInput)) {
            assistantReply = 'До свидания! Рад был помочь.';
            setIsChatEnded(true);
        } 
        else if (/спасибо/i.test(userInput)) {
            assistantReply = 'Пожалуйста! Был ли ответ полезен?';
            setIsChatEnded(true);
        } else {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/web_assistant/questions/?search=${encodeURIComponent(userInput)}`);
                
                if (response.data.length > 0) {
                    assistantReply = response.data[0].answer;
                } else {
                    assistantReply = 'Извините, я не нашел ответа на ваш вопрос. Пожалуйста, обратитесь к нашему менеджеру для получения дополнительной информации.';
                }
            } catch (err) {
                console.error('Ошибка при получении ответа:', err);
                setError("Ошибка при подключении к серверу. Попробуйте позже.");
                assistantReply = "Произошла ошибка, попробуйте снова позже.";
            }
        }

        setMessages(prevMessages => [...prevMessages, { type: 'assistant', text: assistantReply }]);

        if (isChatEnded || assistantReply.includes('Пожалуйста, обратитесь к нашему менеджеру')) {
            setTimeout(() => {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { type: 'assistant', text: 'Хотите продолжить разговор или завершить работу?' }
                ]);
                setIsChatEnded(true);
            }, 1000);
        }

        setUserInput('');
    };

    const handleFrequentQuestionClick = async (question) => {
        setUserInput(question);
        await handleSendMessage();
    };

    const restartChat = () => {
        setMessages([{ type: 'assistant', text: 'Здравствуйте! Чем могу помочь?' }]);
        setIsChatEnded(false);
        setUserInput('');
        setError(null);
    };

    return (
        <div className="chat-container">
            <h2>Веб-помощник</h2>
            <div className="chat-box">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.type}`}>
                        {message.text}
                    </div>
                ))}
                
                {messages.length === 1 && frequentQuestions.length > 0 && (
                    <div className="frequent-questions">
                        <h4>Часто задаваемые вопросы:</h4>
                        {frequentQuestions.map((item, index) => (
                            <button 
                                key={index} 
                                onClick={() => handleFrequentQuestionClick(item.question)}
                                className="frequent-question"
                            >
                                {item.question}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {isChatEnded ? (
                <div className="chat-end-options">
                    <button onClick={restartChat}>Продолжить чат</button>
                    <button onClick={() => setIsChatEnded(true)}>Завершить работу</button>
                </div>
            ) : (
                <div className="input-container">
                    <input 
                        type="text" 
                        placeholder="Введите ваш вопрос..." 
                        value={userInput} 
                        onChange={(e) => setUserInput(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>Отправить</button>
                </div>
            )}
        </div>
    );
};

export default WebAssistant;
