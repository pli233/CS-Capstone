// // src/ChatBox.js
// import React from 'react';
// import { FaComments } from 'react-icons/fa';
// import './ChatBox.css';

// const ChatBox = () => {
//   return (
//     <div className="chat-box">
//       <div className="header">
//         <FaComments />
//         <span>Chat</span>
//       </div>
//       <div className="body"> {/* Add chat messages here */}</div>
//       <div className="footer">
//         <input type="text" placeholder="Type your message..." />
//         <button>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

// src/ChatBox.js
import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import './ChatBox.css';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    setMessages([...messages, { text: newMessage, type: 'user' }]);
    // Simulate chat bot response (replace with actual chat bot integration)
    simulateChatBotResponse(newMessage);

    setNewMessage('');
  };

  const simulateChatBotResponse = (userMessage) => {
    // Simulate chat bot response for demonstration purposes
    const botResponse = `Chat bot says: I received "${userMessage}"`;
    setMessages([...messages, { text: botResponse, type: 'bot' }]);
  };

  return (
    <>
      {isOpen && (
        <div className="chat-bot">
          <div className="header">
            <FaComments />
            <span>ChatBot</span>
            <button className="close-button" onClick={toggleChat}>
              &times;
            </button>
          </div>
          <div className="body">
            {messages.map((msg, index) => (
              <div key={index} className={msg.type}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="footer">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
      <div className="toggle-button" onClick={toggleChat}>
        <FaComments />
      </div>
    </>
  );
};

export default ChatBox;