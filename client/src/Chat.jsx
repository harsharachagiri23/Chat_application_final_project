import React, { useEffect, useState } from "react";
import {  fetchActiveUsers } from './services';
import ScrollToBottom from "react-scroll-to-bottom";
import Onlineicon from './icons/onlineIcon.png';
import Picker from 'emoji-picker-react';


function Chat({ socket, username, room , onLogout, activeUsers}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [users, setUsers] = useState({});
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };   

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    
  }, [socket]);

  
  useEffect(() => {
    let chatTimer = setTimeout(() => {
      fetchActiveUsers(room).then(userData => {
        setUsers(userData);
      });
    }, 1 * 1000);

    return () => {
      clearTimeout(chatTimer);
    }
    
  }, [users["users"]]);

 

  return (
    <div className="chat-window" >
        <div >
            {(() => {
              if (Object.keys(users).length > 0) {
                return (
                  <div className="activewindow">
                     <h3 className="active_h3">Active on {room} Channel </h3>
                     <div  >
                     <ul id="list">
                        {users["users"].map( (userInfo) =>{
                         
                          return  <li  key = {userInfo} className="activeItem" >
                           
                            {userInfo.name}
                            
                          </li>
                        } )}
                     </ul>
                     </div>
                      <div>
                         {chosenEmoji ? (
                         <span>You chose: {chosenEmoji.emoji}</span>
                         ) : (
                         <span>No emoji Chosen</span>
                         )}
                         <Picker onEmojiClick={onEmojiClick} emojiSize={20} />
                      </div>
                  </div>
                )
              } 
              else {
                
                return (
                  <div></div>
                )
              }
            })()}
      </div>
      <div className="header_body_footer_logout">
      <div className="chat-header">
      
        <p> <img alt="Online Icon" src={Onlineicon} width = "8px"/>
        Live Chat </p>
       
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message} {chosenEmoji.emoji}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
         
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <div > 
      <button className="btn-login" onClick={onLogout}>Logout</button>
      </div>
     
      </div>
    </div>
  );
}

export default Chat;