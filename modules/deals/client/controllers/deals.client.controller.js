'use strict';

// Deals controller
angular.module('deals').controller('DealsController', ['$scope', '$timeout', '$stateParams', '$location', '$window', 'Authentication', 'Deals', 'FileUploader',
    function($scope, $timeout, $stateParams,  $location, $window, Authentication, Deals, FileUploader) {

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        $scope.productImageURL = 'http://placehold.it/122x122?text=no+image';
        $scope.imageURL1 = '';

        // Create file uploader instance
        $scope.uploaderProduct = new FileUploader({
            url: 'api/deals/picture'
        });

        // Set file uploader image filter
        $scope.uploaderProduct.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Change user profile picture
        $scope.uploadProductPicture = function () {

            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploaderProduct.uploadAll();



        };

        // upVoteDeal
        $scope.upVote = function (id) {

            alert(id);
            $scope.deal.votes = $scope.deal.votes+1;

            var deal = $scope.deal;

            deal.$update(function() {
                $location.path('deals/' + deal._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });


        };


        // downVoteDeal
        $scope.downVote = function (id) {

            //alert(id);
            $scope.deal.votes = $scope.deal.votes-1;

            var deal = $scope.deal;

            deal.$update(function() {
                $location.path('deals/' + deal._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });


        };

        $scope.$watch('dealsCTRL.urlimage', function(newVal, oldVal){
            console.log("Search was changed to:"+newVal);

            if(newVal !== undefined){
                $scope.productImageURL = newVal;


            }else{
                $scope.productImageURL = 'http://placehold.it/122x122?text=no+image';
            }

            //if(newVal.toString().length < 0){
            //    $scope.productImageURL = newVal;
            //}else{
            //    $scope.productImageURL = 'http://placehold.it/122x122?text=no+image';
            //}

        });

        // Called after the user selected a new picture file
        $scope.uploaderProduct.onAfterAddingFile = function (fileItem) {

            if ($window.FileReader) {

                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        $scope.productImageURL = fileReaderEvent.target.result;

                    }, 0);
                };
            }

        };

        // Called after the user has successfully uploaded a new picture
        $scope.uploaderProduct.onSuccessItem = function (fileItem, response, status, headers) {

            // Show success message
            $scope.success = true;

            // Populate user object
            $scope.user = Authentication.user = response;

            //// Clear upload buttons
            $scope.cancelProductUpload();





        };

        // Called after the user has failed to uploaded a new picture
        $scope.uploaderProduct.onErrorItem = function (fileItem, response, status, headers) {
            // Clear upload buttons
            $scope.cancelProductUpload();

            // Show error message
            $scope.error = response.message;
        };


        // Cancel the upload process
        $scope.cancelProductUpload = function () {

            $scope.uploaderProduct.clearQueue();
            $scope.productImageURL = $scope.user.imageURL;

        };


        // Create new Deal
        this.create = function () {

            // Upload photo and grab URL location.


            // Create new Deal object

            var deal = new Deals({

                title: this.title,
                details: this.details,
                retailer: this.retailer,
                price: this.price,
                link: this.link,
                image: $scope.user.imageURL,
                urlimage: this.urlimage,
                tags: this.tags,
                startdate: this.startdate,
                enddate: this.enddate


            });


            // Redirect after save
            deal.$save(function (response) {

                $location.path('deals/' + response._id);


                // Clear form fields
                $scope.title = '';
                $scope.details = '';
                $scope.retailer = '';
                $scope.price = '';
                $scope.link = '';
                $scope.image = '';
                $scope.urlimage = '';
                $scope.tags = '';
                $scope.startdate = '';
                $scope.enddate = '';


            });
        };

        // Remove existing Deal
        $scope.remove = function(deal) {
            if ( deal ) {
                deal.$remove();

                for (var i in $scope.deals) {
                    if ($scope.deals [i] === deal) {
                        $scope.deals.splice(i, 1);
                    }
                }
            } else {
                $scope.deal.$remove(function() {
                    $location.path('deals');
                });
            }
        };

        // Update existing Deal
        $scope.update = function() {

            var deal = $scope.deal;

            deal.$update(function() {
                $location.path('deals/' + deal._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        // Find a list of Deals
        $scope.find = function() {
            $scope.deals = Deals.query();

        };

        $scope.sort = function(keyname){
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        };

        // Find existing Deal
        $scope.findOne = function() {
            $scope.deal = Deals.get({
                dealId: $stateParams.dealId
            });
        };









    }
]);



