import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import msg from './icons/ChatApp.jpg';

import LoginForm from "./LoginForm";

import {
  LOGIN_STATUS
} from './constants';

import {
  fetchSession,
  fetchLogin,
  fetchLogout,
  fetchActiveUsers
} from './services';


const socket = io.connect("http://localhost:3001");


function App() {
  
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [ loginStatus, setLoginStatus ] = useState(LOGIN_STATUS.NOT_LOGGED_IN); 
  const [ activeUsers, setActiveUsers ] = useState({});
  const [ error, setError ] = useState('');


  const data = {name: username, userId: socket.id};
  socket.emit('setSocketId', data);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
      getActiveUsers(room);
    }
  };

  function onLogin( username ) {
    console.log("*** Clicked on login for username : ", username);
    fetchLogin(username)
    .then( fetchedTodos => {
      console.log("fetched TOds : ", fetchedTodos)
      setError(''); 
      setUsername(username);
      setLoginStatus(LOGIN_STATUS.IS_LOGGED_IN);
    })
    .catch( err => {
      setError(err?.error || 'ERROR');
    });
  }

  function onLogout() {
    setError('');
    setUsername('');
    setLoginStatus(LOGIN_STATUS.NOT_LOGGED_IN);
    fetchLogout() 
    .catch( err => {
      setError(err?.error || 'ERROR'); 
    });
  }

  function getActiveUsers(room){
    console.log("*** Inside get Active Users : ");
    fetchActiveUsers(room)
    .then( userData => {
      console.log("Data from fetchActive Users  : ", userData);
      setActiveUsers(userData)
    })
  }

  console.log("Login status : ", loginStatus);
  return (
    <div className="App">
      { loginStatus === LOGIN_STATUS.NOT_LOGGED_IN && <LoginForm onLogin={onLogin}/>  }
      { loginStatus === LOGIN_STATUS.IS_LOGGED_IN  && (
        <div >
            {!showChat ? (
            <div className="joinChatContainer">
               <img className="Chatlogo" src ={msg} alt = " msg " height={200} width={200}/>
              <input
                className="btn-submit"
                type="text"
                placeholder="Enter your nickname..."
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <input
                className="btn-submit"
                type="text"
                placeholder="#channels"
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              />
              <button className="btn-login"  onClick={joinRoom}>Join Channel</button>
            </div>
          ) : (
            <Chat socket={socket} username={username} room={room} onLogout={onLogout} activeUsers={activeUsers} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;