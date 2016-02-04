'use strict';

describe('Coupons E2E Tests:', function () {
  describe('Test coupons page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/coupons');
      expect(element.all(by.repeater('article in coupons')).count()).toEqual(0);
    });
  });
});
