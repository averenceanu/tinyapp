
const checkIfPasswordExists = function(database, enteredPassword) {
  for (let user in database) {
    if (database[user].password === enteredPassword) {
      return true;
    }
  }
  return false;
};



bcrypt.compareSync(enteredPassword, database[user].password)