import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Income', path: '/income' },
  { label: 'Budget', path: '/budget' },
  { label: 'Credit Cards', path: '/credit-cards' },
  { label: 'Sports Betting', path: '/betting' },
  { label: 'Debt', path: '/debt' },
  { label: 'Net Worth', path: '/net-worth' },
  { label: 'Goals', path: '/goals' },
]

function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="w-64 flex flex-col border-r" style={{ backgroundColor: '#17252A', borderColor: '#2B7A78' }}>
      <div className="p-6 border-b" style={{ borderColor: '#2B7A78' }}>
        <h1 className="text-xl font-bold" style={{ color: '#FEFFFF' }}>Finance Tracker</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#2B7A78' : 'transparent',
              color: isActive ? '#FEFFFF' : '#3AAFA9',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.backgroundColor = '#2B7A7840'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout at the bottom */}
      <div className="p-4 border-t" style={{ borderColor: '#2B7A78' }}>
        <p className="text-xs mb-3 truncate" style={{ color: '#3AAFA9' }}>{user?.email}</p>
        <button
          onClick={signOut}
          className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#0D1F22', border: '1px solid #2B7A78', color: '#3AAFA9' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#7F1D1D'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0D1F22'}
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar