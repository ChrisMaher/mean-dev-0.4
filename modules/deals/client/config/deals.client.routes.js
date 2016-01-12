'use strict';

// Setting up route
angular.module('deals').config(['$stateProvider',
  function ($stateProvider) {
    // Deals state routing
    $stateProvider
      .state('deals', {
        abstract: true,
        url: '/deals',
        template: '<ui-view/>'
      })
      .state('deals.list', {
        url: '',
        templateUrl: 'modules/deals/client/views/list-deals.client.view.html'
      })
      .state('deals.create', {
        url: '/create',
        templateUrl: 'modules/deals/client/views/create-deal.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('deals.view', {
        url: '/:dealId',
        templateUrl: 'modules/deals/client/views/view-deal.client.view.html'
      })
      .state('deals.edit', {
        url: '/:dealId/edit',
        templateUrl: 'modules/deals/client/views/edit-deal.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
