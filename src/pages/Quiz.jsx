import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import questions from '../data/questions.json'

const THEME_LABELS = {
  meteorologie: 'Météorologie et Aérologie',
  aerodynamique: 'Aérodynamique et Principes du Vol',
  aeronefs: 'Étude des Aéronefs',
  navigation: 'Navigation et Réglementation',
  histoire: 'Histoire de l\'Aéronautique',
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const { theme } = useParams()
  const navigate = useNavigate()

  const [quizQuestions, setQuizQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [answers, setAnswers] = useState([]) // {question, chosen, correct}

  useEffect(() => {
    const pool = questions.filter(q => q.theme === theme && q.correct)
    const picked = shuffle(pool).slice(0, 20)
    setQuizQuestions(picked)
    setCurrent(0)
    setSelected(null)
    setConfirmed(false)
    setAnswers([])
  }, [theme])

  if (quizQuestions.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 60 }}>
        <p>Chargement...</p>
      </div>
    )
  }

  const q = quizQuestions[current]
  const options = Object.entries(q.options)
  const progress = ((current + (confirmed ? 1 : 0)) / quizQuestions.length) * 100

  function handleSelect(letter) {
    if (confirmed) return
    setSelected(letter)
  }

  function handleConfirm() {
    if (!selected) return
    setConfirmed(true)
  }

  function handleNext() {
    const newAnswers = [...answers, {
      question: q,
      chosen: selected,
      correct: q.correct,
    }]
    setAnswers(newAnswers)

    if (current + 1 >= quizQuestions.length) {
      navigate('/results', { state: { answers: newAnswers, theme } })
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setConfirmed(false)
    }
  }

  function getOptionClass(letter) {
    if (!confirmed) {
      return selected === letter ? 'option-btn selected' : 'option-btn'
    }
    if (letter === q.correct) return 'option-btn correct'
    if (letter === selected && selected !== q.correct) return 'option-btn wrong'
    return 'option-btn disabled-show'
  }

  const isCorrect = confirmed && selected === q.correct

  return (
    <div>
      <header className="app-header">
        <span style={{ fontSize: '1.5rem' }}>✈️</span>
        <h1>{THEME_LABELS[theme] || theme}</h1>
      </header>

      <div className="container">
        <div className="quiz-progress">
          <span className="step-info">
            {current + 1} / {quizQuestions.length}
          </span>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="question-card">
          <div className="question-meta">
            Question {current + 1} · Session {q.year} · {q.id}
          </div>
          <div className="question-text">{q.question}</div>

          <div className="options-list">
            {options.map(([letter, text]) => (
              <button
                key={letter}
                className={getOptionClass(letter)}
                onClick={() => handleSelect(letter)}
                disabled={confirmed}
              >
                <span className="option-letter">{letter}</span>
                <span>{text}</span>
              </button>
            ))}
          </div>

          {confirmed && (
            <div className={`feedback-bar ${isCorrect ? 'ok' : 'ko'}`}>
              {isCorrect
                ? '✅ Bonne réponse !'
                : `❌ Incorrect – La bonne réponse était : ${q.correct}. ${q.options[q.correct]}`
              }
            </div>
          )}
        </div>

        <div className="quiz-actions">
          {!confirmed ? (
            <button
              className="btn-primary"
              onClick={handleConfirm}
              disabled={!selected}
            >
              Valider
            </button>
          ) : (
            <button className="btn-primary" onClick={handleNext}>
              {current + 1 < quizQuestions.length ? 'Question suivante →' : 'Voir les résultats'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
