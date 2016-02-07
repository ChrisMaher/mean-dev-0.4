'use strict';

//Posts service used for communicating with the posts REST endpoints
angular.module('posts').factory('Posts', ['$resource',
  function ($resource) {
    return $resource('posts/:postId', {
      postId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      countPosts: {
        method: 'GET',
        url: '/posts/postCount',
        isArray: false
      },
      countPostsToday: {
        method: 'GET',
        url: '/posts/postCountToday',
        isArray: false
      },
      countCustomersSaving: {
        method: 'GET',
        url: '/posts/custCountSaving',
        isArray: false
      },
      countCustomersCoupon: {
        method: 'GET',
        url: '/posts/custCountCoupon',
        isArray: false
      }
    });
  }
]);
