'use strict';

/**
 * Module dependencies.
 */
var couponsPolicy = require('../policies/coupons.server.policy'),
    coupons = require('../controllers/coupons.server.controller');

module.exports = function (app) {

    app.route('/api/coupons/picture')
        .post(coupons.changeProductPictureCoupon);

    // Coupons collection routes
    app.route('/api/coupons').all(couponsPolicy.isAllowed)
        .get(coupons.list)
        .post(coupons.create);

    // Single coupon routes
    app.route('/api/coupons/:couponId').all(couponsPolicy.isAllowed)
        .get(coupons.read)
        .put(coupons.update)
        .delete(coupons.delete);

    app.route('/coupons/couponCount').all()
        .get(coupons.countCoupons);

    app.route('/coupons/couponCountToday').all()
        .get(coupons.countCouponsToday);

    app.route('/coupons/usersCouponsPostedTotal/:userIdStringCoupon')
        .get(coupons.usersCouponsPostedTotal);


    // Finish by binding the coupon middleware
    app.param('couponId', coupons.couponByID);
    app.param('userIdStringCoupon', coupons.usersCouponsPostedTotal);

};
