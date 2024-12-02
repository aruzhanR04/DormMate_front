import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/TestPage.css';
import api from '../api';

const TestPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thankYouMessage, setThankYouMessage] = useState(false); 
  const navigate = useNavigate(); 

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await api.get('questionlist');
      const formattedQuestions = response.data.map((q) => ({
        id: q.id,
        question: q.question_text,
        options: [
          { label: q.answer_variant_a, letter: 'A' },
          { label: q.answer_variant_b, letter: 'B' },
          { label: q.answer_variant_c, letter: 'C' },
        ].filter(option => option.label), 
        selectedAnswer: null,
      }));
      setQuestions(formattedQuestions);
    } catch (err) {
      setError('Ошибка загрузки вопросов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    const testAnswers = questions.map(q => q.selectedAnswer?.letter || "");
    console.log("Test answers:", testAnswers); 

    if (testAnswers.includes("")) {
      alert("Пожалуйста, ответьте на все вопросы.");
      return;
    }

    try {
      const response = await api.post('/test/', { test_answers: testAnswers });
      console.log("Результат отправлен:", response.data);

      setThankYouMessage(true);

      setTimeout(() => {
        navigate('/application-status');
      }, 3000);
    } catch (error) {
      setError('Ошибка при отправке теста');
      if (error.response) {
        console.error("Ошибка:", error.response.status, error.response.data);
      } else {
        console.error("Ошибка сети или другая проблема:", error.message);
      }
    }
  };

  if (loading) return <div>Загрузка вопросов...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;
  if (thankYouMessage) return <div>Спасибо! Вы будете перенаправлены на страницу статуса заявки...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const questionText = currentQuestion ? currentQuestion.question : "Вопрос не найден";
  const options = currentQuestion?.options || [];

  return (
    <div className="test-page">
      <div className="progress-indicator">
        Вопрос {currentQuestionIndex + 1} из {questions.length}
      </div>
      <h2>Психологическая совместимость</h2>
      <p>{questionText}</p>
      <div className="options">
        {options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={`answer-${currentQuestionIndex}`}
              onChange={() => {
                const updatedQuestions = [...questions];
                updatedQuestions[currentQuestionIndex].selectedAnswer = option;
                setQuestions(updatedQuestions);
              }}
              checked={currentQuestion.selectedAnswer?.letter === option.letter}
            />
            {`${option.letter}. ${option.label}`}
          </label>
        ))}
      </div>
      <div className="navigation-buttons">
        <button
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className="back-btn"

        >
          Назад
        </button>
        <button onClick={handleNext} className="next-btn">
          {currentQuestionIndex === questions.length - 1 ? "Отправить тест" : "Далее"}
        </button>
      </div>
    </div>
  ); 
};

export default TestPage;
