import React, { useState } from 'react';
import api from '../api';
import '../styles/styles.css';

const TestSubmission = () => {
    const [testAnswers, setTestAnswers] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Преобразуем ввод из текстовой области в массив строк, разделённых запятыми
        const answersArray = testAnswers.split(',').map(answer => answer.trim());

        api.post('test/', { test_answers: answersArray })
            .then(response => {
                setResult(response.data.result_letter);
                alert('Test submitted: ' + response.data.result_letter);
            })
            .catch(error => {
                setError('Ошибка при отправке теста');
                if (error.response) {
                    console.error("Ошибка:", error.response.status, error.response.data);
                } else {
                    console.error("Ошибка сети или другая проблема:", error.message);
                }
            });
    };

    return (
        <div className="style">
            <h2>Submit Test Answers</h2>
            <form onSubmit={handleSubmit}>
                <textarea 
                    value={testAnswers} 
                    onChange={(e) => setTestAnswers(e.target.value)} 
                    placeholder="Введите ответы через запятую" 
                />
                <button type="submit">Отправить</button>
            </form>
            {result && <p>Результат теста: {result}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default TestSubmission;
