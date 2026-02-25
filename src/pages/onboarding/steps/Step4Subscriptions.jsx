import { useState } from 'react'

const COMMON_SUBSCRIPTIONS = [
  { name: 'Netflix', icon: '🎬' },
  { name: 'Spotify', icon: '🎵' },
  { name: 'Hulu', icon: '📺' },
  { name: 'Disney+', icon: '🏰' },
  { name: 'HBO Max', icon: '🎭' },
  { name: 'Apple Music', icon: '🍎' },
  { name: 'YouTube Premium', icon: '▶️' },
  { name: 'Amazon Prime', icon: '📦' },
  { name: 'iCloud', icon: '☁️' },
  { name: 'Adobe Creative Cloud', icon: '🎨' },
  { name: 'Microsoft 365', icon: '💼' },
  { name: 'Gym Membership', icon: '💪' },
  { name: 'Internet', icon: '🌐' },
  { name: 'Phone Bill', icon: '📱' },
  { name: 'Rent', icon: '🏠' },
  { name: 'Electric', icon: '⚡' },
  { name: 'Gas Bill', icon: '🔥' },
  { name: 'Water', icon: '💧' },
]

export default function Step4Subscriptions({ data, onUpdate }) {
  const [customName, setCustomName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const subscriptions = data.subscriptions || []

  function toggleCommon(sub) {
    const exists = subscriptions.find(s => s.name === sub.name)
    if (exists) {
      onUpdate({ subscriptions: subscriptions.filter(s => s.name !== sub.name) })
    } else {
      onUpdate({
        subscriptions: [...subscriptions, {
          id: Date.now(),
          name: sub.name,
          icon: sub.icon,
          amount: '',
          due_day: '',
        }]
      })
    }
  }

  function addCustom() {
    if (!customName.trim()) return
    onUpdate({
      subscriptions: [...subscriptions, {
        id: Date.now(),
        name: customName.trim(),
        icon: '📌',
        amount: '',
        due_day: '',
      }]
    })
    setCustomName('')
  }

  function updateSub(id, field, value) {
    onUpdate({
      subscriptions: subscriptions.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    })
  }

  function removeSub(id) {
    onUpdate({ subscriptions: subscriptions.filter(s => s.id !== id) })
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#FEFFFF' }}>
          Recurring bills & subscriptions
        </h2>
        <p className="text-sm" style={{ color: '#3AAFA9' }}>
          Tap to select, then fill in the amount and due date.
        </p>
      </div>

      {/* Common subscriptions grid */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {COMMON_SUBSCRIPTIONS.map(sub => {
          const selected = subscriptions.find(s => s.name === sub.name)
          return (
            <button
              key={sub.name}
              type="button"
              onClick={() => toggleCommon(sub)}
              className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: selected ? '#2B7A78' : '#17252A',
                border: `1px solid ${selected ? '#3AAFA9' : '#2B7A78'}`,
                color: selected ? '#FEFFFF' : '#DEF2F1',
              }}
            >
              <span className="text-xl">{sub.icon}</span>
              <span className="text-center leading-tight">{sub.name}</span>
            </button>
          )
        })}
      </div>

      {/* Custom subscription input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={customName}
          onChange={e => setCustomName(e.target.value)}
          placeholder="Add custom subscription..."
          className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={{ backgroundColor: '#17252A', border: '1px solid #2B7A78', color: '#DEF2F1' }}
          onKeyDown={e => e.key === 'Enter' && addCustom()}
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#2B7A78', color: '#FEFFFF' }}
        >
          Add
        </button>
      </div>

      {/* Selected subscriptions — fill in details */}
      {subscriptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium" style={{ color: '#3AAFA9' }}>
            Fill in details for your selected subscriptions:
          </p>
          {subscriptions.map(sub => (
            <div
              key={sub.id}
              className="rounded-lg p-3"
              style={{ backgroundColor: '#17252A', border: '1px solid #2B7A7860' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span>{sub.icon}</span>
                  <span className="text-sm font-medium" style={{ color: '#FEFFFF' }}>{sub.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSub(sub.id)}
                  className="text-xs px-2 py-1 rounded"
                  style={{ color: '#EF4444', backgroundColor: '#7F1D1D30' }}
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: '#3AAFA9' }}>Amount ($)</label>
                  <input
                    type="number"
                    value={sub.amount}
                    onChange={e => updateSub(sub.id, 'amount', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="rounded px-2 py-1.5 text-sm focus:outline-none"
                    style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: '#3AAFA9' }}>Day of month</label>
                  <input
                    type="number"
                    value={sub.due_day}
                    onChange={e => updateSub(sub.id, 'due_day', e.target.value)}
                    placeholder="e.g. 15"
                    min="1"
                    max="31"
                    className="rounded px-2 py-1.5 text-sm focus:outline-none"
                    style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}