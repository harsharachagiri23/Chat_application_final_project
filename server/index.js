const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const sessions = require('./sessions');
const userData = require("./Users");

app.use(cors());
app.use(cookieParser());
app.use(express.static('./build'));
app.use(express.json());

const port = process.env.PORT || 3001;


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  let username = "";
  let userId = "" 
  let roomName = "";

  socket.on( "setSocketId", (data) => {
    console.log("set socket data : ", data);
    username = data["name"];
    userId = data["userId"];
  });

  socket.on("join_room", (data) => {
    roomName = data;
    userData.addUser({ id: userId, name: username, room: roomName });
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    console.log("getUsersInRoom Inside jpin_room : ", userData.getUsersInRoom(roomName));
  });

  io.in(roomName).emit('allUsersData', {
    room: roomName,
    users: userData.getUsersInRoom(roomName)
  });

  

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    userData.removeUser(socket.id);
  });

});

app.get('/api/v1/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/v1/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !userData.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }
  res.json({username});
});

app.post('/api/v1/session', (req, res) => {
  const { username } = req.body;
  console.log("Entered Username : ", username);
  if(!userData.isValid(username)) {
    res.status(400).json({ error: 'required-username' });
    return;
  }

  if(username === 'dog') {
    res.status(403).json({ error: 'auth-insufficient' });
    return;
  }

  const sid = sessions.addSession(username);
  console.log("Session for user " , sessions.getSessionUser(sid));
  console.log("SID GENRETED : ", sid);

  res.clearCookie('sid');
  res.cookie('sid', sid);
  res.json({ username });
});

app.delete('/api/v1/session', (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : '';

  if(sid) {
    res.clearCookie('sid');
  }

  if(username) {
    sessions.deleteSession(sid);
  }

  res.json({ username });
});

server.listen(port, () =>
    console.log(`App running on port ${port}.`)
);


app.get('/api/v1/users/:room', (req, res) => {
  const sid = req.cookies.sid;
  const { room } = req.params;
  const username = sid ? sessions.getSessionUser(sid) : '';
  if(!sid || !userData.isValid(username)) {
    res.status(401).json({ error: 'auth-missing' });
    return;
  }

  res.json({ 'users' : userData.getUsersInRoom(room), room : room });

});