'use strict';

module.exports = function (app) {

    // User Routes
    var users = require('../controllers/users.server.controller');

    app.route('/users/userCount').all()
        .get(users.countUsers);

    app.route('/users/userCountToday').all()
        .get(users.countUsersToday);

    // Setting up the users profile api
    app.route('/api/users').put(users.update);
    app.route('/api/users/me').get(users.me);
    app.route('/api/users/:userId').get(users.me);
    app.route('/api/users/accounts').delete(users.removeOAuthProvider);
    app.route('/api/users/password').post(users.changePassword);
    app.route('/api/users/picture').post(users.changeProfilePicture);

    app.route('/api/users/:userName').get(users.userByUsername);


    // Finish by binding the user middleware
    app.param('userId', users.userByID);
    app.param('userName', users.userByUsername);

};
