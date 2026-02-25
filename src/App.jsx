import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import { useTheme } from './lib/ThemeContext'
import Sidebar from './components/Sidebar'
import Transactions from './pages/Transactions'
import Onboarding from './pages/onboarding/index'
import Login from './pages/Login'

function AppContent() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.bg }}
      >
        <p style={{ color: theme.accentHover }}>Loading...</p>
      </div>
    )
  }

  if (!user) return <Login />

  if (!user.user_metadata?.onboarding_complete) {
    return <Onboarding />
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.bg }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={
            <div className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Dashboard
            </div>
          } />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/income" element={
            <div className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Income
            </div>
          } />
          <Route path="/budget" element={
            <div className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Budget
            </div>
          } />
          <Route path="/credit-cards" element={
            <div className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Credit Cards
            </div>
          } />
          <Route path="/betting" element={
            <div className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Sports Betting
            </div>
          } />
          <Route path="/debt" element={
            <div className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Debt
            </div>
          } />
          <Route path="/net-worth" element={
            <div className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Net Worth
            </div>
          } />
          <Route path="/goals" element={
            <div className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Goals
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}