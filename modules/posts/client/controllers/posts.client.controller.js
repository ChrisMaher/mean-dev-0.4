'use strict';

// Comments controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Posts',
    function($scope, $stateParams, $location, Authentication, Posts) {
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        $scope.numOfPosts = Posts.countPosts();
        $scope.numOfPostsToday = Posts.countPostsToday();

        // Create new Comment
        $scope.create = function() {
            // Create new Comment object

            var post = new Posts ({


                details: this.details,
                status: this.status,
                created: this.created,
                dealId: $scope.deal._id


            });


            // Redirect after save
            post.$save(function(response) {

                // Clear form fields
                $scope.name = '';
                $scope.details = '';

                $scope.$apply();



            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Comment
        $scope.remove = function(post) {
            if ( post ) {
                post.$remove();

                for (var i in $scope.posts) {
                    if ($scope.posts [i] === post) {
                        $scope.posts.splice(i, 1);
                    }
                }
            } else {
                $scope.post.$remove(function() {
                    $location.path('posts');
                });
            }
        };

        // Update existing Comment
        $scope.update = function() {
            var post = $scope.post;

            post.$update(function() {
                $location.path('posts/' + post._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Comments
        $scope.find = function() {

            $scope.posts = Posts.query();

        };

        // Find existing Comment
        $scope.findOne = function() {
            $scope.post = Posts.get({
                postId: $stateParams.postId
            });
        };
    }
]);
