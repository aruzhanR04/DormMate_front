// src/pages/TestPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/TestPage.css";
import api from "../../api";
import { useI18n } from "../../i18n/I18nContext";

const TestPage = () => {
  const { lang, t } = useI18n();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thankYouMessage, setThankYouMessage] = useState(false);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await api.get("http://127.0.0.1:8000/api/v1/questionlist");
      const formatted = response.data.results.map((q) => {
        // pick localized question text and answer variants
        const question = q[`question_text_${lang}`] || q.question_text_ru;
        const options = ["a", "b", "c"]
          .map((letter) => {
            const key = `answer_variant_${letter}_${lang}`;
            const label = q[key] || q[`answer_variant_${letter}_ru`];
            return label ? { letter: letter.toUpperCase(), label } : null;
          })
          .filter(Boolean);
        return {
          id: q.id,
          question,
          options,
          selectedAnswer: null
        };
      });
      setQuestions(formatted);
    } catch (err) {
      setError(t("testPage.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [lang]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    const answers = questions.map((q) => q.selectedAnswer?.letter || "");
    if (answers.includes("")) {
      alert(t("testPage.alertIncomplete"));
      return;
    }
    try {
      await api.post("/test/", { test_answers: answers });
      setThankYouMessage(true);
      setTimeout(() => navigate("/profile"), 3000);
    } catch {
      setError(t("testPage.submitError"));
    }
  };

  if (loading)
    return (
      <div className="loading-indicator">
        {t("testPage.loading")}
        <span className="loading-dots"></span>
      </div>
    );
  if (error)
    return (
      <div style={{ color: "red" }}>
        {t("testPage.errorPrefix", { error })}
      </div>
    );
  if (thankYouMessage)
    return (
      <div className="loading-indicator">
        {t("testPage.thankYou")}
        <span className="loading-dots"></span>
      </div>
    );

  const current = questions[currentQuestionIndex];
  const questionText = current?.question || t("testPage.questionNotFound");

  return (
    <div className="test-page">
      <div className="progress-indicator">
        {t("testPage.progress", {
          current: currentQuestionIndex + 1,
          total: questions.length
        })}
      </div>
      <h2>{t("testPage.title")}</h2>
      <p>{questionText}</p>
      <div className="options">
        {current.options.map((opt, idx) => (
          <label key={idx}>
            <input
              type="radio"
              name={`answer-${currentQuestionIndex}`}
              onChange={() => {
                const copy = [...questions];
                copy[currentQuestionIndex].selectedAnswer = opt;
                setQuestions(copy);
              }}
              checked={current.selectedAnswer?.letter === opt.letter}
            />
            {`${opt.letter}. ${opt.label}`}
          </label>
        ))}
      </div>
      <div className="navigation-buttons">
        <button
          onClick={() => setCurrentQuestionIndex((i) => i - 1)}
          disabled={currentQuestionIndex === 0}
          className="back-btn"
        >
          {t("testPage.back")}
        </button>
        <button onClick={handleNext} className="next-btn">
          {currentQuestionIndex === questions.length - 1
            ? t("testPage.submitTest")
            : t("testPage.next")}
        </button>
      </div>
    </div>
  );
};

export default TestPage;
