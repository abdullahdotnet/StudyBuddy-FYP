import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUpload } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for API
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true); // Start loading

    // API call simulation
    fetch("http://127.0.0.1:8000/api/chatbot/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: input }), // Send the query
    })
      .then((response) => response.json())
      .then((data) => {
        const botMessage = { text: data.answer, isUser: false }; // API response as bot message

        setMessages((prev) => [...prev, botMessage]);
      })
      .catch((error) => {
        console.error("Error:", error);
        const errorMessage = { text: "Oops! Something went wrong.", isUser: false };
        setMessages((prev) => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsLoading(false); // End loading
      });

    setInput(""); // Clear input field
    textareaRef.current.style.height = "auto"; // Reset height
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Auto-resize logic
    textareaRef.current.style.height = "auto"; // Reset height
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`; // Grow up to 3 lines max
    textareaRef.current.style.overflow = textareaRef.current.scrollHeight > 96 ? "auto" : "hidden"; // Show scrollbar if content exceeds 3 lines
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col mt-20 mx-auto">
      
      {/* Messages Section */}
      <div className="flex-grow p-6 overflow-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`${msg.isUser ? 'bg-gray-100' : 'bg-white'} p-4 rounded-lg shadow-md ${msg.isUser ? 'max-w-[70%]' : 'max-w-[90%]'} whitespace-pre-wrap`}>
                <p className={`${msg.isUser ? 'text-gray-800' : 'text-gray-800'}`}>{msg.text}</p>
              </div>
            </div>
          ))}
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-lg shadow-md max-w-[90%] text-gray-800">
                <p>Buddy is thinking. Dont worry: I will blow your mind</p>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Fixed Input Section */}
      <div className="p-6 bg-white border-t fixed bottom-3 w-fill-available mr-12">
        <div className="flex items-center">
          <button className="mr-4">
            <FontAwesomeIcon icon={faUpload} size="lg" className="text-orange-400 hover:text-orange-600" />
          </button>
          <textarea
            ref={textareaRef}
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            rows={1}
            style={{ maxHeight: "96px", overflow: "hidden" }} // Maximum height set to 3 lines, hide scrollbar initially
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