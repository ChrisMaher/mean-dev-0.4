'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Deals', 'Users', 'Posts',
    function ($scope, Authentication, Deals, Users, Posts) {

        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        $scope.numOfDeals = Deals.countDeals();
        $scope.numOfDealsToday = Deals.countDealsToday();

        $scope.numOfUsers = Users.countUsers();
        $scope.numOfUsersToday = Users.countUsersToday();

        $scope.numOfPosts = Posts.countPosts();
        $scope.numOfPostsToday = Posts.countPostsToday();

        $scope.selectedLogo = 'All';

        $scope.setUserImage = function () {

            $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';

        };

        $scope.setFilterText = function (name) {

            $scope.selectedLogo = name;

        };


    }
]);

