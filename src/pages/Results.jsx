import { useLocation, Link, useNavigate } from 'react-router-dom'

const THEME_LABELS = {
  meteorologie: 'Météorologie et Aérologie',
  aerodynamique: 'Aérodynamique et Principes du Vol',
  aeronefs: 'Étude des Aéronefs',
  navigation: 'Navigation et Réglementation',
  histoire: 'Histoire de l\'Aéronautique',
}

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state || !state.answers) {
    navigate('/')
    return null
  }

  const { answers, theme } = state
  const total = answers.length
  const score = answers.filter(a => a.chosen === a.correct).length
  const pct = Math.round((score / total) * 100)

  const circleClass = pct >= 70 ? 'good' : pct >= 50 ? 'medium' : 'low'

  const getMessage = () => {
    if (pct >= 80) return 'Excellent travail ! 🎉'
    if (pct >= 70) return 'Bien joué ! Continue ainsi.'
    if (pct >= 50) return 'Pas mal, encore un peu d\'entraînement.'
    return 'Continue de t\'entraîner, tu vas y arriver !'
  }

  return (
    <div>
      <header className="app-header">
        <span style={{ fontSize: '1.5rem' }}>✈️</span>
        <h1>Résultats</h1>
      </header>

      <div className="container">
        <div className="results-card">
          <div className={`score-circle ${circleClass}`}>
            <span className="score-num">{score}</span>
            <span className="score-total">/ {total}</span>
          </div>
          <div className="results-title">{pct}%</div>
          <div className="results-subtitle">{getMessage()}</div>
          <div className="results-subtitle" style={{ marginBottom: 0 }}>
            {THEME_LABELS[theme] || theme}
          </div>

          <div className="results-actions" style={{ marginTop: 24 }}>
            <button
              className="btn-primary"
              onClick={() => navigate(`/quiz/${theme}`)}
            >
              Recommencer ce thème
            </button>
            <Link to="/" className="btn-outline">
              Choisir un thème
            </Link>
          </div>
        </div>

        <div className="review-section">
          <h3>Correction détaillée</h3>
          {answers.map((a, i) => {
            const isCorrect = a.chosen === a.correct
            return (
              <div
                key={i}
                className={`review-item ${isCorrect ? 'correct-item' : 'wrong-item'}`}
              >
                <div className="review-q">
                  <strong>Q{i + 1}.</strong> {a.question.question}
                </div>
                <div className="review-answers">
                  <div className={`review-answer user-answer ${isCorrect ? 'correct-answer' : 'wrong-answer'}`}>
                    <span>{isCorrect ? '✅' : '❌'}</span>
                    <span>
                      <strong>Votre réponse {a.chosen} :</strong>{' '}
                      {a.question.options[a.chosen]}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="review-answer show-correct">
                      <span>✅</span>
                      <span>
                        <strong>Bonne réponse {a.correct} :</strong>{' '}
                        {a.question.options[a.correct]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
