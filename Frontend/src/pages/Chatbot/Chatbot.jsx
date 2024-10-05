import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUpload } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  // Dummy responses
  const generateDummyResponse = () => {
    const responses = [
      "Here's the explanation you're looking for...",
      "I understand your question! Let's dive into it.",
      "Good query! Let me explain in detail...",
      "Okay, here's some information that should help."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    const botMessage = { text: generateDummyResponse(), isUser: false };
    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput(""); // Clear input field
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen pt-16 bg-gray-100"> {/* Ensure no overlap with the navbar */}
      
      {/* Messages Section */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`${msg.isUser ? 'bg-gray-100' : 'bg-white'} p-4 rounded-lg shadow-md max-w-xs`}>
                <p className={`${msg.isUser ? 'text-gray-800' : 'text-gray-800'}`}>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Fixed Input Section */}
      <div className="p-4 bg-white border-t border-gray-300">
        <div className="flex items-center">
          <button className="mr-4">
            <FontAwesomeIcon icon={faUpload} size="lg" className="text-orange-400 hover:text-orange-600" />
          </button>
          <input
            type="text"
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="ml-4" onClick={handleSendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} size="lg" className="text-orange-400 hover:text-orange-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
