import { NavLink } from 'react-router-dom'

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
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Finance Tracker</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar