import React, { useState, useRef, useEffect } from 'react';
// import { FaPaperPlane } from 'react-icons/fa';
import { postData } from '../../services/apiService';

// const dummyResponses = {
//   "hello": "Hi there! How can I help you today?",
//   "how are you": "I'm just a bot, but I'm doing great! How about you?",
//   "i am good": "That's great to hear! How can I assist you today?",
//   "i am working on chatbot creation": "That's awesome! I'm a chatbot too! 😄",
//   "bye": "Goodbye! Have a great day!"
// };

const Chatbot = () => {
  const [messages, setMessages] = useState([]);  // handling chat messages
  const [input, setInput] = useState('');   // handling user input
  const [response, setResponse] = useState('');   // handling rerendering errors
  const messagesEndRef = useRef(null);    // for scrolling to the bottom of the chat

  // Extracting the result part from the response
  const formatResponse = (response) => {
    const resultStart = response.indexOf('Result:') + 'Result:'.length;
    const resultEnd = response.indexOf('\n\n', resultStart);
    // Extract and return the result part, trimming any extra whitespace
    return response.substring(resultStart, resultEnd).trim();
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
    // Calling the API to get the response
    const getResponse = async () => {
      const { data, error } = await postData('/api/chatbot/', { query: input });
      if (error) {
        setResponse("Some error has happened so the response is not available");
        return error;
      } else {
        setResponse(data);
        return data.response;
      }
    };


    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);

    // getting the response and formatting it
    const apiResponse = await getResponse();
    const formattedResponse = formatResponse(apiResponse) || dummyResponses[input.toLowerCase()] || "I'm sorry, I don't understand that";

    setMessages([...newMessages, { type: 'bot', text: formattedResponse }]);
    setInput('');
  };

  // To scroll to the bottom of the chat
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