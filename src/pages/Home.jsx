import { Link } from 'react-router-dom'
import questions from '../data/questions.json'

const THEMES = [
  {
    key: 'meteorologie',
    label: 'Météorologie et Aérologie',
    icon: '🌤️',
    desc: 'Atmosphère, fronts, vents, nuages, phénomènes météo',
  },
  {
    key: 'aerodynamique',
    label: 'Aérodynamique et Principes du Vol',
    icon: '✈️',
    desc: 'Portance, traînée, facteur de charge, performances',
  },
  {
    key: 'aeronefs',
    label: 'Étude des Aéronefs',
    icon: '🛩️',
    desc: 'Structure, moteurs, instruments, systèmes de bord',
  },
  {
    key: 'navigation',
    label: 'Navigation et Réglementation',
    icon: '🗺️',
    desc: 'Cartes, radionavigation, espaces aériens, réglementation',
  },
  {
    key: 'histoire',
    label: 'Histoire de l\'Aéronautique',
    icon: '🏆',
    desc: 'Pionniers, dates clés, conquête spatiale',
  },
]

export default function Home() {
  const counts = THEMES.reduce((acc, t) => {
    acc[t.key] = questions.filter(q => q.theme === t.key).length
    return acc
  }, {})

  return (
    <div>
      <header className="app-header">
        <span style={{ fontSize: '1.5rem' }}>✈️</span>
        <h1>Préparation BIA</h1>
        <span className="badge">2024–2025</span>
      </header>

      <div className="container">
        <div className="home-hero">
          <h2>Brevet d'Initiation Aéronautique</h2>
          <p>
            Entraîne-toi avec les vraies questions des sessions 2024 et 2025.
            Chaque thème tire 20 questions au hasard pour simuler l'examen.
          </p>
        </div>

        <div className="themes-grid">
          {THEMES.map(t => (
            <Link key={t.key} to={`/quiz/${t.key}`} className="theme-card">
              <span className="theme-icon">{t.icon}</span>
              <div className="theme-info">
                <h3>{t.label}</h3>
                <p>{t.desc}</p>
                <p style={{ marginTop: 6, fontWeight: 700, color: '#1a3a6b', fontSize: '0.8rem' }}>
                  {counts[t.key]} questions disponibles
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
