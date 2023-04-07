let users = [];

function isValid(username) {
    let isValid = true;
    isValid = !!username && username.trim();
    isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
    return isValid;
  }  


function addUser({ id, room, name }) {
    console.log("**** inside add User function **** ")
    console.log(id, name, room);
    const existingUser = users.find((user) => user.room === room && user.name === name);

    if (!name || !room) return { error: 'Username and room are required.' };
    if (existingUser) return { error: 'Username is taken.' };
    name = name.trim();
    room = room.trim();
    const user = { id, room, name };
    users.push(user);
    console.log("Users array : ", users);
    return { user };
};

function removeUser(id) {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

function getUsersInRoom(room){
    const fitleredUsers =  users.filter((user) => user.room === room);  
    return fitleredUsers;
} 

module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    isValid
  };