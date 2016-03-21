'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$state', 'Authentication', 'Menus',
    function ($scope, $location, $state, Authentication, Menus) {


        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }

        };

        $scope.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);


        if ( isMobile.Android() ) {
            document.location.href = "https://play.google.com/store/apps/details?id=com.saveme.chris";
        }
        else if(isMobile.iOS())
        {
            document.location.href = "http://www.saveme.ie/apple";
        }
        else if(isMobile.BlackBerry())
        {
            document.location.href = "http://www.saveme.ie/android";
        }else if(isMobile.Windows())
        {
            document.location.href = "http://www.saveme.ie/windows";
        }


        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;

        if ($scope.authentication.user.passwordChanged === 'false') {

            if ($state !== 'settings.password') {

                $state.go('settings.password');

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
