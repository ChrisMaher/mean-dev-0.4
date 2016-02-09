'use strict';

angular.module('users').controller('ViewProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$stateParams',
    function($scope, $http, $location, Users, Authentication, $stateParams) {
        $scope.user = Authentication.user;

        $scope.findUser = function () {

            $scope.ourUser = Users.get({
                username: $stateParams.username
            }).$promise.then( function(ourUser) {
                    var userPostsPromise = $http.get('api/savings/of/' + ourUser._id);
                    userPostsPromise.success(function(data) {
                        $scope.userSavings=data;
                        $scope.ourUser=ourUser;
                    });
                    userPostsPromise.error(function() {
                        alert('Something wrong!');
                    });
                }
            );
        };

    }
]);
