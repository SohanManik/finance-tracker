import { useTheme } from '../../../lib/ThemeContext'

export default function Step5Goals({ data, onUpdate }) {
  const { theme } = useTheme()

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          Set your first savings goal
        </h2>
        <p className="text-sm" style={{ color: theme.textMuted }}>
          Give yourself something to work toward. You can always add more later.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: theme.textSecondary }}>Goal name</label>
          <input
            type="text"
            value={data.goal_name || ''}
            onChange={e => onUpdate({ goal_name: e.target.value })}
            placeholder="e.g. Emergency Fund, New Car, Vacation"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: theme.textSecondary }}>Target amount</label>
          <input
            type="text"
            value={data.goal_amount || ''}
            onChange={e => onUpdate({ goal_amount: e.target.value })}
            placeholder="e.g. $100,000"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: theme.textSecondary }}>Target date (optional)</label>
          <input
            type="date"
            value={data.goal_date || ''}
            onChange={e => onUpdate({ goal_date: e.target.value })}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs" style={{ color: theme.textMuted }}>Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {['Emergency Fund', 'New Car', 'Vacation', 'Down Payment', 'New Laptop'].map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onUpdate({ goal_name: suggestion })}
                className="px-3 py-1.5 rounded-full text-xs transition-colors"
                style={{
                  backgroundColor: data.goal_name === suggestion ? theme.accent : theme.bg,
                  border: `1px solid ${theme.border}`,
                  color: data.goal_name === suggestion ? theme.bgSecondary : theme.textMuted,
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}