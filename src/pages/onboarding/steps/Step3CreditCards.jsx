import { useState } from 'react'

const CARD_ISSUERS = [
  'Chase', 'American Express', 'Citi', 'Capital One',
  'Discover', 'Bank of America', 'Wells Fargo', 'Barclays',
  'US Bank', 'Other'
]

export default function Step3CreditCards({ data, onUpdate }) {
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
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#FEFFFF' }}>
          Any credit cards to track?
        </h2>
        <p className="text-sm" style={{ color: '#3AAFA9' }}>
          Add the cards you use regularly. No card numbers — just names.
        </p>
      </div>

      {/* Add card form */}
      <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#17252A', border: '1px solid #2B7A78' }}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#3AAFA9' }}>Card nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="e.g. Chase Sapphire, Amex Gold"
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
              onKeyDown={e => e.key === 'Enter' && addCard()}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#3AAFA9' }}>Issuer</label>
            <select
              value={issuer}
              onChange={e => setIssuer(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
            >
              <option value="">Select issuer</option>
              {CARD_ISSUERS.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={addCard}
            disabled={!nickname.trim() || !issuer}
            className="py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
            style={{ backgroundColor: '#2B7A78', color: '#FEFFFF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3AAFA9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2B7A78'}
          >
            + Add Card
          </button>
        </div>
      </div>

      {/* Added cards list */}
      {data.credit_cards?.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.credit_cards.map(card => (
            <div
              key={card.id}
              className="flex items-center justify-between px-4 py-3 rounded-lg"
              style={{ backgroundColor: '#17252A', border: '1px solid #2B7A7860' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#FEFFFF' }}>{card.nickname}</p>
                <p className="text-xs" style={{ color: '#3AAFA9' }}>{card.issuer}</p>
              </div>
              <button
                type="button"
                onClick={() => removeCard(card.id)}
                className="text-xs px-2 py-1 rounded"
                style={{ color: '#EF4444', backgroundColor: '#7F1D1D30' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {(!data.credit_cards || data.credit_cards.length === 0) && (
        <p className="text-center text-xs mt-4" style={{ color: '#2B7A78' }}>
          No cards added yet. You can skip this and add them later.
        </p>
      )}
    </div>
  )
}