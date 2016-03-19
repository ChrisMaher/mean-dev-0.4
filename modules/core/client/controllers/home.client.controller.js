'use strict';


angular.module('core').controller('HomeController', ['$state','$scope', '$location', 'Authentication', 'Savings', 'Users', 'Posts', 'Coupons',
    function ($state, $scope, $location, Authentication, Savings, Users, Posts, Coupons) {

        

        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        if ($scope.authentication.user.passwordChanged === 'false') {

            if ($state !== 'settings.password') {

                $state.go('settings.password');

            }

        }

        $scope.orderByField = 'votesreal';
        $scope.orderByFieldCoupon = 'votes';

        $scope.numOfSavings = Savings.countSavings();
        $scope.numOfSavingsToday = Savings.countSavingsToday();

        $scope.numOfUsers = Users.countUsers();
        $scope.numOfUsersToday = Users.countUsersToday();

        $scope.numOfPosts = Posts.countPosts();
        $scope.numOfPostsToday = Posts.countPostsToday();

        $scope.numOfCoupons = Coupons.countCoupons();
        $scope.numOfCouponsToday = Coupons.countCouponsToday();

        $scope.selectedLogo = 'All';
        $scope.activeClass = 2;

        $scope.hottestsorted = true;
        $scope.newestsorted = false;

        $scope.hottestsortedCoupon = true;
        $scope.newestsortedCoupon = false;
        $scope.reportedPosts = false;
        

        // $scope.loggedIn1Id = "";
        // $scope.loggedIn1Image = "https://lh5.googleusercontent.com/-ZW7RHRV2zWs/AAAAAAAAAAI/AAAAAAAAJV4/F8AVmhWQ4n4/photo.jpg?sz=120";
        // $scope.loggedIn1User = "Chris Maher";
        //
        // $scope.loggedIn2Id = "";
        // $scope.loggedIn2Image = "https://lh5.googleusercontent.com/-ZW7RHRV2zWs/AAAAAAAAAAI/AAAAAAAAJV4/F8AVmhWQ4n4/photo.jpg?sz=120";
        // $scope.loggedIn2User = "Chris Maher";
        //
        // $scope.loggedIn3Id = "";
        // $scope.loggedIn3Image = "https://lh5.googleusercontent.com/-ZW7RHRV2zWs/AAAAAAAAAAI/AAAAAAAAJV4/F8AVmhWQ4n4/photo.jpg?sz=120";
        // $scope.loggedIn3User = "Chris Maher";
        //
        // $scope.loggedIn4Id = "";
        // $scope.loggedIn4Image = "https://lh5.googleusercontent.com/-ZW7RHRV2zWs/AAAAAAAAAAI/AAAAAAAAJV4/F8AVmhWQ4n4/photo.jpg?sz=120";
        // $scope.loggedIn4User = "Chris Maher";
        //
        // $scope.loggedIn5Id = "";
        // $scope.loggedIn5Image = "https://lh5.googleusercontent.com/-ZW7RHRV2zWs/AAAAAAAAAAI/AAAAAAAAJV4/F8AVmhWQ4n4/photo.jpg?sz=120";
        // $scope.loggedIn5User = "Chris Maher";



        $scope.top6 = true;

        $scope.brandLogo = '/modules/users/client/img/profile/all-logo.png';

        $scope.setUserImage = function () {
            $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
        };

        $scope.toggleClass = function (classNum) {

            if(classNum === 1){
                $scope.hottestsorted = true;
                $scope.newestsorted = false;
                $scope.orderByField = 'votesreal';
            }else if(classNum === 2){
                $scope.hottestsorted = false;
                $scope.newestsorted = true;
                $scope.orderByField = 'created';
            }else if(classNum === 3){
                $scope.reportedPosts = true;
            }

        };

        $scope.toggleReported = function(){
            
            if($scope.reportedPosts === true){
                $scope.reportedPosts = false;
            }else if($scope.reportedPosts === false){
                $scope.reportedPosts = true;
            }

        };

        

        //be sure to inject $scope and $location
        $scope.changeLocation = function(url, forceReload) {
            $scope = $scope || angular.element(document).scope();
            if(forceReload || $scope.$$phase) {
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

        $scope.toggleClassCoupon = function (classNum) {


            if(classNum === 1){
                $scope.hottestsortedCoupon = true;
                $scope.newestsortedCoupon = false;
                $scope.orderByFieldCoupon = 'votes';

            }else if(classNum === 2){
                $scope.hottestsortedCoupon = false;
                $scope.newestsortedCoupon = true;
                $scope.orderByFieldCoupon = 'created';

            }

        };

        $scope.toggleTop = function () {

            if($scope.top6 === false){
                $scope.top6 = true;
            }else{
                $scope.top6 = false;
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

