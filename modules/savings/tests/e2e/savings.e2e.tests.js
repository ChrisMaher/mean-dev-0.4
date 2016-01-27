'use strict';

describe('Savings E2E Tests:', function () {
  describe('Test savings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/savings');
      expect(element.all(by.repeater('saving in savings')).count()).toEqual(0);
    });
  });
});
