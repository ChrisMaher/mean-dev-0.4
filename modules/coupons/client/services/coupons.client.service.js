'use strict';

//Coupons service used for communicating with the coupons REST endpoints
angular.module('coupons').factory('Coupons', ['$resource',
  function ($resource) {
    return $resource('api/coupons/:couponId', {
      couponId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      countCoupons: {
        method: 'GET',
        url: '/coupons/couponCount',
        isArray: false
      },
      countCouponsToday: {
        method: 'GET',
        url: '/coupons/couponCountToday',
        isArray: false
      },
      usersCouponsPostedTotal: {
        method: 'GET',
        url: '/coupons/usersCouponsPostedTotal',
        isArray: false
      }
    });
  }
]);
