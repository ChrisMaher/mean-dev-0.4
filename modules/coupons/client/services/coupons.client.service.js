'use strict';

//Coupons service used for communicating with the coupons REST endpoints
angular.module('coupons').factory('Coupons', ['$resource',
  function ($resource) {
    return $resource('api/coupons/:couponId', {
      couponId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
