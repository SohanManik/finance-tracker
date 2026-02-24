import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-950 text-white">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<div className="text-2xl font-bold">Dashboard</div>} />
            <Route path="/transactions" element={<div className="text-2xl font-bold">Transactions</div>} />
            <Route path="/income" element={<div className="text-2xl font-bold">Income</div>} />
            <Route path="/budget" element={<div className="text-2xl font-bold">Budget</div>} />
            <Route path="/credit-cards" element={<div className="text-2xl font-bold">Credit Cards</div>} />
            <Route path="/betting" element={<div className="text-2xl font-bold">Sports Betting</div>} />
            <Route path="/debt" element={<div className="text-2xl font-bold">Debt</div>} />
            <Route path="/net-worth" element={<div className="text-2xl font-bold">Net Worth</div>} />
            <Route path="/goals" element={<div className="text-2xl font-bold">Goals</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App