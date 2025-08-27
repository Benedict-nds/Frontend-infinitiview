import React from 'react';
import ReactMarkdown from 'react-markdown';
import { formatTimestamp } from '../utils/formatters';
import { MessageCircle, User, AlertCircle, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const { type, content, timestamp, aiEngine } = message;

  const renderContent = (text) => {
    if (!text) return null;

    return (
      <ReactMarkdown
        className="text-gray-800 leading-relaxed prose prose-sm max-w-none"
        components={{
          // Customize link rendering
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline font-medium"
            >
              {children}
            </a>
          ),
          // Customize list rendering
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-2">
              {children}
            </ul>
          ),
          // Customize bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">
              {children}
            </strong>
          )
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  const getMessageIcon = () => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5 text-primary-600" />;
      case 'ai':
        return <Bot className="w-5 h-5 text-green-600" />;
      case 'system':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMessageStyles = () => {
    switch (type) {
      case 'user':
        return 'bg-primary-50 border-primary-200 ml-12';
      case 'ai':
        return 'bg-white border-gray-200 mr-12';
      case 'system':
        return 'bg-blue-50 border-blue-200 mx-auto max-w-md';
      case 'error':
        return 'bg-red-50 border-red-200 mx-auto max-w-md';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-3xl`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          {getMessageIcon()}
        </div>
        
        <div className={`flex-1 ${getMessageStyles()} border rounded-lg p-4 shadow-sm`}>
          <div className="mb-2">
            {renderContent(content)}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatTimestamp(timestamp)}</span>
            {type === 'ai' && aiEngine && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {aiEngine}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
