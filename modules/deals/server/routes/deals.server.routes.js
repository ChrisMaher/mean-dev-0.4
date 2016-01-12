'use strict';

/**
 * Module dependencies.
 */
var dealsPolicy = require('../policies/deals.server.policy'),
    deals = require('../controllers/deals.server.controller');

module.exports = function (app) {



  // Deals collection routes
  app.route('/deals').all(dealsPolicy.isAllowed)
      .get(deals.list)
      .post(deals.create);

  app.route('/deals/dealCount').all()
      .get(deals.countDeals);

  app.route('/deals/dealCountToday').all()
      .get(deals.countDealsToday);


  // Single deal routes
  app.route('/deals/:dealId').all(dealsPolicy.isAllowed)
      .get(deals.read)
      .put(deals.update)
      .delete(deals.delete);

  // Finish by binding the deal middleware
  app.param('dealId', deals.dealByID);

  app.route('/api/deals')
      .get(deals.list);

  app.route('/api/deals/picture')
      .post(deals.changeProductPicture);

  app.route('/api/deals/:dealId')
      .get(deals.read);



};
