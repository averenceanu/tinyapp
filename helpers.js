const bcrypt = require('bcryptjs');

const getUserByEmail = function(email, database) {
  for (let user in database){
    if(database[user].email === email){
      return database[user].id; 
    }
  }
  return undefined;
};

const generateRandomString = function() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    const randomNum = Math.floor(Math.random() * characters.length);
    randomStr += characters[randomNum];
  }
  return randomStr;
};

const generateRandomID = function() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomStr = "";
  for (let i = 0; i < 3; i++) {
    const randomNum = Math.floor(Math.random() * characters.length);
    randomStr += characters[randomNum];
  }
  return randomStr;
};

//will return an object where key = shortURL, value = longURL
const urlsForEachUser = function (database, userID){
  let urlsObject = {};
  for (let url in database){
    if (database[url].userID === userID){
      urlsObject[url] = database[url].longURL;
    }
  }
  return urlsObject;
};

module.exports = { generateRandomString, generateRandomID, checkIfPasswordExists, identifyID, urlsForEachUser, getUserByEmail }

