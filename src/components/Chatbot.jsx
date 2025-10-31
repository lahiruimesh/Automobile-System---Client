import React, { useState, useRef, useEffect } from 'react';
import { BsChatDots } from 'react-icons/bs';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotReady, setIsChatbotReady] = useState(false);
  const messagesEndRef = useRef(null);

  // API Base URL - Update this to match your backend URL
  const API_BASE_URL = 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check chatbot status when opened
  useEffect(() => {
    if (isOpen && !isChatbotReady) {
      checkChatbotStatus();
    }
  }, [isOpen, isChatbotReady]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Check if chatbot backend is ready
  const checkChatbotStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/status`);
      const data = await response.json();
      
      if (data.success && data.configured) {
        setIsChatbotReady(true);
      } else {
        setIsChatbotReady(false);
        const errorMsg = { 
          sender: 'system', 
          text: 'Chatbot is not configured. Please contact support.' 
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error('Error checking chatbot status:', error);
      setIsChatbotReady(false);
      const errorMsg = { 
        sender: 'system', 
        text: 'Unable to connect to chatbot service.' 
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  // Clear conversation
  const clearConversation = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token;

      if (token) {
        await fetch(`${API_BASE_URL}/chatbot/clear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).catch(err => {
          console.log('Backend clear endpoint not available:', err);
        });
      }

      // Clear messages and history regardless of backend response
      setMessages([{ sender: 'bot', text: 'Hello! How can I assist you today?' }]);
      setConversationHistory([]);
    } catch (error) {
      console.error('Error clearing conversation:', error);
      // Still clear the UI even if backend fails
      setMessages([{ sender: 'bot', text: 'Hello! How can I assist you today?' }]);
      setConversationHistory([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '' || isLoading) return;

    // Add user message to chat
    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Get JWT token from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token;

      if (!token) {
        throw new Error('Please login to use the chatbot');
      }

      const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          message: currentInput,
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Add bot response to chat
        const botMessage = { sender: 'bot', text: data.message };
        setMessages(prev => [...prev, botMessage]);
        
        // Update conversation history for context
        if (data.conversationHistory) {
          setConversationHistory(data.conversationHistory);
        }
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorText = 'Error: ';
      
      if (error.message.includes('Failed to fetch')) {
        errorText += 'Cannot connect to the server.';
      } else if (error.message.includes('404')) {
        errorText += 'Chatbot endpoint not found. Please implement /chatbot/chat endpoint in your backend.';
      } else if (error.message.includes('401')) {
        errorText += 'Authentication failed. Please login again.';
      } else {
        errorText += error.message;
      }
      
      // Add error message to chat
      const errorMessage = { 
        sender: 'system', 
        text: errorText
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Icon */}
      <div 
        onClick={toggleChat}
        className="fixed bottom-[30px] right-[30px] w-[60px] h-[60px] bg-green-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-green-600 hover:shadow-xl hover:scale-105 transition-all duration-300 z-[1000]"
      >
        <BsChatDots className="text-white text-3xl" />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[100px] right-[30px] w-[350px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-[999] overflow-hidden animate-slideUp">
          {/* Chat Header */}
          <div className="bg-green-500 text-white px-5 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold m-0">AI Chat Support</h3>
            <div className="flex gap-2 items-center">
              <button 
                type="button"
                onClick={clearConversation}
                className="bg-transparent border-none text-white text-sm cursor-pointer px-3 py-1.5 rounded hover:bg-white/20 transition-colors"
                title="Clear chat"
              >
                🗑️ Clear
              </button>
              <button 
                type="button"
                onClick={toggleChat}
                className="bg-transparent border-none text-white text-3xl cursor-pointer p-0 w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Status Warning */}
          {!isChatbotReady && (
            <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-2 text-center">
              ⚠️ Chatbot service unavailable
            </div>
          )}
          
          {/* Messages Container */}
          <div className="flex-1 p-5 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                  message.sender === 'user' 
                    ? 'self-end bg-green-500 text-white rounded-br-sm' 
                    : message.sender === 'system'
                    ? 'self-center bg-red-100 text-red-800 rounded text-center max-w-[90%]'
                    : 'self-start bg-gray-200 text-gray-800 rounded-bl-sm'
                }`}
              >
                {message.text}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="self-start bg-gray-200 px-4 py-3 rounded-xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Form */}
          <form 
            onSubmit={handleSendMessage}
            className="flex p-4 bg-white border-t border-gray-200"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isLoading ? "AI is typing..." : "Type your message..."}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-full outline-none text-sm focus:border-green-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="ml-2.5 px-5 py-2.5 bg-green-500 text-white border-none rounded-full cursor-pointer font-semibold text-sm hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
