import { useState } from 'react'
import { useTheme } from '../../../lib/ThemeContext'

const CARD_ISSUERS = [
  'Chase', 'American Express', 'Citi', 'Capital One',
  'Discover', 'Bank of America', 'Wells Fargo', 'Barclays',
  'US Bank', 'Other'
]

export default function Step3CreditCards({ data, onUpdate }) {
  const { theme } = useTheme()
  const [nickname, setNickname] = useState('')
  const [issuer, setIssuer] = useState('')

  function addCard() {
    if (!nickname.trim() || !issuer) return
    const newCard = { id: Date.now(), nickname: nickname.trim(), issuer }
    onUpdate({ credit_cards: [...(data.credit_cards || []), newCard] })
    setNickname('')
    setIssuer('')
  }

  function removeCard(id) {
    onUpdate({ credit_cards: data.credit_cards.filter(c => c.id !== id) })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">💳</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          Any credit cards to track?
        </h2>
        <p className="text-sm" style={{ color: theme.textMuted }}>
          Add the cards you use regularly. No card numbers — just names.
        </p>
      </div>

      <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: theme.textSecondary }}>Card nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="e.g. Chase Sapphire, Amex Gold"
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
              onKeyDown={e => e.key === 'Enter' && addCard()}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: theme.textSecondary }}>Issuer</label>
            <select
              value={issuer}
              onChange={e => setIssuer(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
            >
              <option value="">Select issuer</option>
              {CARD_ISSUERS.map(i => (
                <option key={i} value={i} style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={addCard}
            disabled={!nickname.trim() || !issuer}
            className="py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
            style={{ backgroundColor: theme.accent, color: theme.bgSecondary }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.accentHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.accent}
          >
            + Add Card
          </button>
        </div>
      </div>

      {data.credit_cards?.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.credit_cards.map(card => (
            <div
              key={card.id}
              className="flex items-center justify-between px-4 py-3 rounded-lg"
              style={{ backgroundColor: theme.bg, border: `1px solid ${theme.borderFaint}` }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: theme.textPrimary }}>{card.nickname}</p>
                <p className="text-xs" style={{ color: theme.textMuted }}>{card.issuer}</p>
              </div>
              <button
                type="button"
                onClick={() => removeCard(card.id)}
                className="text-xs px-2 py-1 rounded"
                style={{ color: theme.expense, backgroundColor: theme.expenseBg }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {(!data.credit_cards || data.credit_cards.length === 0) && (
        <p className="text-center text-xs mt-4" style={{ color: theme.textMuted }}>
          No cards added yet. You can skip this and add them later.
        </p>
      )}
    </div>
  )
}