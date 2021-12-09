//create a function that will loop through and object properties
//loop if the element given is found in the object given

//the function should take in 2 paramented (the object to loop through) + the element to compaire through

const checkIfEmailExists = function(database, enteredEmail) {
  for (let user in database) {
    if (database[user].email === enteredEmail) {
      return true;
    }
  }
  return false;
};


const database = {
  "001" : {
    id: "001",
    email: "alex@example.com",
    password: "hello1",
  },
  "002": {
    id: "002",
    email: "alice@example.com",
    password: "hello2"
  }
};
console.log(checkIfEmailExists(database, "yev@example.com"));