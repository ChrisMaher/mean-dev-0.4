'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Deals', 'Users',
  function ($scope, Authentication, Deals, Users) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.numOfDeals = Deals.countDeals();
    $scope.numOfDealsToday = Deals.countDealsToday();

      $scope.numOfUsers = Users.countUsers();
      $scope.numOfUsersToday = Users.countUsersToday();

      //$scope.numOfComments = Comments.countComments();
      //$scope.numOfCommentsToday = Comments.countCommentsToday();










  }
]);

