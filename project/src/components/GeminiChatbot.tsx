import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, ChatBubbleLeftIcon, UserCircleIcon, XMarkIcon, PhoneIcon, LinkIcon, SparklesIcon, WifiIcon } from '@heroicons/react/24/outline';
import { geminiChatService, GeminiMessage } from '../services/geminiChatService';

interface ServiceLink {
  title: string;
  url: string;
  description: string;
  number?: string;
}

export const GeminiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<GeminiMessage[]>([{
    text: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
    type: 'bot',
    suggestions: ['Emergency resources', 'Safety information', 'Legal advice']
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { text, type: 'user' }]);

    try {
      let response;
      if (isOnline) {
        response = await geminiChatService.getResponse(text);
      } else {
        response = await geminiChatService.getOfflineResponse(text);
      }
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "I'm having trouble processing your request. Please try again.",
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleLinkClick = (link: ServiceLink) => {
    if (link.number) {
      window.location.href = `tel:${link.number}`;
    } else {
      window.open(link.url, '_blank');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        id="gemini-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg z-50 transition-colors"
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <SparklesIcon className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 w-96 h-[600px] glass-effect rounded-xl overflow-hidden shadow-xl z-50"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-purple-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold">AI Assistant</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <XMarkIcon className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>
              <div className="flex items-center mt-1">
                <WifiIcon className={`w-4 h-4 mr-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
                <p className="text-sm text-white/70">
                  {isOnline ? 'Internet Connected' : 'No Internet Connection'}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="overflow-y-auto p-4 space-y-4 h-[calc(600px-140px)]">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-purple-500/20' : 'bg-purple-700/20'
                    }`}>
                      {message.type === 'user' ? (
                        <UserCircleIcon className="w-5 h-5 text-purple-400" />
                      ) : (
                        <SparklesIcon className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : message.type === 'error'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-white/5 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      
                      {/* Service Links */}
                      {message.links && message.links.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-semibold text-purple-300">Helpful Resources:</p>
                          {message.links.map((link, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              onClick={() => handleLinkClick(link)}
                              className="p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-start gap-2">
                                {link.number ? (
                                  <PhoneIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                ) : (
                                  <LinkIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                )}
                                <div>
                                  <h4 className="text-sm font-medium text-purple-300">{link.title}</h4>
                                  <p className="text-xs text-white/70">{link.description}</p>
                                  {link.number && (
                                    <p className="text-sm font-medium text-purple-300 mt-1">
                                      Call: {link.number}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-sm bg-purple-900/30 hover:bg-purple-900/50 rounded-full px-3 py-1 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-lg p-4 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
              {!isOnline && (
                <p className="text-xs text-red-400 mt-2">
                  You're currently offline. Limited responses available.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 