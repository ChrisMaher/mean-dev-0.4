'use strict';

describe('Deals E2E Tests:', function () {
  describe('Test deals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/deals');
      expect(element.all(by.repeater('deal in deals')).count()).toEqual(0);
    });
  });
});
