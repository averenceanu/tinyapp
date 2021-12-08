const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());

const generateRandomString = function (){
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    const randomNum = Math.floor(Math.random() * characters.length);
    randomStr += characters[randomNum];
  }
  return randomStr;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);  
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Home Page 
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] }; 
  res.render('urls_index', templateVars);
});

//Create new URL
app.get('/urls/new', (req, res) => {
  res.render('urls_new')
});

//When submit botton clicked > generate new shortURL > redirect to urls/newShortURL
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`)
});

//Page with the newShortURL 
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

//When clicked on newShortURL > redirects to longURL web page; 
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//When delete URL 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

//When edit URL
app.post("/urls/:shortURL/edit", (req, res) =>{
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`)
});

//When updating longURl
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  //extract the new longURL 
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//When login button clicked
app.post("/login", (req, res) => {
  let username = req.body.username; 
  res.cookie("username", username);
  
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});