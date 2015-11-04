var TingoDb = require('tingodb')().Db;
//var MongoDb = require('mongodb');
var merge = require('lodash.merge');

var db = new TingoDb('./database', {});
//var db = new MongoDb.Db('test', new MongoDb.Server('locahost', 27017));
var usersCollection = db.collection('users');;

module.exports = {getUser, saveUser};

function getUser(username, callback) {
  usersCollection.find({username: username}, function(err, result) {
    callback(result);
  });
}

function saveUser(userData, callback) {
  var newUser = {syncCount: 0, tweets: []};
  var condition = {username: userData.username};

  getUser(condition, function(user) {
    if(user) {
      user = merge(user, userData); //user is already in db but new tokens need to be updated in db.
    } else {
      user = merge(newUser, userData); //adding new user
    }

    usersCollection.update(condition, user, {upsert: true, w: 2}, function(err, result, status) {
      console.log(err, result, status);
      callback(result);
    });
  });
}
