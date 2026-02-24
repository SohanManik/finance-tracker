return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#FEFFFF' }}>Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#2B7A78', color: '#FEFFFF' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3AAFA9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2B7A78'}
        >
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-6 mb-8 border" style={{ backgroundColor: '#17252A', borderColor: '#2B7A78' }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#FEFFFF' }}>New Transaction</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: '#3AAFA9' }}>Date</label>
              <input
                type="date"
                name="transaction_date"
                value={form.transaction_date}
                onChange={handleChange}
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: '#3AAFA9' }}>Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: '#3AAFA9' }}>Merchant</label>
              <input
                type="text"
                name="merchant_name"
                value={form.merchant_name}
                onChange={handleChange}
                placeholder="e.g. Chipotle"
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: '#3AAFA9' }}>Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-sm" style={{ color: '#3AAFA9' }}>Notes (optional)</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any extra details..."
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#DEF2F1' }}
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#2B7A78', color: '#FEFFFF' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3AAFA9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2B7A78'}
              >
                {loading ? 'Saving...' : 'Save Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#2B7A78', backgroundColor: '#17252A' }}>
        {expenses.length === 0 ? (
          <div className="p-12 text-center" style={{ color: '#3AAFA9' }}>
            No transactions yet. Add your first one above.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#2B7A78' }}>
                <th className="text-left text-xs font-medium px-6 py-4" style={{ color: '#3AAFA9' }}>Date</th>
                <th className="text-left text-xs font-medium px-6 py-4" style={{ color: '#3AAFA9' }}>Merchant</th>
                <th className="text-left text-xs font-medium px-6 py-4" style={{ color: '#3AAFA9' }}>Category</th>
                <th className="text-right text-xs font-medium px-6 py-4" style={{ color: '#3AAFA9' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b transition-colors" style={{ borderColor: '#2B7A7840' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2B7A7820'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-6 py-4 text-sm" style={{ color: '#DEF2F1' }}>
                    {new Date(expense.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: '#FEFFFF' }}>
                    {expense.merchant_name}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#3AAFA9' }}>
                    {expense.categories?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium" style={{ color: '#FF6B6B' }}>
                    -${parseFloat(expense.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )