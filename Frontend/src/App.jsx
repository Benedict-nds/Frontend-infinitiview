import { useState, useRef, useEffect } from 'react'
import './App.css'

// API configuration
const API_BASE_URL = 'http://localhost:5000'  // Change this to http://172.20.10.4:5000 if localhost doesn't work

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(API_BASE_URL)
        const data = await response.json()
        if (data.status === "Server is running") {
          setConnectionError(false)
        }
      } catch (error) {
        console.error('Backend connection error:', error)
        setConnectionError(true)
      }
    }
    testConnection()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Add AI response
      setMessages(prev => [...prev, { text: data.reply, sender: 'ai' }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'ai',
        error: true 
      }])
      setConnectionError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>EstateAI Assistant</h1>
        <p>Ask me anything about real estate</p>
        {connectionError && (
          <p className="error-message">
            ⚠️ Cannot connect to the backend server. Please make sure it's running.
          </p>
        )}
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender} ${message.error ? 'error' : ''}`}
            >
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="message-content loading">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about real estate..."
            disabled={isLoading || connectionError}
          />
          <button type="submit" disabled={isLoading || !input.trim() || connectionError}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
