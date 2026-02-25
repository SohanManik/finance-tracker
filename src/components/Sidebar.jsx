import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'
import { themes } from '../lib/themes'

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

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const { theme, themeName, changeTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <aside
      className="w-64 flex flex-col border-r"
      style={{ backgroundColor: theme.bg, borderColor: theme.accent }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: theme.accent }}>
        <h1 className="text-xl font-bold" style={{ color: theme.textPrimary }}>
          Finance Tracker
        </h1>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={({ isActive }) => ({
              backgroundColor: isActive ? theme.accent : 'transparent',
              color: isActive ? theme.textPrimary : theme.accentHover,
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.backgroundColor = theme.borderFaint
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

      {/* Settings panel */}
      {showSettings && (
        <div
          className="mx-4 mb-3 rounded-xl p-4"
          style={{ backgroundColor: theme.bgSecondary, border: `1px solid ${theme.borderFaint}` }}
        >
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: theme.textMuted }}>
            Theme
          </p>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => changeTheme(key)}
                title={t.name}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-8 h-8 rounded-full border-2 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: t.accent,
                    borderColor: themeName === key ? theme.textPrimary : 'transparent',
                    boxShadow: themeName === key ? `0 0 0 1px ${t.accent}` : 'none',
                  }}
                />
                <span
                  className="text-xs leading-tight text-center"
                  style={{ color: themeName === key ? theme.textPrimary : theme.textMuted, fontSize: '9px' }}
                >
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom — settings + user + sign out */}
      <div className="p-4 border-t" style={{ borderColor: theme.accent }}>
  {/* User email */}
  <p className="text-xs mb-3 truncate px-1" style={{ color: theme.accentHover }}>
    {user?.email}
  </p>

  {/* Settings button */}
  <button
  onClick={() => setShowSettings(!showSettings)}
  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-3 transition-colors"
  style={{
    backgroundColor: showSettings ? theme.expenseBg : theme.bgSecondary,
    border: `1px solid ${theme.accent}`,
    color: theme.accentHover,
  }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.borderFaint}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = showSettings ? theme.expenseBg : theme.bgSecondary}
>
  <span>⚙️</span>
  <span>Settings</span>
</button>

  {/* Sign out */}
  <button
    onClick={signOut}
    className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    style={{
      backgroundColor: theme.bgSecondary,
      border: `1px solid ${theme.accent}`,
      color: theme.accentHover,
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.expenseBg}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.bgSecondary}
  >
    Sign Out
  </button>
</div>
    </aside>
  )
}