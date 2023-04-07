# Chat Application

This project is a chat application where users should login. 

After logging-in to the app, user will be prompted to enter chat room name and alias with which user wants to Chat

When new user joins in the room, in the active users the list will get updated with the latest user who joined.

When the user clicks on Logout, he will be logged out of the application. If the user logs out when he joined a room, and when he joins back, he will be joined into the room automatically

## Steps to run the application

Clone the repo. Then go into the client folder and run the below command to install all the necessary requirements.

```bash
cd client/
npm install 
```

Simillarly for server, please go into the server folder and run the below command

```bash
cd server/
npm install 
```

After running the above command inside both the folders, go inside client folder and run the below command
```bash
cd client/
npm run build 
```
After build completes, run the below command to start the application from the client folder
```bash
npm run start
```

## Components of the project

#### App.jsx  
    
* Main logic that conditionally renders components based on LogIn and LogOut

#### LoginForm.jsx 

* Login Form to enter the username     
* Validation is done to the entered username so that only alpha numeric characters are allowed and username dog is not allowed

#### Chat.jsx 

* This component show the active users in the room  
* In addtion to active users, chat area with text input is shown so that new messages can be displayed and typed
* Also, the group channels are also shown in this component

## Highlights_of_project

* Used `socket.io` in server to connect and disconnect the user.
* Used `cookie-parser` and `express.js` in the server
* Built API's for real-time functionality
* Imported `emoji-mart` library for using emojis while messaging
* Created a multiple channels for group chats
* Fully functioning live chat feature
* Used `useState` for state management

## Technologies_used
* Frontend: ReactJS, emoji-mart, Socket.io
* Backend: Socket.io, Express.js, Node.js

## Further Improvements

* Adding image, GIFs to the chat
* video/voice calling to the chat 
* text auto correction feature

## Contributing

NUID: 002105042
NAME: HARSHA VARDHANI RACHAGIRI