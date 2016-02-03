'use strict';

// Setting up route
angular.module('coupons').config(['$stateProvider',
  function ($stateProvider) {
    // Coupons state routing
    $stateProvider
      .state('coupons', {
        abstract: true,
        url: '/coupons',
        template: '<ui-view/>'
      })
      .state('coupons.list', {
        url: '',
        templateUrl: 'modules/coupons/client/views/list-coupons.client.view.html'
      })
      .state('coupons.create', {
        url: '/create',
        templateUrl: 'modules/coupons/client/views/create-coupon.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('coupons.view', {
        url: '/:couponId',
        templateUrl: 'modules/coupons/client/views/view-coupon.client.view.html'
      })
      .state('coupons.edit', {
        url: '/:couponId/edit',
        templateUrl: 'modules/coupons/client/views/edit-coupon.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
