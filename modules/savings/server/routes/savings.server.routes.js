'use strict';

/**
 * Module dependencies.
 */
var savingsPolicy = require('../policies/savings.server.policy'),
    savings = require('../controllers/savings.server.controller');

module.exports = function (app) {

    app.route('/api/savings/picture')
        .post(savings.changeProductPictureSaving);

    // Savings collection routes
    app.route('/api/savings').all(savingsPolicy.isAllowed)
        .get(savings.list)
        .post(savings.create);

    // Single saving routes
    app.route('/api/savings/:savingId')
        .all(savingsPolicy.isAllowed)
        .get(savings.read)
        .put(savings.update)
        .delete(savings.delete);
    
    // Single saving routes
    app.route('/api/savings/app/downvote/:savingId/:email1')
        .put(savings.appDownvoteSaving)
        .get(savings.read);

    // Single saving routes
    app.route('/api/savings/app/upvote/:savingId/:email')
        .put(savings.appUpvoteSaving)
        .get(savings.read);

    // Single saving routes
    app.route('/api/savings/app/add/')
        .put(savings.appPostSaving)
        .get(savings.read);

    app.route('/savings/savingCount').all()
        .get(savings.countSavings);

    app.route('/savings/savingCountToday').all()
        .get(savings.countSavingsToday);

    app.route('/savings/numOfReportedPosts').all()
        .get(savings.numOfReportedPosts);

    //app.route('/savings/usersSavingsPostedTotal').all()
    //    .get(savings.usersSavingsPostedTotal);

    app.route('/api/savings/of/:userid')
        .get(savings.listOf);

    app.route('/api/savings/of/:username')
        .get(savings.listOf);

    app.route('/savings/usersSavingsPostedTotal/:userIdString')
        .get(savings.usersSavingsPostedTotal);

    app.route('/savings/usersUpvotesTotal/:userIdString')
        .get(savings.usersUpvotesTotal);

    app.route('/savings/removeVotesDaily')
        .get(savings.removeVotesDaily);

    // Finish by binding the saving middleware
    app.param('savingId', savings.savingByID);
    app.param('userid', savings.listOf);
    app.param('userIdString', savings.usersSavingsPostedTotal);
    app.param('userIdString', savings.usersUpvotesTotal);
    app.param('email', savings.appUpvoteSaving);
    app.param('email1', savings.appDownvoteSaving);

};
