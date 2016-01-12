'use strict';

// Configuring the Deals module
angular.module('deals').run(['Menus',
  function (Menus) {
    // Add the deals dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Deals',
      state: 'deals',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'deals', {
      title: 'List Deals',
      state: 'deals.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'deals', {
      title: 'Create Deals',
      state: 'deals.create',
      roles: ['user']
    });
  }
]);
