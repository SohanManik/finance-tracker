const GOALS = [
  { label: 'Track my spending', icon: '📊' },
  { label: 'Manage my budget', icon: '💰' },
  { label: 'Monitor my net worth', icon: '📈' },
  { label: 'Pay off debt', icon: '💳' },
  { label: 'Save for a goal', icon: '🎯' },
  { label: 'All of the above', icon: '⭐' },
]

export default function Step1Welcome({ data, onUpdate }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">👋</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#FEFFFF' }}>
          Welcome! Let's get you set up.
        </h2>
        <p className="text-sm" style={{ color: '#3AAFA9' }}>
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
              backgroundColor: data.goal === goal.label ? '#2B7A78' : '#17252A',
              border: `1px solid ${data.goal === goal.label ? '#3AAFA9' : '#2B7A78'}`,
              color: data.goal === goal.label ? '#FEFFFF' : '#DEF2F1',
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