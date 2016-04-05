'use strict';

// Savings controller
angular.module('savings').controller('SavingsController', ['$scope', '$http', '$timeout', '$stateParams', '$location', '$window', '$state', 'Authentication', 'Savings', 'FileUploader', 'Posts', 'Users',
    function ($scope, $http, $timeout, $stateParams, $location, $window, $state, Authentication, Savings, FileUploader, Posts, Users) {



        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        if ($scope.authentication.user.passwordChanged === 'false') {

            if ($state !== 'settings.password') {

                $state.go('settings.password');

            }

        }
        //$scope.orderByField = 'votesreal';
        $scope.savingImageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
        // $scope.user.imageURL  = '/modules/users/client/img/profile/saveme-placeholder.png';
        $scope.imageURL1 = '';
        $scope.hottestsorted = true;
        $scope.newestsorted = true;
        $scope.weekly = false;
        $scope.monthly = true;
        $scope.disablelist = true;
        $scope.usernamevalue = $stateParams.userId;
        $scope.currency = "Euro (€)";
        $scope.filterUserId = '';
        $scope.brandLogo = '/modules/users/client/img/profile/argos-logo.png';
        $scope.isDisabledUp = false;
        $scope.isDisabledDown = false;
        $scope.yesterdaysDate = new Date();
        $scope.yesterdaysDate.setDate($scope.yesterdaysDate.getDate() - 1);
        $scope.yesterdaysDate = $scope.yesterdaysDate.getMonth() + 1 + '/' + $scope.yesterdaysDate.getDate() + '/' + $scope.yesterdaysDate.getFullYear() + "";
        $scope.searchTab = false;
        $scope.searchValue = "";
        $scope.spotlightDeal = true;


        $scope.savingUrl1 = function (id) {


            $scope.savingLink = 'http://saveme.ie/savings/' + id;

            if(id !== undefined){

                return $scope.savingLink;

            }else{

                return "http://saveme.ie";

            }
            
        };

        Savings.query({}, function (resp) {
            //console.log(resp);
            $scope.savings = resp;
        });

        //$scope.user.imageURL = '';
        $scope.submitFormSaving = function (isValid) {
            $scope.submitted = true;
        };

        $scope.hottest = function () {

            //alert(123);

            if ($scope.hottestsorted === false) {
                $scope.hottestsorted = true;
            } else {
                $scope.hottestsorted = false;
            }

        };

        $scope.setSort = function (sort) {

            //alert(sort);

            $scope.orderByField = sort;

        };

        $scope.timeFrame = function (classNum) {

            if (classNum === 1) {
                $scope.weekly = true;
                $scope.monthly = false;
            } else if (classNum === 2) {
                $scope.weekly = false;
                $scope.monthly = true;
            }

        };

        $scope.toggleSearch = function(){

            if($scope.searchTab === true){
                $scope.searchTab = false;
            }else if($scope.searchTab === false){
                $scope.searchTab = true;
            }

        };


        $scope.toggleSpotlightDeal = function(){

            if($scope.spotlightDeal === true){
                $scope.spotlightDeal = false;
            }else if($scope.spotlightDeal === false){
                $scope.spotlightDeal = true;
            }

        };

        $scope.toggleTop = function () {

            //alert("Top");

            if ($scope.top6 === false) {
                $scope.top6 = true;
            } else {
                $scope.top6 = false;
            }

        };

        $scope.setUserImage = function () {

            if($scope.user !== undefined){

                $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';

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

        // Change product profile picture
        $scope.uploadProductPictureSaving = function () {

            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploaderProductSaving.uploadAll();


        };

        $scope.$watch('urlimage', function (newVal, oldVal) {

            if (newVal !== undefined) {
                $scope.savingImageURL = newVal;

            } else {
                $scope.savingImageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
            }

        });

        $scope.$watch('pricesterling', function (newVal, oldVal) {

            if (newVal !== undefined) {
                $scope.price = (newVal / 70) * 100;

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

            //alert("Failed." + $scope.user.imageURL);

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

            var image = '/modules/users/client/img/profile/saveme-placeholder.png';
            if ($scope.user.imageURL === '/modules/users/client/img/profile/saveme-placeholder.png') {
                //alert("equal")
                image = $scope.savingImageURL;
            } else {
                //alert("not equal")
                image = $scope.user.imageURL;
                //alert("image " + image)
            }


            if (this.currency === 'Sterling (£)') {

                this.price = Math.round(((this.price / 70) * 100) * 100) / 100;
                this.currency = 'Euro (€)';

            }

            var priceRounded = Math.round(this.price * 100) / 100;

            // Create new Saving object
            var saving = new Savings({

                title: this.title,
                details: this.details,
                retailer: this.retailer,
                price: priceRounded,
                link: this.link,
                currency: this.currency,
                userIdString: $scope.authentication.user._id,
                image: image,
                urlimage: image,
                category: this.category,
                upVoters: $scope.user.email

            });

            // Redirect after save
            saving.$save(function (response) {

                //alert("1 " + $scope.user.imageURL);
                $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
                //alert("2 " + $scope.user.imageURL);
                $location.path('savings/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.details = '';
                $scope.retailer = '';
                $scope.price = '';
                $scope.link = '';
                $scope.image = '';
                $scope.urlimage = '';
                $scope.category = '';
                $scope.currency = '';


            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Saving
        $scope.removeSaving = function (saving) {

            var result = confirm("Are you sure you want to delete?");
            if (result) {

                // Delete the item

                if (saving) {
                    saving.$remove();

                    for (var i in $scope.savings) {
                        if ($scope.savings[i] === saving) {
                            $scope.savings.splice(i, 1);
                        }
                    }
                } else {
                    $scope.saving.$remove(function () {
                        $location.path('/');
                    });
                }
            }

        };

        // Update existing Saving
        $scope.updateSaving = function () {

            var saving = $scope.saving;

            //alert($scope.saving.currency);

            //if($scope.saving.currency === 'Sterling (£)'){
            //
            //    $scope.saving.price = Math.round((($scope.saving.price/70)*100) * 100) / 100 ;
            //    $scope.saving.currency = 'Euro (&euro;)';
            //    alert($scope.saving.currency);
            //
            //}

            if ($scope.saving.currency === 'Sterling (£)') {

                $scope.saving.price = Math.round((($scope.saving.price / 70) * 100) * 100) / 100;
                $scope.saving.currency = 'Euro (€)';


            }


            //alert($scope.saving.currency);

            saving.$update(function () {
                $location.path('savings/' + saving._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        // Find a list of Savings
        $scope.find = function () {
            $scope.savings = Savings.query();
        };

        // Find a list of Savings
        $scope.findAll = function () {
            $scope.savings1 = Savings.query();
        };

        // Find existing Saving
        $scope.findOne = function () {
            $scope.saving = Savings.get({
                savingId: $stateParams.savingId
            });
        };

        // Upvote if user hasnt upvoted already

        $scope.upVoteHome = function (saving) {

            // check if yesterdays votes have been removed, if not remove 10% of votes
            // Filter out votesTrim for yesterdays date

            var wasRemoved = saving.votesTrim.filter(function (voter) {

                    return voter === $scope.yesterdaysDate;

                }).length > 0;

            // console.log(wasRemoved);

            if(!wasRemoved){

                if(saving.votesreal > 100){

                    saving.votesreal = saving.votesreal - (saving.votesreal / 10);
                    saving.votesTrim.push($scope.yesterdaysDate);
                    // console.log("removed votes");

                }else{
                    saving.votesreal = 100;
                    saving.votesTrim.push($scope.yesterdaysDate);
                    // console.log("changed to 100");
                }


            }


            // Check if they have voted with filter
            var hasVoted = saving.upVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            // If a downvote exists remove it , else do nothing

            if (!hasVoted) {

                saving.votes++;
                saving.votesreal++;
                saving.upVoters.push($scope.user.email);

            }

            // Check if there is a downVote to remove


            var hasVoted3 = saving.downVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            if (hasVoted3) {

                for (var i = saving.downVoters.length - 1; i >= 0; i--) {

                    if (saving.downVoters[i] === $scope.user.email) {
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

        $scope.downVoteHome = function (saving) {

            var wasRemoved = saving.votesTrim.filter(function (voter) {

                    return voter === $scope.yesterdaysDate;

                }).length > 0;

            // console.log(wasRemoved);

            if(!wasRemoved){

                if(saving.votesreal > 100){

                    saving.votesreal = saving.votesreal - (saving.votesreal / 10);
                    saving.votesTrim.push($scope.yesterdaysDate);
                    // console.log("removed votes");

                }else{
                    saving.votesreal = 100;
                    saving.votesTrim.push($scope.yesterdaysDate);
                    // console.log("changed to 100");
                }


            }

            var hasVoted = saving.downVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            // If a upvote exists remove it , else do nothing

            if (!hasVoted) {

                saving.votes--;
                saving.votesreal--;
                saving.downVoters.push($scope.user.email);


            }

            // Check if there is a upVote to remove


            var hasVoted2 = saving.upVoters.filter(function (voter) {

                    return voter === $scope.user.email;

                }).length > 0;

            if (hasVoted2) {


                for (var i = saving.upVoters.length - 1; i >= 0; i--) {

                    if (saving.upVoters[i] === $scope.user.email) {
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

        $scope.disableButtonUp = function (saving) {

            if(saving.upVoters !== undefined){

                var hasVotedUp = saving.upVoters.filter(function (voter) {

                        return voter === $scope.user.email;

                    }).length > 0;

                if (hasVotedUp) {
                    return true;

                } else {
                    return false;
                }


            }



        };

        $scope.disableButtonDown = function (saving) {

            if(saving.downVoters !== undefined){

                var hasVotedUp = saving.downVoters.filter(function (voter) {

                        return voter === $scope.user.email;

                    }).length > 0;

                if (hasVotedUp) {
                    return true;

                } else {
                    return false;
                }


            }



        };

        $scope.reportSaving = function(saving){


            if (confirm("Would you like to report this Saving?")){

                saving.reported = true;
                $scope.updateSaving();
                alert("Thank you. Saving has been reported.");

            }

        };

        $scope.removeReport = function(saving){


            if (confirm("Remove Report?")){

                saving.reported = false;
                $scope.updateSaving();
                alert("Removed.");

            }

        };
        

    }
]);

angular.module('savings').filter('lessThan', function () {
    return function (items, requirement) {
        var filterKey = Object.keys(requirement)[0];
        var filterVal = requirement[filterKey];

        var filtered = [];

        if (filterVal !== undefined && filterVal !== '') {
            angular.forEach(items, function (item) {
                var today = new Date();
                var date = new Date(item.created);
                var diff = today - date;
                diff = diff / (1000 * 60 * 60);

                if (diff < filterVal) {
                    filtered.push(item);
                }
            });
            return filtered;
        }

        return items;
    };
});
