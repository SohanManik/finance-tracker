import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('users').select('count')
      if (error) {
        console.error('Supabase error:', error.message)
      } else {
        console.log('Connected to Supabase!')
        setConnected(true)
      }
    }
    testConnection()
  }, [])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl">
        {connected ? 'Supabase connected!' : 'Connecting...'}
      </h1>
    </div>
  )
}

export default App