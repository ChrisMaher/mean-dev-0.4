'use strict';

angular.module('users').controller('ViewProfileController', ['$scope', '$http', '$resource', '$location', 'Users', 'Authentication', '$stateParams', 'Savings',
    function($scope, $http, $resource, $location, Users, Authentication, $stateParams, Savings) {

        $scope.user = Authentication.user;

        $scope.usersSavingsPostedTotal = Savings.usersSavingsPostedTotal();

        $http.get('api/users/' + $stateParams.userId).success(function(data) {
            $scope.profile=data;
        });


        $scope.capatilize = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };




    }
]);
