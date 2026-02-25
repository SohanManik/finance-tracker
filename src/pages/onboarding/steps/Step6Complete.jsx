import { useTheme } from '../../../lib/ThemeContext'

export default function Step6Complete({ data }) {
  const { theme } = useTheme()
  const cardCount = data.credit_cards?.length || 0
  const subCount = data.subscriptions?.length || 0

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          You're all set, {data.full_name?.split(' ')[0] || 'there'}!
        </h2>
        <p className="text-sm" style={{ color: theme.textMuted }}>
          Here's a summary of what we set up for you.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: theme.bg, border: `1px solid ${theme.borderFaint}` }}
        >
          <span className="text-2xl">📊</span>
          <div>
            <p className="text-xs" style={{ color: theme.textMuted }}>Primary goal</p>
            <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>
              {data.goal || 'Not set'}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: theme.bg, border: `1px solid ${theme.borderFaint}` }}
        >
          <span className="text-2xl">💼</span>
          <div>
            <p className="text-xs" style={{ color: theme.textMuted }}>Employment</p>
            <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>
              {data.employer_name || 'Not set'} — {data.pay_frequency || 'Not set'}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: theme.bg, border: `1px solid ${theme.borderFaint}` }}
        >
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-xs" style={{ color: theme.textMuted }}>Credit cards</p>
            <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>
              {cardCount > 0 ? `${cardCount} card${cardCount > 1 ? 's' : ''} added` : 'None added'}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: theme.bg, border: `1px solid ${theme.borderFaint}` }}
        >
          <span className="text-2xl">🔄</span>
          <div>
            <p className="text-xs" style={{ color: theme.textMuted }}>Subscriptions</p>
            <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>
              {subCount > 0 ? `${subCount} subscription${subCount > 1 ? 's' : ''} tracked` : 'None added'}
            </p>
          </div>
        </div>

        {data.goal_name && (
          <div
            className="flex items-center gap-4 px-4 py-3 rounded-xl"
            style={{ backgroundColor: theme.bg, border: `1px solid ${theme.borderFaint}` }}
          >
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-xs" style={{ color: theme.textMuted }}>Savings goal</p>
              <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                {data.goal_name}
                {data.goal_amount
                  ? ` — $${parseFloat(data.goal_amount.replace(/[$,\s]/g, '')).toLocaleString()}`
                  : ''}
              </p>
            </div>
          </div>
        )}

        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: theme.bg, border: `1px solid ${theme.borderFaint}` }}
        >
          <span className="text-2xl">🏷️</span>
          <div>
            <p className="text-xs" style={{ color: theme.textMuted }}>Default categories</p>
            <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>
              17 categories seeded automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}