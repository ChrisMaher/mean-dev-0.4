'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', '$timeout', 'Authentication',
  function ($scope, $state, $http, $location, $window, $timeout, Authentication) {
    $scope.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    //// If user is signed in then redirect back home
    //if ($scope.authentication.user) {
    //  $location.path('/');
    //}

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model

        $scope.authentication.user = response;

        // And redirect to the previous or home page

        document.location.href = "http://www.saveme.ie/settings/picture";


      }).error(function (response) {
        $scope.error = response.message; 
      });
    };

    //be sure to inject $scope and $location
    $scope.changeLocation = function (url, forceReload) {
      $scope = $scope || angular.element(document).scope();
      if (forceReload || $scope.$$phase) {
        window.location = url;
      }
      else {
        //only use this if you want to replace the history stack
        //$location.path(url).replace();

        //this this if you want to change the URL and add it to the history stack
        $location.path(url);
        $scope.$apply();
      }
    };

    $scope.signin = function (isValid) {
      $scope.error = null;



      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        $scope.authentication.user.imageURL  = '/modules/users/client/img/profile/saveme-placeholder.png';

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });





    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
