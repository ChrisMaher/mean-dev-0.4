'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$state', 'Authentication', 'Menus',
    function ($scope, $location, $state, Authentication, Menus) {
        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;

        // var pass = "NA92lYb1c30oDY81YxMX/TfL28sRodj/cT6U0xV2Ibm2hh6W3+jYuV18qdSL3Psgd1YY4xtUdO072fGXpugY5w==";

        if ($scope.authentication.user.passwordChanged === 'false') {

            if ($state !== $state.settings.password) {

                $state.go($state.settings.password);

            }

        }

        // Get the topbar menu
        $scope.menu = Menus.getMenu('topbar');

        // Toggle the menu items
        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });

        //be sure to inject $scope and $location
        $scope.changeLocation = function (url, forceReload) {
            $scope = $scope || angular.element(document).scope();
            if (forceReload || $scope.$$phase) {
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
    }
]);
