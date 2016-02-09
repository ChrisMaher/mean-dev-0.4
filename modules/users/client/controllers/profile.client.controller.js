'use strict';

angular.module('users').controller('ViewProfileController', ['$scope', '$http', '$resource', '$location', 'Users', 'Authentication', '$stateParams',
    function($scope, $http, $resource, $location, Users, Authentication, $stateParams) {

        $scope.user = Authentication.user;

        $http.get('api/users/' + $stateParams.userId).success(function(data) {
            $scope.profile=data;
        });


        $scope.capatilize = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };




    }
]);
