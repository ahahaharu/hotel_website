import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axiosConfig';
import { v4 as uuidv4 } from 'uuid';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Привет! Я виртуальный помощник отеля. Чем могу помочь?',
      isBot: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sessionIdRef = useRef(uuidv4());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        text: input,
        sessionId: sessionIdRef.current,
      });

      const botMessage = { text: res.data.text, isBot: true };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: 'Ошибка соединения с ИИ...', isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          💬 Помощь
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>🤖 Ассистент</h4>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.isBot ? 'bot' : 'user'}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="message bot">...печатает</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите что-нибудь..."
            />
            <button type="submit">➤</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
