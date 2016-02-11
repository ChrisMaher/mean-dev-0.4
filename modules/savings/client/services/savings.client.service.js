'use strict';

//Savings service used for communicating with the savings REST endpoints
angular.module('savings').factory('Savings', ['$resource',
  function ($resource) {
    return $resource('api/savings/:savingId', {
      savingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      countSavings: {
        method: 'GET',
        url: '/savings/savingCount',
        isArray: false
      },
      countSavingsToday: {
        method: 'GET',
        url: '/savings/savingCountToday',
        isArray: false
      },
      listOf: {
        method: 'GET',
        url: '/api/savings/of/:userid',
        isArray: true
      },
      usersSavingsPostedTotal: {
        method: 'GET',
        url: '/savings/usersSavingsPostedTotal/:userIdString',
        isArray: true
      }
    });
  }
]);
