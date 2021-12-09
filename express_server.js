const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['b10783d2-24ed-4a30-9b84-9c10ea429bfd', 'f56a87b1-5588-4f8a-beb0-3e1b06aa40e2',] 
}));  

//////////////////////////////// FUNCTIONS  ////////////////////////////////

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
//////////////////////////////// DATABASE ////////////////////////////////
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "001"
  },

  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "001"
  }
};

const users = {
  "001" : {
    id: "001",
    email: "alex@example.com",
    password: bcrypt.hashSync("hello1", 10) //"hello1",
  },
  "002": {
    id: "002",
    email: "alice@example.com",
    password: bcrypt.hashSync("hello2", 10) //"hello2",
  }
};

////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const thisUserURL = urlsForEachUser(urlDatabase, userID)
  const templateVars = { urls: urlDatabase, user, thisUserURL };
  console.log("urlsDatabase", urlDatabase)
  res.render('urls_index', templateVars);
});

//////////////////////////////// FUNCTIONAL: SHORTEN URL ////////////////////////////////

// Create new short URL
app.get('/urls/new', (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  //let thisUserURL = urlsForEachUser(urlDatabase, userID)
  const templateVars = { urls: urlDatabase, user } // thisUserURL };
  res.render('urls_new', templateVars);
});

//When submit botton clicked > generate new shortURL > redirect to urls/newShortURL
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString]= {longURL: req.body.longURL, userID: req.session["user_id"]};
  res.redirect(`/urls/${randomString}`);
});

//Page with the newShortURL
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session["user_id"];
  const user = users[userID];
  if (!user){
    res.status(403).send("Please login to access this page.");
    return;
  }
  if (urlDatabase[shortURL].userID !== userID){
    console.log("Please")
    res.status(403).send("You cannot access this page!");
    return;
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURL].longURL, user };
  res.render("urls_show", templateVars);
});

//When clicked on newShortURL > redirects to longURL web page;
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//When delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//When edit URL
app.post("/urls/:shortURL/edit", (req, res) =>{
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

//When updating longURl
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; 
  urlDatabase[shortURL].longURL = req.body.longURL; 
  res.redirect('/urls'); 
});

////////////////////////////// REGISTRATION //////////////////////////////
app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const userID = generateRandomID();
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;
  if (enteredEmail.length <= 0 || enteredPassword.length <= 0) {
    res.status(400).send("That's an error. Please enter a valid email address and password.");
    res.end();
  } else if (checkIfEmailExists(users, enteredEmail)) {
    res.status(400).send("That's an error. This email is used by another account.");
    res.end();
  } else {
    const password = req.body.password; 
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[userID] = { id: userID, email:req.body.email, password:hashedPassword }; //addind the new registration to users database
    req.session.user_id = userID; 
    res.redirect("/urls");
    console.log("users database", users)
  }
});

////////////////////////////// LOGIN //////////////////////////////
app.get("/login", (req, res) => {
  const templateVars = { user: null };
  res.render("login", templateVars);
});

//When login button clicked
app.post("/login", (req, res) => {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;
  
  if (!checkIfEmailExists(users, enteredEmail)) {
    res.status(403).send("E-mail cannot be found.");
    res.end();
  }
  if (!checkIfPasswordExists(users, enteredPassword)) {
    res.status(403).send("Password does not match.");
    res.end();
  } else {
    const userID = identifyID(users, enteredEmail);
    users[userID] = { id: userID, email:req.body.email, password:req.body.password}; //assigning a new ID to user
    req.session.user_id = userID; 
    res.redirect("/urls");
  }
});

////////////////////////////// LOGOUT //////////////////////////////
app.post("/logout", (req, res) => {
  req.session['user_id'] = null;
  res.redirect("/urls");
});

////////////////////////////// REDIRECT //////////////////////////////
app.post("/redirect", (req, res) => {
  res.redirect("/login");
})

////////////////////////////// PORT  //////////////////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});