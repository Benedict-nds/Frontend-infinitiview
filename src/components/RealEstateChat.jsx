import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Home, MapPin, Eye, MessageCircle } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import ChatMessage from './ChatMessage';
import PropertyCard from './PropertyCard';

const RealEstateChat = () => {
  const { messages, isLoading, sendMessage, clearChat, addSystemMessage } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [showProperties, setShowProperties] = useState(false);
  const [properties, setProperties] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message on first load
    if (messages.length === 0) {
      addSystemMessage(
        "👋 Welcome to InfinitiView! I'm your AI real estate assistant. Ask me about properties, locations, virtual tours, or anything real estate related."
      );
    }
  }, [messages.length, addSystemMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleQuickAction = async (action) => {
    let question = '';
    switch (action) {
      case 'properties':
        question = 'What properties do you have?';
        setShowProperties(true);
        break;
      case 'virtual-tours':
        question = 'Do you have any virtual tours available?';
        break;
      case 'locations':
        question = 'What locations do you have properties in?';
        break;
      case 'help':
        question = 'What can you help me with regarding real estate?';
        break;
      default:
        return;
    }

    await sendMessage(question);
  };

  const quickActions = [
    { id: 'properties', label: 'View Properties', icon: Home, color: 'primary' },
    { id: 'virtual-tours', label: 'Virtual Tours', icon: Eye, color: 'green' },
    { id: 'locations', label: 'Locations', icon: MapPin, color: 'blue' },
    { id: 'help', label: 'Get Help', icon: MessageCircle, color: 'purple' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          InfinitiView
        </h1>
        <p className="text-lg text-gray-600">
          Your AI-Powered Real Estate Assistant
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2">
          <div className="card h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Chat with AI</h2>
              <button
                onClick={clearChat}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Clear Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 px-2">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                id="chat-input"
                name="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about properties, locations, virtual tours..."
                className="input-field flex-1"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                      action.color === 'primary'
                        ? 'border-primary-200 bg-primary-50 hover:bg-primary-100 text-primary-800'
                        : action.color === 'green'
                        ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-800'
                        : action.color === 'blue'
                        ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800'
                        : 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{action.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Properties Preview */}
          {showProperties && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties</h3>
              <div className="space-y-4">
                {properties.length > 0 ? (
                  properties.slice(0, 3).map((property, index) => (
                    <PropertyCard key={index} property={property} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    Ask about properties to see them here
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealEstateChat;
