'use strict';

angular.module('users').controller('ViewProfileController', ['$scope', '$http', '$resource', '$location', 'Users', 'Authentication', '$stateParams', 'Savings', 'Coupons', 'Posts',
    function($scope, $http, $resource, $location, Users, Authentication, $stateParams, Savings, Coupons, Posts) {

        $scope.user = Authentication.user;

        $scope.usersSavingsPostedTotal1 = Savings.usersSavingsPostedTotal();
        $scope.usersCouponsPostedTotal1 = Coupons.usersCouponsPostedTotal();
        $scope.usersCommentsPostedTotal1 = Posts.usersCommentsPostedTotal();

        $http.get('api/users/' + $stateParams.userId).success(function(data) {
            $scope.profile=data;
        });


        $scope.capatilize = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };




    }
]);
