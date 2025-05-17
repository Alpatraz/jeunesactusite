import React, { useState } from 'react';
import './App.css';

function ActusGame() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [age, setAge] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setError('');
    setSelected('');
    setScore(0);
    setCurrent(0);
    setQuestions([]);
    setShowExplanation(false);
    setQuizStarted(true);

    try {
      const response = await fetch('https://jeunes-actu-guillaumese.replit.app/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ age })
      });

      const data = await response.json();
      const parsed = data.questions;

      if (!parsed || !Array.isArray(parsed)) {
        setError("❌ Format inattendu reçu du serveur.");
        return;
      }

      setQuestions(parsed);

    } catch (err) {
      console.error('Erreur lors de la génération du quiz :', err);
      setError("❌ Erreur : impossible de générer le quiz.");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[current];

  const handleAnswer = (choice) => {
    setSelected(choice);
    if (choice === currentQuestion.answer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelected('');
    setShowExplanation(false);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="App">
      <h1>Jeu d'actualité</h1>

      {!quizStarted && (
        <div className="quiz-instructions">
          <p>🎯 Entrez votre âge pour générer un quiz d’actualité des 7 derniers jours, adapté à votre niveau.</p>
          <div className="age-filter-container">
            <label>Ton âge :</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="6"
              max="99"
            />
            <button
              className="refresh-button"
              onClick={generateQuiz}
              disabled={!age}
              style={{ marginTop: '15px' }}
            >
              Lancer le quiz
            </button>
          </div>
        </div>
      )}

      {loading && <div className="loading-spinner">⏳ Génération du quiz...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && quizStarted && questions.length > 0 && currentQuestion && (
        <div className="quiz-container">
          <div className="question-card">
            <h2>Question {current + 1} : {currentQuestion.question}</h2>
            <div className="quiz-options">
              {currentQuestion.choices.map((choice, idx) => {
                const letter = ['A', 'B', 'C'][idx];
                const isCorrect = letter === currentQuestion.answer;
                const isSelected = selected === letter;

                return (
                  <button
                    key={letter}
                    className={`option-button ${
                      showExplanation
                        ? isCorrect
                          ? 'correct'
                          : isSelected
                          ? 'incorrect'
                          : ''
                        : ''
                    }`}
                    onClick={() => handleAnswer(letter)}
                    disabled={showExplanation}
                  >
                    {letter}) {choice}
                  </button>
                );
              })}
            </div>
            {showExplanation && (
              <div className="explanation-box">
                <strong>Explication :</strong> {currentQuestion.explanation}
                <br />
                <button className="refresh-button" onClick={nextQuestion}>
                  {current === questions.length - 1
                    ? "Voir le score final"
                    : "Question suivante"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && quizStarted && current === questions.length && (
        <div className="result-box">
          <h2>🎉 Quiz terminé !</h2>
          <p className="score-display">
            Score : {score} / {questions.length} {score === questions.length ? "🏆" : score > 0 ? "👍" : "🤔"}
          </p>
          <button className="refresh-button" onClick={() => {
            setQuizStarted(false);
            setAge('');
          }}>
            Recommencer un nouveau quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default ActusGame;
