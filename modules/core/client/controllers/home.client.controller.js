'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Deals', 'Users', 'Posts',
  function ($scope, Authentication, Deals, Users, Posts) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.numOfDeals = Deals.countDeals();
    $scope.numOfDealsToday = Deals.countDealsToday();

      $scope.numOfUsers = Users.countUsers();
      $scope.numOfUsersToday = Users.countUsersToday();

      $scope.numOfPosts = Posts.countPosts();
      $scope.numOfPostsToday = Posts.countPostsToday();


  }
]);

