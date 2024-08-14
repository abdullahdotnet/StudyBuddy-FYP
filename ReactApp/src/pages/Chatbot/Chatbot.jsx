import React, { useState, useRef, useEffect } from 'react';
// import { FaPaperPlane } from 'react-icons/fa';

const dummyResponses = {
  "hello": "Hi there! How can I help you today?",
  "how are you": "I'm just a bot, but I'm doing great! How about you?",
  "i am good": "That's great to hear! How can I assist you today?",
  "i am working on chatbot creation": "That's awesome! I'm a chatbot too! 😄",
  "bye": "Goodbye! Have a great day!"
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);

    const response = dummyResponses[input.toLowerCase()] || "Sorry, I don't understand that.";
    setMessages([...newMessages, { type: 'bot', text: response }]);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white w-2/3 p-4 rounded-lg shadow-lg">
        <div className="h-96 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded-l-lg focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r-lg"
            onClick={handleSend}
          >
            send
            {/* <FaPaperPlane /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;