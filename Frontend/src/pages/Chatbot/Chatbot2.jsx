import React, { useState, useRef, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
 } from "@chatscope/chat-ui-kit-react";

import { postData } from '../../services/apiService';
const OPENAI_API_KEY = "YOUR API KEY";


// const dummyResponses = {
//   "hello": "Hi there! How can I help you today?",
//   "how are you": "I'm just a bot, but I'm doing great! How about you?",
//   "i am good": "That's great to hear! How can I assist you today?",
//   "i am working on chatbot creation": "That's awesome! I'm a chatbot too! 😄",
//   "bye": "Goodbye! Have a great day!"
// };

const Chatbot = () => {
  // State to manage the typing indicator of the chatbot
 const [isChatbotTyping, setIsChatbotTyping] = useState(false);

 // State to store chat messages
 const [chatMessages, setChatMessages] = useState([
   {
     message: "Hello, I am ChatGPT!",
     sender: "ChatGPT",
   },
 ]);

 // Function to handle user messages
 const handleUserMessage = async (userMessage) => {
   // Create a new user message object
   const newUserMessage = {
     message: userMessage,
     sender: "user",
     direction: "outgoing",
   };

   // Update chat messages state with the new user message
   const updatedChatMessages = [...chatMessages, newUserMessage];
   setChatMessages(updatedChatMessages);

   // Set the typing indicator for the chatbot
   setIsChatbotTyping(true);

   // Process user message with ChatGPT
   await processUserMessageToChatGPT(updatedChatMessages);
 };

 // Function to send the user message to ChatGPT API
 async function processUserMessageToChatGPT(messages) {
   // Prepare the messages in the required format for the API
   let apiMessages = messages.map((messageObject) => {
     let role = "";
     if (messageObject.sender === "ChatGPT") {
       role = "assistant";
     } else {
       role = "user";
     }
     return { role: role, content: messageObject.message };
   });

   // System message for ChatGPT
   const systemMessage = {
     role: "system",
     content: "Explain all concept like a Professor in Biochemistry",
   };

   // Prepare the API request body
   const apiRequestBody = {
     model: "gpt-3.5-turbo",
     messages: [
       systemMessage, // System message should be in front of user messages
       ...apiMessages,
     ],
   };

   // Manually place some message without API call for testing
    setChatMessages([
      ...messages,
      {
        message: "I am a chatbot",
        sender: "ChatGPT",
        direction: "incoming"
      },
    ]);
    setIsChatbotTyping(false);

   // Send the user message to ChatGPT API
  //  await fetch("https://api.openai.com/v1/chat/completions", {
  //    method: "POST",
  //    headers: {
  //      Authorization: "Bearer " + OPENAI_API_KEY,
  //      "Content-Type": "application/json",
  //    },
  //    body: JSON.stringify(apiRequestBody),
  //  })
  //    .then((data) => {
  //      return data.json();
  //    })
  //    .then((data) => {
  //      // Update chat messages with ChatGPT's response
  //      setChatMessages([
  //        ...messages,
  //        {
  //          message: data.choices[0].message.content,
  //          sender: "ChatGPT",
  //        },
  //      ]);
  //      // Set the typing indicator to false after getting the response
  //      setIsChatbotTyping(false);
  //    });
 }

 return (
  <>
    {/* A container for the chat window */}
    <div className="relative h-[90%] w-[90%] max-w-[1300px] max-h-[1000px]    mx-auto mt-5 border border-gray-300 shadow-md rounded-lg bg-gray-100 p-4">
      <MainContainer className="h-full">
        <ChatContainer className="h-full">
          {/* Display chat messages and typing indicator */}
          <MessageList
            typingIndicator={
              isChatbotTyping ? (
                <TypingIndicator content="ChatGPT is thinking" />
              ) : null
            }
            className="p-4 bg-white rounded-lg h-[80%] overflow-y-auto"
          >
            {/* Map through chat messages and render each message */}
            {chatMessages.map((message, i) => {
              return (
                <Message
                  key={i}
                  model={message}
                  className={`mb-3 px-4 py-2 rounded-lg ${
                    message.sender === "ChatGPT"
                      ? "text-left"
                      : "text-right"
                  }`}
                />
              );
            })}
          </MessageList>
          {/* Input field for the user to type messages */}
          <MessageInput
            placeholder="Type Message here"
            onSend={handleUserMessage}
            className="border-t border-gray-300 mt-4 p-3"
          />
        </ChatContainer>
      </MainContainer>
    </div>
  </>
);
};

export default Chatbot;