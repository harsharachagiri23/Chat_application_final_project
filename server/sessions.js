const uuid = require('uuid').v4;

const sessions = {};

function addSession(username) {
  const sid = uuid();
  sessions[sid] = {
    username,
  };
  console.log("ADD SESSION : ", sessions);
  return sid;
};

function getSessionUser(sid) {
  return sessions[sid]?.username;
}

function deleteSession(sid) {
  console.log(sessions);
  delete sessions[sid];
}

module.exports = {
  addSession,
  deleteSession,
  getSessionUser,
};
