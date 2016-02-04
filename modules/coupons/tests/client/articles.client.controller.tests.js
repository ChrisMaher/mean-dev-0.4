'use strict';

(function () {
  // Coupons Controller Spec
  describe('Coupons Controller Tests', function () {
    // Initialize global variables
    var CouponsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Coupons,
      mockArticle;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Coupons_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Coupons = _Coupons_;

      // create mock article
      mockArticle = new Coupons({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Coupons controller.
      CouponsController = $controller('CouponsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one article object fetched from XHR', inject(function (Coupons) {
      // Create a sample coupons array that includes the new article
      var sampleCoupons = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/coupons').respond(sampleCoupons);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.coupons).toEqualData(sampleCoupons);
    }));

    it('$scope.findOne() should create an array with one article object fetched from XHR using a articleId URL parameter', inject(function (Coupons) {
      // Set the URL parameter
      $stateParams.articleId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/coupons\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.article).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample article object
        sampleArticlePostData = new Coupons({
          title: 'An Article about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Article about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Coupons) {
        // Set POST response
        $httpBackend.expectPOST('api/coupons', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the article was created
        expect($location.path.calls.mostRecent().args[0]).toBe('coupons/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/coupons', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock article in scope
        scope.article = mockArticle;
      });

      it('should update a valid article', inject(function (Coupons) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/coupons\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/coupons/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Coupons) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/coupons\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(article)', function () {
      beforeEach(function () {
        // Create new coupons array and include the article
        scope.coupons = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/coupons\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid articleId and remove the article from the scope', inject(function (Coupons) {
        expect(scope.coupons.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.article = mockArticle;

        $httpBackend.expectDELETE(/api\/coupons\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to coupons', function () {
        expect($location.path).toHaveBeenCalledWith('coupons');
      });
    });
  });
}());
