import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
// import io from 'socket.io-client';
import styles from "../styles/messagenotList.module.css";

// const socket = io('http://localhost:8000');


const Message = () => {
  const user = useSelector((state) => state.user.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const { conversationId } = useParams(); 

const userId=user.id;

useEffect(() => {
  const fetchConversationData = async () => {
      // Fetch conversation details based on conversationId
      await fetchConversationDetails(conversationId, userId);
      // Fetch messages for the conversation
      await fetchMessages(conversationId);

  };

  fetchConversationData();
}, [conversationId, userId]);




  const fetchConversationDetails = async (conversationId,userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/message/conversation-details/${conversationId}?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const conversationData = await response.json();
        setSelectedUser(conversationData.otherUser);
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const fetchMessages = async (conversationId) => {

    try {
      const response = await fetch(
        `http://localhost:8000/message/get-messages/${conversationId}`
      );
      if (response.ok) {
        const messageData = await response.json();
        setMessages(messageData);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


 

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      // Make an API call to send the message
      const messageData = {
        sender: user.id,
        room: conversationId,
        content: newMessage,
      };

      fetch("http://localhost:8000/message/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
        .then((response) => {
          if (response.ok) {
            // Message sent successfully, you can update the conversation's messages
            setMessages((prevMessages) => [...prevMessages, messageData]);

            // Clear the new message input
            setNewMessage("");
               
             
            // Emit Socket.IO event to notify the server about the new message
            // io.emit('newMessage', messageData);
          } else {
            console.error("Error sending message");
          }
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  return (
    <div className={styles.messageContainer}>
      <div className={styles.conversationList}>
        <p>{user.username}</p>
        <hr />
        <p>Messages</p>
        <hr />
      </div>
      <div className={styles.chatBox}>

      <div className={styles.selectedUser}>
          {selectedUser && (
            <>
              {selectedUser.profilepic ? (
                <img
                  className={styles.profilepicc}
                  src={selectedUser.profilepic}
                  alt="User profile"
                />
              ) : (
                <img
                  className={styles.profilepicc}
                  src="https://img.icons8.com/fluency/48/test-account.png"
                  alt="Default profile"
                />
              )}
              <span className={styles.username}>{selectedUser.username}</span>
            </>
          )}
        </div>

        
        <div className={styles.chatContent}>
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.sender === user.id
                    ? styles.sentMessage
                    : styles.receivedMessage
                }`}
              >
                {message.content}
                <span className={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleString([], {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.messageInput}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Message;
