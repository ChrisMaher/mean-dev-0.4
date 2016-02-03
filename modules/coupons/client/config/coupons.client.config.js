'use strict';

// Configuring the Coupons module
angular.module('coupons').run(['Menus',
  function (Menus) {
    // Add the coupons dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Coupons',
      state: 'coupons',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'coupons', {
      title: 'List Coupons',
      state: 'coupons.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'coupons', {
      title: 'Create Coupons',
      state: 'coupons.create',
      roles: ['user']
    });
  }
]);
