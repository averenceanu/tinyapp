const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }; 
  res.render('urls_index', templateVars);
  console.log(templateVars, "this is templateVars");
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new')
});


app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;

  //Object.assign(urlDatabase, {[randomString]: req.body.longURL}); //new shortURL added to database 
  res.redirect(`/urls/${randomString}`)
  // const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  // res.render("urls_show", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURL]};
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

