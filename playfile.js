
const checkIfPasswordExists = function(database, enteredPassword) {
  for (let user in database) {
    if(bcrypt.compareSync(enteredPassword, database[user].password)){
     return true;
    }
  }
  return false;
};


if (database[user].password === enteredPassword) {}

bcrypt.compareSync(enteredPassword, database[user].password)