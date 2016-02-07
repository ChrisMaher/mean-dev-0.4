'use strict';

var usersPolicy = require('../policies/admin.server.policy');

module.exports = function (app) {

  // User Routes
  var users = require('../controllers/users.server.controller');

  //// Savings collection routes
  //app.route('/api/users').all(usersPolicy.isAllowed)
  //    .get(users.list)
  //    .post(users.create);
  //
  //// Single saving routes
  //app.route('/api/users/:userId').all(usersPolicy.isAllowed)
  //    .get(users.read)
  //    .put(users.update)
  //    .delete(users.delete);

  app.route('/users/userCount').all()
      .get(users.countUsers);

  app.route('/users/userCountToday').all()
      .get(users.countUsersToday);

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);



  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
