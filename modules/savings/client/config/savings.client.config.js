'use strict';

// Configuring the Savings module
angular.module('savings').run(['Menus',
  function (Menus) {
    // Add the savings dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Savings',
      state: 'savings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'savings', {
      title: 'List Savings',
      state: 'savings.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'savings', {
      title: 'Create Savings',
      state: 'savings.create',
      roles: ['user']
    });
  }
]);
