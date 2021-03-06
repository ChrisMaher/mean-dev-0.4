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
      numOfReportedPosts: {
        method: 'GET',
        url: '/savings/numOfReportedPosts',
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
      },
      removeVotesDaily: {
        method: 'GET',
        url: '/savings/removeVotesDaily',
        isArray: true
      },
      appPostSaving: {
        method: 'GET',
        url: '/api/savings/app/add',
        isArray: true
      }
    });
  }
]);
