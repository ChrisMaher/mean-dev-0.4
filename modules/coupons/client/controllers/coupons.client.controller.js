'use strict';

// Deals controller
angular.module('coupons').controller('CouponsController', ['$scope', '$timeout', '$stateParams', '$location', '$window', 'Authentication', 'Coupons', 'FileUploader', 'Posts',
    function ($scope, $timeout, $stateParams, $location, $window, Authentication, Coupons, FileUploader, Posts) {

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        //$scope.orderByField = 'votesreal';
        $scope.couponImageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
        // $scope.user.imageURL  = '/modules/users/client/img/profile/saveme-placeholder.png';
        $scope.imageURL1 = '';


        $scope.hottestsorted = true;
        $scope.newestsorted = true;

        $scope.hottestsortedCoupon = true;
        $scope.newestsortedCoupon = false;

        $scope.weekly = true;
        $scope.monthly = false;
        $scope.disablelist = true;
        $scope.currency = "Euro (€)";
        $scope.brandLogo = '/modules/users/client/img/profile/argos-logo.png';
        Coupons.query({}, function (resp) {
            $scope.coupons = resp;
        });

        //$scope.user.imageURL = '';
        $scope.submitFormCoupon = function (isValid) {
            $scope.submitted = true;
        };


        $scope.hottest = function () {



            if ($scope.hottestsorted === false) {
                $scope.hottestsorted = true;
            } else {
                $scope.hottestsorted = false;
            }

        };

        $scope.setSort = function (sort) {

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

        $scope.toggleTop = function () {

            alert("Top");

            if ($scope.top6 === false) {
                $scope.top6 = true;
            } else {
                $scope.top6 = false;
            }

        };

        $scope.setUserImage = function () {

            $scope.user.imageURL = '/modules/users/client/img/profile/saveme-placeholder.png';


        };

        // Create file uploader instance
        $scope.uploaderProductCoupon = new FileUploader({
            url: 'api/coupons/picture'
        });

        // Set file uploader image filter
        $scope.uploaderProductCoupon.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Change product profile picture
        $scope.uploadProductPictureCoupon = function () {

            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploaderProductCoupon.uploadAll();


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

        $scope.$watch('urlimage', function (newVal, oldVal) {

            if (newVal !== undefined) {
                $scope.couponImageURL = newVal;

            } else {
                $scope.couponImageURL = '/modules/users/client/img/profile/saveme-placeholder.png';
            }

        });

        $scope.$watch('pricesterling', function (newVal, oldVal) {

            if (newVal !== undefined) {
                $scope.price = (newVal / 70) * 100;

            }

        });


        // Called after the user selected a new picture file
        $scope.uploaderProductCoupon.onAfterAddingFile = function (fileItem) {

            if ($window.FileReader) {

                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {

                        $scope.couponImageURL = fileReaderEvent.target.result;

                    }, 0);
                };
            }

        };

        // Called after the user has successfully uploaded a new picture
        $scope.uploaderProductCoupon.onSuccessItem = function (fileItem, response, status, headers) {

            // Show success message
            $scope.success = true;

            // Populate user object
            $scope.user = Authentication.user = response;

            //// Clear upload buttons
            $scope.cancelProductUploadCoupon();

        };

        // Called after the user has failed to uploaded a new picture
        $scope.uploaderProductCoupon.onErrorItem = function (fileItem, response, status, headers) {

            alert("Failed." + $scope.user.imageURL);

            // Clear upload buttons
            $scope.cancelProductUploadCoupon();

            // Show error message
            $scope.error = response.message;
        };

        // Cancel the upload process
        $scope.cancelProductUploadCoupon = function () {

            $scope.uploaderProductCoupon.clearQueue();
            $scope.couponImageURL = $scope.user.imageURL;

        };

        // Create new Coupon
        $scope.create = function () {
            $scope.error = null;

            var priceRounded = Math.round(this.discount * 100) / 100;
            var priceRoundedPercentage = Math.round(this.discountpercent * 100) / 100;
            var priceRoundedMinimum = Math.round(this.minimumspend * 100) / 100;


            // Create new Coupon object
            var coupon = new Coupons({

                title: this.title,
                link: this.link,
                retailer: this.retailer,
                code: this.code,
                currency: this.currency,
                userIdStringCoupon: $scope.authentication.user._id,
                minimumspend: priceRoundedMinimum,
                discount: priceRounded,
                discountpercent: priceRoundedPercentage,
                category: this.category,
                instructions: this.instructions,
                validfrom: this.validfrom,
                validto: this.validto,
                upVoters: $scope.user

            });

            // Redirect after save
            coupon.$save(function (response) {

                $location.path('coupons');

                $scope.title = '';
                $scope.link = '';
                $scope.retailer = '';
                $scope.currency = '';
                $scope.minimumspend = '';
                $scope.discount = '';
                $scope.category = '';
                $scope.instructions = '';
                $scope.validfrom = '';
                $scope.validto = '';


            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Coupon
        $scope.remove = function (coupon) {

            var result = confirm("Are you sure you want to delete?");
            if (result) {

                // Delete the item

                if (coupon) {
                    coupon.$remove();

                    for (var i in $scope.coupons) {
                        if ($scope.coupons[i] === coupon) {
                            $scope.coupons.splice(i, 1);
                        }
                    }
                } else {
                    $scope.coupon.$remove(function () {
                        $location.path('coupons');
                    });
                }
            }

        };

        // Update existing Coupon
        $scope.updateCoupon = function () {

            var coupon = $scope.coupon;

            //alert($scope.coupon.currency);

            if ($scope.coupon.currency === 'Sterling (£)') {

                $scope.coupon.discount = Math.round((($scope.coupon.discount / 70) * 100) * 100) / 100;
                $scope.coupon.currency = 'Euro (€)';

            }

            $scope.coupon.discount = Math.round($scope.coupon.discount * 100) / 100;
            $scope.coupon.discountpercent = Math.round($scope.coupon.discountpercent * 100) / 100;
            $scope.coupon.minimumspend = Math.round($scope.coupon.minimumspend * 100) / 100;

            //alert($scope.coupon);

            coupon.$update(function () {
                $location.path('coupons/' + coupon._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        // Find a list of Coupons
        $scope.find = function () {
            $scope.coupons = Coupons.query();
        };

        // Find existing Coupon
        $scope.findOne = function () {
            $scope.coupon = Coupons.get({
                couponId: $stateParams.couponId
            });
        };

        // Upvote if user hasnt upvoted already

        $scope.upVoteHome = function (coupon) {


            var hasVoted = coupon.upVoters.filter(function (voter) {

                    return voter === $scope.user._id;

                }).length > 0;

            // If a downvote exists remove it , else do nothing

            if (!hasVoted) {

                coupon.votes++;
                coupon.votesreal++;
                //alert(coupon.votes);
                coupon.upVoters.push($scope.user);

            }

            // Check if there is a downVote to remove


            var hasVoted3 = coupon.downVoters.filter(function (voter) {

                    return voter === $scope.user._id;

                }).length > 0;

            if (hasVoted3) {

                for (var i = coupon.downVoters.length - 1; i >= 0; i--) {

                    if (coupon.downVoters[i] === $scope.user._id) {
                        coupon.downVoters.splice(i, 1);
                    }
                }
            }

            coupon.$update(function () {
                //$location.path('coupons/' + coupon._id);
            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.downVoteHome = function (coupon) {

            var hasVoted = coupon.downVoters.filter(function (voter) {

                    return voter === $scope.user._id;

                }).length > 0;

            // If a upvote exists remove it , else do nothing

            if (!hasVoted) {

                coupon.votes--;
                coupon.votesreal--;
                coupon.downVoters.push($scope.user);


            }

            // Check if there is a upVote to remove


            var hasVoted2 = coupon.upVoters.filter(function (voter) {

                    return voter === $scope.user._id;

                }).length > 0;

            if (hasVoted2) {

                for (var i = coupon.upVoters.length - 1; i >= 0; i--) {

                    if (coupon.upVoters[i] === $scope.user._id) {
                        coupon.upVoters.splice(i, 1);
                    }
                }
            }

            coupon.$update(function () {
                //$location.path('coupons/' + coupon._id);
            }, function (errorResponse) {
                // rollback votes on fail also
                $scope.error = errorResponse.data.message;
            });

        };


    }
]);

angular.module('coupons').filter('lessThan', function () {
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
