import { useTheme } from '../../../lib/ThemeContext'

const GOALS = [
  { label: 'Track my spending', icon: '📊' },
  { label: 'Manage my budget', icon: '💰' },
  { label: 'Monitor my net worth', icon: '📈' },
  { label: 'Pay off debt', icon: '💳' },
  { label: 'Save for a goal', icon: '🎯' },
  { label: 'All of the above', icon: '⭐' },
]

export default function Step1Welcome({ data, onUpdate }) {
  const { theme } = useTheme()

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">👋</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          Welcome! Let's get you set up.
        </h2>
        <p className="text-sm" style={{ color: theme.textMuted }}>
          What's your main reason for using Finance Tracker?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {GOALS.map(goal => (
          <button
            key={goal.label}
            type="button"
            onClick={() => onUpdate({ goal: goal.label })}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
            style={{
              backgroundColor: data.goal === goal.label ? theme.accent : theme.bg,
              border: `1px solid ${data.goal === goal.label ? theme.accentHover : theme.border}`,
              color: data.goal === goal.label ? theme.bgSecondary : theme.textSecondary,
            }}
          >
            <span className="text-xl">{goal.icon}</span>
            <span>{goal.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}