const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "001"
  },

  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "001"
  },

  "1smdd5xK": {
    longURL: "http://www.google.ru",
    userID: "001"
  }
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
}

//before allowed to access the page > make sure the shortURL is in the urlsForEachUser function
const checkAccess = function (shortURlaccessed, userID){
  const usersDataBase = urlsForEachUser(urlDatabase, userID)
  for (let shortURL in usersDataBase){
    if (shortURlaccessed === shortURL){
      return true; 
    }
  }
  return false; 
}
console.log(checkAccess("9sm5xK", "001"))