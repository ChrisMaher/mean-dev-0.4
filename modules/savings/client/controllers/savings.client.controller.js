'use strict';

// Deals controller
angular.module('savings').controller('SavingsController', ['$scope', '$timeout', '$stateParams', '$location', '$window', 'Authentication', 'Savings', 'FileUploader',
    function($scope, $timeout, $stateParams,  $location, $window, Authentication, Savings, FileUploader) {

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        $scope.savingImageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
        $scope.imageURL1 = '';
        $scope.hottestsorted = true;
        $scope.newestsorted = true;
        //$scope.user.imageURL = '';

        $scope.hottest = function() {

            alert(123);

            if($scope.hottestsorted === false){
                $scope.hottestsorted = true;
            }else{
                $scope.hottestsorted = false;
            }

        };

        // Create file uploader instance
        $scope.uploaderProductSaving = new FileUploader({
            url: 'api/savings/picture'
        });

        // Set file uploader image filter
        $scope.uploaderProductSaving.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Change user profile picture
        $scope.uploadProductPictureSaving = function () {

            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploaderProductSaving.uploadAll();


        };

        $scope.$watch('urlimage', function(newVal, oldVal){

            if(newVal !== undefined){
                $scope.savingImageURL = newVal;

            }else{
                $scope.savingImageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
            }

        });

        // Called after the user selected a new picture file
        $scope.uploaderProductSaving.onAfterAddingFile = function (fileItem) {

            if ($window.FileReader) {

                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        
                        $scope.savingImageURL = fileReaderEvent.target.result;

                    }, 0);
                };
            }

        };

        // Called after the user has successfully uploaded a new picture
        $scope.uploaderProductSaving.onSuccessItem = function (fileItem, response, status, headers) {

            // Show success message
            $scope.success = true;

            // Populate user object
            $scope.user = Authentication.user = response;

            //// Clear upload buttons
             $scope.cancelProductUploadSaving();

        };

        // Called after the user has failed to uploaded a new picture
        $scope.uploaderProductSaving.onErrorItem = function (fileItem, response, status, headers) {

            alert("Failed." + $scope.user.imageURL);

            // Clear upload buttons
            $scope.cancelProductUploadSaving();

            // Show error message
            $scope.error = response.message;
        };

        // Cancel the upload process
        $scope.cancelProductUploadSaving = function () {

            $scope.uploaderProductSaving.clearQueue();
            $scope.savingImageURL = $scope.user.imageURL;

        };

        // Create new Saving
        $scope.create = function () {
            $scope.error = null;

            //if (!isValid) {
            //    $scope.$broadcast('show-errors-check-validity', 'createSavingForm');
            //
            //    return false;
            //}

            // Create new Saving object
            var saving = new Savings({


                title: this.title,
                details: this.details,
                retailer: this.retailer,
                price: this.price,
                link: this.link,
                image: $scope.user.imageURL,
                urlimage: this.urlimage,
                tags: this.tags,
                upVoters : $scope.user


            });



            // Redirect after save
            saving.$save(function (response) {
                $location.path('savings/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.details = '';
                $scope.retailer = '';
                $scope.price = '';
                $scope.link = '';
                $scope.image = '';
                $scope.urlimage = '';
                $scope.tags = '';

                $scope.user.imageURL  = '/modules/users/client/img/profile/saveme-placeholder.png';


            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Saving
        $scope.remove = function (saving) {
            if (saving) {
                saving.$remove();

                for (var i in $scope.savings) {
                    if ($scope.savings[i] === saving) {
                        $scope.savings.splice(i, 1);
                    }
                }
            } else {
                $scope.saving.$remove(function () {
                    $location.path('savings');
                });
            }
        };

        // Update existing Saving
        $scope.update = function() {

            var saving = $scope.saving;

            alert($scope.saving);

            saving.$update(function() {
                $location.path('savings/' + saving._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        // Find a list of Savings
        $scope.find = function () {
            $scope.savings = Savings.query();
        };

        // Find existing Saving
        $scope.findOne = function () {
            $scope.saving = Savings.get({
                savingId: $stateParams.savingId
            });
        };

        // Upvote if user hasnt upvoted already

        $scope.upVoteHome = function(saving) {

            var hasVoted = saving.upVoters.filter(function (voter) {
                    return voter.ref === $scope.loggedInUser;
                }).length > 0;

            // If a downvote exists remove it , else do nothing

            if (!hasVoted) {

                saving.votes++;
                //alert(saving.votes);
                saving.upVoters.push($scope.user);

            }

            // Check if there is a downVote to remove

            var hasVoted3 = saving.downVoters.filter(function (voter) {
                    return voter.ref === $scope.loggedInUser;
                }).length > 0;

            if (hasVoted3) {

                for(var i = saving.downVoters.length - 1; i >= 0; i--) {

                    if(saving.downVoters[i] === $scope.user._id) {
                        saving.downVoters.splice(i, 1);
                    }
                }
            }

            saving.$update(function () {
                //$location.path('savings/' + saving._id);
            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.downVoteHome = function(saving) {


            var hasVoted = saving.downVoters.filter(function (voter) {
                    return voter.ref === $scope.loggedInUser;
                }).length > 0;

            // If a upvote exists remove it , else do nothing

            if (!hasVoted) {

                saving.votes--;
                saving.downVoters.push($scope.user);


            }

            // Check if there is a upVote to remove

            var hasVoted2 = saving.upVoters.filter(function (voter) {
                    return voter.ref === $scope.loggedInUser;
                }).length > 0;

            if (hasVoted2) {

                for(var i = saving.upVoters.length - 1; i >= 0; i--) {

                    if(saving.upVoters[i] === $scope.user._id) {
                        saving.upVoters.splice(i, 1);
                    }
                }
            }

            saving.$update(function () {
                //$location.path('savings/' + saving._id);
            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };

    }
]);
