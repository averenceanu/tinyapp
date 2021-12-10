const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return an user witha valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedAnswer = "userRandomID";
    assert.strictEqual(user, expectedAnswer)
  });
  it('should return undefined if user does not exists', function() {
    const user = getUserByEmail("user333@example.com", testUsers)
    const expectedAnswer = undefined;
    assert.strictEqual(user, expectedAnswer)
  });
});