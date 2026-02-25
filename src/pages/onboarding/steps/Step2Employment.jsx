import { useTheme } from '../../../lib/ThemeContext'

const PAY_FREQUENCIES = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Biweekly', value: 'biweekly' },
  { label: 'Semi-monthly', value: 'semi_monthly' },
  { label: 'Monthly', value: 'monthly' },
]

export default function Step2Employment({ data, onUpdate }) {
  const { theme } = useTheme()

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">💼</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          How do you get paid?
        </h2>
        <p className="text-sm" style={{ color: theme.textMuted }}>
          This helps us track your income accurately.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: theme.textSecondary }}>Employment type</label>
          <div className="flex gap-2">
            {['hourly', 'salaried'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => onUpdate({ employment_type: type })}
                className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
                style={{
                  backgroundColor: data.employment_type === type ? theme.accent : theme.bg,
                  border: `1px solid ${data.employment_type === type ? theme.accentHover : theme.border}`,
                  color: data.employment_type === type ? theme.bgSecondary : theme.textSecondary,
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: theme.textSecondary }}>Employer name</label>
          <input
            type="text"
            value={data.employer_name || ''}
            onChange={e => onUpdate({ employer_name: e.target.value })}
            placeholder="e.g. General Dynamics"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: theme.textSecondary }}>
            {data.employment_type === 'hourly' ? 'Hourly rate' : 'Annual salary'}
          </label>
          <input
            type="text"
            value={data.pay_rate || ''}
            onChange={e => onUpdate({ pay_rate: e.target.value })}
            placeholder={data.employment_type === 'hourly' ? 'e.g. $29.00' : 'e.g. $75,000'}
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: theme.textSecondary }}>How often are you paid?</label>
          <div className="grid grid-cols-2 gap-2">
            {PAY_FREQUENCIES.map(freq => (
              <button
                key={freq.value}
                type="button"
                onClick={() => onUpdate({ pay_frequency: freq.value })}
                className="py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: data.pay_frequency === freq.value ? theme.accent : theme.bg,
                  border: `1px solid ${data.pay_frequency === freq.value ? theme.accentHover : theme.border}`,
                  color: data.pay_frequency === freq.value ? theme.bgSecondary : theme.textSecondary,
                }}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm" style={{ color: theme.textSecondary }}>
            Approximate take-home per paycheck
          </label>
          <input
            type="text"
            value={data.take_home || ''}
            onChange={e => onUpdate({ take_home: e.target.value })}
            placeholder="e.g. $2,000.00"
            className="rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
          />
        </div>
      </div>
    </div>
  )
}