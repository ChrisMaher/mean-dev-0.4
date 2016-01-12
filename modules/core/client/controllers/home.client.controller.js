'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Deals', 'Users',
  function ($scope, Authentication, Deals, Users) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.numOfDeals = Deals.countDeals();
    $scope.numOfDealsToday = Deals.countDealsToday();

      $scope.numOfUsers = Users.countUsers();
      $scope.numOfUsersToday = Users.countUsersToday();

      //$scope.numOfComments = Comments.countComments();
      //$scope.numOfCommentsToday = Comments.countCommentsToday();



    $scope.alerts = [

      {

        icon: 'glyphicon-euro',
        colour: 'btn-success',
        total: '12',
        description: 'New Deals in 24h'

      },

      {

        icon: 'glyphicon-euro',
        colour: 'btn-success',
        total: '20',
        description: 'Total Deals'

      },

      {

        icon: 'glyphicon-user',
        colour: 'btn-default',
        total: '56',
        description: 'New Members in 24h'

      },

      {

        icon: 'glyphicon-user',
        colour: 'btn-default',
        total: '958',
        description: 'Total Members'

      },

      {

        icon: 'glyphicon-comment',
        colour: 'btn-warning',
        total: '98',
        description: 'New Comments in 24h'

      },

      {

        icon: 'glyphicon-comment',
        colour: 'btn-warning',
        total: '1,254',
        description: 'Total Comments'

      },

    ];


  }
]);

// Deals controller
angular.module('core').controller('DealsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Deals',
  function ($scope, $stateParams, $location, Authentication, Deals) {
    $scope.authentication = Authentication;

    $scope.dealsCount = Deals.length();

    $scope.orderByField = 'votes';
    $scope.reverseSort = false;
    $scope.filterBy = '';

    // Create new Deal
    $scope.create = function () {
      // Create new Deal object
      var deal = new Deals({
        name: this.name
      });

      // Redirect after save
      deal.$save(function (response) {
        $location.path('deals/' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Deal
    $scope.remove = function (deal) {
      if (deal) {
        deal.$remove();

        for (var i in $scope.deals) {
          if ($scope.deals [i] === deal) {
            $scope.deals.splice(i, 1);
          }
        }
      } else {
        $scope.deal.$remove(function () {
          $location.path('deals');
        });
      }
    };

    // Update existing Deal
    $scope.update = function () {
      var deal = $scope.deal;

      deal.$update(function () {
        $location.path('deals/' + deal._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Deals
    $scope.find = function () {
      $scope.deals = Deals.query();
    };

    // Find existing Deal
    $scope.findOne = function () {
      $scope.deal = Deals.get({
        dealId: $stateParams.dealId
      });
    };

    // Fill Stats
    $scope.fillStats = function () {


      $scope.deal = Deals.get({
        dealId: $stateParams.dealId
      });


    };
  }
]);


