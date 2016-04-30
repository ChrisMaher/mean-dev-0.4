'use strict';

angular.module('users').controller('ViewProfileController', ['$state','$scope', '$http', '$resource', '$location', 'Users', 'Authentication', '$stateParams', 'Savings', 'Posts',
    function ($state, $scope, $http, $resource, $location, Users, Authentication, $stateParams) {

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        if ($scope.authentication.user.passwordChanged === 'false') {

            if ($state !== 'settings.password') {

                $state.go('settings.password');

            }

        }

        $http.get('api/users/' + $stateParams.userId).success(function (data) {
            $scope.profile = data;
        });

        $http.get('savings/usersSavingsPostedTotal/' + $stateParams.userId).success(function (data1) {
            $scope.savingsByUser = data1;

            $scope.totalUpvotes = 0;
            $scope.totalDownvotes = 0;

            for (var i = 0; i < $scope.savingsByUser.length; i++) {

                $scope.totalUpvotes = $scope.totalUpvotes + $scope.savingsByUser[i].upVoters.length;
            }

            for (var x = 0; x < $scope.savingsByUser.length; x++) {

                $scope.totalDownvotes = $scope.totalDownvotes + $scope.savingsByUser[x].downVoters.length;
            }

        });

        $http.get('savings/usersUpvotesTotal/' + $stateParams.userId).success(function (data4) {
            $scope.upvotesToUser = data4;
        });

        // $http.get('coupons/usersCouponsPostedTotal/' + $stateParams.userId).success(function (data2) {
        //     $scope.couponsByUser = data2;
        // });

        $http.get('posts/usersCommentsPostedTotal/' + $stateParams.userId).success(function (data3) {
            $scope.commentsByUser = data3;
        });


        $scope.capatilize = function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        $scope.myPage = false;
        if ($stateParams.userId === $scope.authentication.user._id) {
            $scope.myPage = true;
        }



    }
]);
