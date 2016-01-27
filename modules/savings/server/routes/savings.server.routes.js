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
    app.route('/api/savings/:savingId').all(savingsPolicy.isAllowed)
        .get(savings.read)
        .put(savings.update)
        .delete(savings.delete);

    app.route('/savings/savingCount').all()
        .get(savings.countSavings);

    app.route('/savings/savingCountToday').all()
        .get(savings.countSavingsToday);


    // Finish by binding the saving middleware
    app.param('savingId', savings.savingByID);

};
