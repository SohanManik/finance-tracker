export default function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium" style={{ color: '#3AAFA9' }}>
          Step {current} of {total}
        </span>
        <span className="text-xs" style={{ color: '#2B7A78' }}>
          {Math.round(percentage)}% complete
        </span>
      </div>
      <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#17252A' }}>
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: '#3AAFA9' }}
        />
      </div>
    </div>
  )
}