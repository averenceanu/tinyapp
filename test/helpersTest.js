const { assert } = require('chai');

const { checkIfEmailExists } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('checkIfEmailExists', function() {
  it('should return true if an user with this email exists', function() {
    const user = checkIfEmailExists(testUsers, "user@example.com")
    const expectedAnswer = true;
    assert.strictEqual(user, expectedAnswer)
  });
  it('should return false if an user with this email does not exists', function() {
    const user = checkIfEmailExists(testUsers, "user3@example.com")
    const expectedAnswer = false;
    assert.strictEqual(user, expectedAnswer)
  });
});