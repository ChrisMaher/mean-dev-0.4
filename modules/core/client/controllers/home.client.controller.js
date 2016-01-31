'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Deals', 'Savings', 'Users', 'Posts',
    function ($scope, Authentication, Deals, Savings, Users, Posts) {


        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        $scope.numOfSavings = Savings.countSavings();
        $scope.numOfSavingsToday = Savings.countSavingsToday();

        $scope.numOfUsers = Users.countUsers();
        $scope.numOfUsersToday = Users.countUsersToday();

        $scope.numOfPosts = Posts.countPosts();
        $scope.numOfPostsToday = Posts.countPostsToday();

        $scope.selectedLogo = 'All';
        $scope.activeClass = 2;

        $scope.hottestsorted = true;
        $scope.newestsorted = false;

        $scope.brandLogo = '/modules/users/client/img/profile/all-logo.png';

        $scope.setUserImage = function () {
            $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
        };

        $scope.toggleClass = function (classNum) {

            if(classNum === 1){
                $scope.hottestsorted = true;
                $scope.newestsorted = false;
            }else if(classNum === 2){
                $scope.hottestsorted = false;
                $scope.newestsorted = true;
            }

        };

        $scope.setFilterText = function (name) {

            $scope.selectedLogo = name;

        };

        $scope.setLogo = function (name) {

            if(name === 'All'){
                $scope.brandLogo = name;
            }else if(name === 'Littlewoods'){
                $scope.brandLogo = '/modules/users/client/img/profile/littlewoods-logo.png';
            }else if(name === 'Argos'){
                $scope.brandLogo = '/modules/users/client/img/profile/argos-logo.png';
            }else if(name === 'Screwfix'){
                $scope.brandLogo = '/modules/users/client/img/profile/screwfix-logo.png';
            }else if(name === 'Amazon'){
                $scope.brandLogo = '/modules/users/client/img/profile/amazon-logo.png';
            }else if(name === 'Penneys'){
                $scope.brandLogo = '/modules/users/client/img/profile/penneys-logo.png';
            }else if(name === 'Tesco'){
                $scope.brandLogo = '/modules/users/client/img/profile/tesco-logo.png';
            }else if(name === 'Lidl'){
                $scope.brandLogo = '/modules/users/client/img/profile/lidl-logo.png';
            }else if(name === 'Aldi'){
                $scope.brandLogo = '/modules/users/client/img/profile/aldi-logo.png';
            }else {
                $scope.brandLogo = '/modules/users/client/img/profile/all-logo.png';
            }



        };

        $scope.openModal = function (name) {



        };


    }
]);

