const bcrypt = require('bcryptjs');

const checkIfEmailExists = function(database, enteredEmail) {
  for (let user in database) {
    if (database[user].email === enteredEmail) {
      return true;
    }
  }
  return false;
};


const checkIfPasswordExists = function(database, enteredPassword) {
  for (let user in database) {
    if (bcrypt.compareSync(enteredPassword, database[user].password)) {
      return true;
    }
  }
  return false;
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

//returns ID based on the email key of the object
const identifyID = function(database, enteredEmail){  
  for (let user in database){
    if (database[user].email === enteredEmail){
      let userID = database[user].id
      return userID;
    }
  }
}

//will return an object where key = shortURL, value = longURL
const urlsForEachUser = function (database, userID){
  let urlsObject = {};
  for (let url in database){
    if (database[url].userID === userID){
      urlsObject[url] = database[url].longURL;
    }
  }
  return urlsObject;
}

module.exports = { checkIfEmailExists, generateRandomString, generateRandomID, checkIfPasswordExists, identifyID, urlsForEachUser }

//module.exports = generateRandomID; 
// module.exports = checkIfPasswordExists; 
// module.exports = identifyID; 
// module.exports = urlsForEachUser; 

