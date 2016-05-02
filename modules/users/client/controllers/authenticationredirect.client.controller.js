'use strict';

angular.module('users').controller('AuthenticationRedirectController', ['$scope', '$state', '$http', '$location', '$window', '$timeout', 'Authentication',
  function ($scope, $state, $http, $location, $window, $timeout, Authentication) {

    $scope.userPerson = Authentication;


    // If user is signed in then redirect back home
    if ($scope.userPerson.user) {
      $location.path('/');
    }

  }
]);
