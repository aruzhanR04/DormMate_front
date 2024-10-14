// TestPage.js
import React, { useState } from 'react';
import '../styles/TestPage.css';

const TestPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 20;

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="test-page">
      <div className="progress-indicator">
        {currentQuestion} из {totalQuestions}
      </div>
      <h2>Психологическая совместимость</h2>
      <p>Как вы предпочитаете проводить свободное время: в одиночестве или в компании?</p>
      <div className="options">
        <label>
          <input type="radio" name="answer" /> В компании
        </label>
        <label>
          <input type="radio" name="answer" /> В одиночестве
        </label>
        <label>
          <input type="radio" name="answer" /> Зависит от настроения
        </label>
      </div>
      <div className="navigation-buttons">
        <button onClick={handleBack} className="back-btn">Back</button>
        <button onClick={handleNext} className="next-btn">Next</button>
      </div>
    </div>
  );
};

export default TestPage;
