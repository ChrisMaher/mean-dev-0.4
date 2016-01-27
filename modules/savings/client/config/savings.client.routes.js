'use strict';

// Setting up route
angular.module('savings').config(['$stateProvider',
  function ($stateProvider) {
    // Savings state routing
    $stateProvider
      .state('savings', {
        abstract: true,
        url: '/savings',
        template: '<ui-view/>'
      })
      .state('savings.list', {
        url: '',
        templateUrl: 'modules/savings/client/views/list-savings.client.view.html'
      })
      .state('savings.create', {
        url: '/create',
        templateUrl: 'modules/savings/client/views/create-saving.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('savings.view', {
        url: '/:savingId',
        templateUrl: 'modules/savings/client/views/view-saving.client.view.html'
      })
      .state('savings.edit', {
        url: '/:savingId/edit',
        templateUrl: 'modules/savings/client/views/edit-saving.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
