import { useTheme } from '../../lib/ThemeContext'

export default function ProgressBar({ current, total }) {
  const { theme } = useTheme()
  const percentage = (current / total) * 100

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium" style={{ color: theme.accent }}>
          Step {current} of {total}
        </span>
        <span className="text-xs" style={{ color: theme.textMuted }}>
          {Math.round(percentage)}% complete
        </span>
      </div>
      <div className="w-full rounded-full h-1.5" style={{ backgroundColor: theme.borderFaint }}>
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: theme.accent }}
        />
      </div>
    </div>
  )
}