import React from 'react';
import { formatTimestamp, extractLinks } from '../utils/formatters';
import { MessageCircle, User, AlertCircle, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const { type, content, timestamp, aiEngine } = message;

  const renderContent = (text) => {
    if (!text) return null;

    // Extract and format links
    const links = extractLinks(text);
    let formattedText = text;

    // Debug logging
    console.log('Original text:', text);
    console.log('Extracted links:', links);

    // Replace links with clickable elements - use a single pass approach
    links.forEach((link, index) => {
      const linkText = link.includes('virtual tour') ? 'View Virtual Tour' : 'View Link';
      
      console.log(`Replacing link ${index}:`, link);
      
      // Simple replacement - just replace the exact URL
      formattedText = formattedText.replace(
        link,
        `<a href="${link}" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline font-medium">${linkText}</a>`
      );
      
      console.log(`After replacement ${index}:`, formattedText);
    });

    // Split by line breaks and render
    const lines = formattedText.split('\n');
    
    return lines.map((line, index) => (
      <div key={index} className="mb-2">
        <span 
          dangerouslySetInnerHTML={{ __html: line }}
          className="text-gray-800 leading-relaxed"
        />
      </div>
    ));
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
