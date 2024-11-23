import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUpload } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null);
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSendMessage = () => {
    if (!input.trim() && !selectedFile) return;

    const userMessage = { text: input, isUser: true, file: selectedFile };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true); 

    // API call simulation
    if (selectedFile) {
      const formData = new FormData();
      formData.append('query', input);
      formData.append('file', selectedFile);

      fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const botMessage = { text: data.answer, isUser: false }; 

          setMessages((prev) => [...prev, botMessage]);
        })
        .catch((error) => {
          console.error("Error:", error);
          const errorMessage = { text: "Oops! Something went wrong.", isUser: false };
          setMessages((prev) => [...prev, errorMessage]);
        })
        .finally(() => {
          setIsLoading(false); 
        });
    } else {
      fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }), 
      })
        .then((response) => response.json())
        .then((data) => {
          const botMessage = { text: data.answer, isUser: false }; 

          setMessages((prev) => [...prev, botMessage]);
        })
        .catch((error) => {
          console.error("Error:", error);
          const errorMessage = { text: "Oops! Something went wrong.", isUser: false };
          setMessages((prev) => [...prev, errorMessage]);
        })
        .finally(() => {
          setIsLoading(false); 
        });
    }

    setInput(""); 
    setSelectedFile(null);
    textareaRef.current.style.height = "auto"; 
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    textareaRef.current.style.height = "auto"; 
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`; 
    textareaRef.current.style.overflow = textareaRef.current.scrollHeight > 96 ? "auto" : "hidden"; 
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col mt-[calc(var(--navbar-height)+20px)] mx-auto ">
      
      {/* Messages Section */}
      <div className="flex-grow p-6 overflow-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} text-lg`}>
              <div className={`${msg.isUser ? 'bg-customLightTeal' : 'bg-white'} p-4 rounded-lg ${msg.isUser ? 'max-w-[70%]' : 'max-w-[90%]'} whitespace-pre-wrap`}>
                <p className={`${msg.isUser ? 'text-gray-800' : 'text-gray-800'}`}>{msg.text}</p>
                {msg.file && (
                  <p className="text-gray-800">
                    <a href={URL.createObjectURL(msg.file)} download>
                      {msg.file.name}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-lg max-w-[90%] text-gray-800 transition-all">
                <p>Buddy is thinking ... </p>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Fixed Input Section */}
      <div className="p-6 bg-white border-t fixed bottom-3 w-fill-available mr-12">
        <div className="flex items-center">
          <button className="mr-4" onClick={handleUploadClick}>
            <FontAwesomeIcon icon={faUpload} size="lg" className="text-customDarkOrange hover:text-orange-600" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            hidden 
          />
          <textarea
            ref={textareaRef}
            className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customDarkOrange resize-none"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            rows={1}
            style={{ maxHeight: "96px", overflow: "hidden" }} 
          />
          <button className="ml-4" onClick={handleSendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} size="lg" className="text-customDarkOrange hover:text-orange-600" />
          </button>
          {selectedFile && (
            <div className="ml-4 text-gray-800">
              Selected File: {selectedFile.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
