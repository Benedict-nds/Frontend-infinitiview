import { useState, useCallback } from 'react';
import { RealEstateAPI } from '../api/realEstateApi';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageIdCounter, setMessageIdCounter] = useState(1);

  const sendMessage = useCallback(async (question) => {
    if (!question.trim()) return;

    const userMessage = {
      id: messageIdCounter,
      type: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageIdCounter(prev => prev + 1);
    setIsLoading(true);
    setError(null);

    try {
      const response = await RealEstateAPI.askQuestion(question);
      console.log('useChat response:', response); // Debug log
      
      const aiMessage = {
        id: messageIdCounter + 1,
        type: 'ai',
        content: response.response || 'No response received',
        timestamp: new Date().toISOString(),
        aiEngine: response.ai_engine,
      };
      
      setMessageIdCounter(prev => prev + 2);

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: messageIdCounter + 1,
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      
      setMessageIdCounter(prev => prev + 1);

      setMessages(prev => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const addSystemMessage = useCallback((content) => {
    const systemMessage = {
      id: messageIdCounter,
      type: 'system',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, systemMessage]);
    setMessageIdCounter(prev => prev + 1);
  }, [messageIdCounter]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    addSystemMessage,
  };
};
