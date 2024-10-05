import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUpload } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Dummy responses
  const generateDummyResponse = () => {
    const responses = [
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      "I understand your question! Let's dive into it.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
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
    textareaRef.current.style.height = "auto"; // Reset height to auto for re-calculation
    textareaRef.current.style.overflow = "hidden"; // Hide scrollbar
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
                {/* Add "whitespace-pre-wrap" to preserve line breaks */}
                <p className={`${msg.isUser ? 'text-gray-800' : 'text-gray-800'}`}>{msg.text}</p>
              </div>
            </div>
          ))}
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