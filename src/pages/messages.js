// Message.js

import React, { useState } from 'react';

const Message = ({ messages }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };


  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      // You can send the new message to the selected conversation
      // For example, by making an API request to your server
      // Then update the conversation's messages
      const updatedConversation = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage],
      };

      // Update the conversation in your state or server
      // For example, you can use Redux to manage state
      // dispatch(updateConversation(updatedConversation));

      // Clear the new message input
      setNewMessage('');
    }
  };

//   return (
//     <div className="message-container">
//       <div className="conversation-list">
//         {messages.map((conversation, index) => (
//           <div
//             key={index}
//             className={`conversation ${selectedConversation === conversation ? 'selected' : ''}`}
//             onClick={() => handleConversationClick(conversation)}
//           >
//             {conversation.user} {/* Display the user's name or conversation details */}
//           </div>
//         ))}
//       </div>
//       <div className="chat-box">
//         {selectedConversation && (
//           <div className="selected-conversation">
//             <div className="messages">
//               {selectedConversation.messages.map((message, index) => (
//                 <div key={index} className="message">
//                   {message}
//                 </div>
//               ))}
//             </div>
//             <div className="message-input">
//               <input
//                 type="text"
//                 placeholder="Type your message..."
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//               />
//               <button onClick={handleSendMessage}>Send</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
};

export default Message;
