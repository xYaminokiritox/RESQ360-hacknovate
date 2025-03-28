import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, ChatBubbleLeftIcon, UserCircleIcon, XMarkIcon, PhoneIcon, LinkIcon } from '@heroicons/react/24/outline';
import { chatbotService } from '../services/chatbotService';

interface ServiceLink {
  title: string;
  url: string;
  description: string;
  number?: string;
}

interface Message {
  text: string;
  type: 'user' | 'bot' | 'error';
  suggestions?: string[];
  links?: ServiceLink[];
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    text: "Hello! I'm your safety assistant. How can I help you today?",
    type: 'bot',
    suggestions: ['Show emergency numbers', 'Tell me about my rights', 'Safety tips']
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const response = await chatbotService.getResponse(text);
      setMessages(prev => [...prev, response as Message]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "I'm having trouble right now. Please try again.",
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
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center shadow-lg z-50 transition-colors"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <ChatBubbleLeftIcon className="w-6 h-6 text-white" />
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
            <div className="p-4 border-b border-white/10 bg-primary/20">
              <h3 className="text-lg font-semibold">Safety Assistant</h3>
              <p className="text-sm text-white/70">Ask me about safety, rights, or emergency numbers</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(600px-140px)]">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      {message.type === 'user' ? (
                        <UserCircleIcon className="w-5 h-5 text-primary" />
                      ) : (
                        <ChatBubbleLeftIcon className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : message.type === 'error'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-white/5 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      
                      {/* Service Links */}
                      {message.links && message.links.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-semibold text-primary">Helpful Resources:</p>
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
                                  <PhoneIcon className="w-5 h-5 text-primary flex-shrink-0" />
                                ) : (
                                  <LinkIcon className="w-5 h-5 text-primary flex-shrink-0" />
                                )}
                                <div>
                                  <h4 className="text-sm font-medium text-primary">{link.title}</h4>
                                  <p className="text-xs text-white/70">{link.description}</p>
                                  {link.number && (
                                    <p className="text-sm font-medium text-primary mt-1">
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
                              className="text-sm bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 transition-colors"
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
                  placeholder="Ask about women's safety, rights, or emergency numbers..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 