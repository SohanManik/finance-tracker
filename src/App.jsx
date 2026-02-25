import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Transactions from './pages/Transactions'
import Onboarding from './pages/onboarding/index'
import Login from './pages/Login'
import { useAuth } from './lib/AuthContext'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#17252A' }}>
        <p style={{ color: '#3AAFA9' }}>Loading...</p>
      </div>
    )
  }

  if (!user) return <Login />

  if (!user.user_metadata?.onboarding_complete) {
    return <Onboarding />
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#17252A' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<div className="text-2xl font-bold" style={{ color: '#FEFFFF' }}>Dashboard</div>} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/income" element={<div className="text-2xl font-bold" style={{ color: '#FEFFFF' }}>Income</div>} />
          <Route path="/budget" element={<div className="text-2xl font-bold" style={{ color: '#FEFFFF' }}>Budget</div>} />
          <Route path="/credit-cards" element={<div className="text-2xl font-bold" style={{ color: '#FEFFFF' }}>Credit Cards</div>} />
          <Route path="/betting" element={<div className="text-2xl font-bold" style={{ color: '#FEFFFF' }}>Sports Betting</div>} />
          <Route path="/debt" element={<div className="text-2xl font-bold" style={{ color: '#FEFFFF' }}>Debt</div>} />
          <Route path="/net-worth" element={<div className="text-2xl font-bold" style={{ color: '#FEFFFF' }}>Net Worth</div>} />
          <Route path="/goals" element={<div className="text-2xl font-bold" style={{ color: '#FEFFFF' }}>Goals</div>} />
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