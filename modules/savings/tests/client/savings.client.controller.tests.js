'use strict';

(function () {
  // Savings Controller Spec
  describe('Savings Controller Tests', function () {
    // Initialize global variables
    var SavingsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Savings,
      mockSaving;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Savings_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Savings = _Savings_;

      // create mock saving
      mockSaving = new Savings({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'Saving test',
        link: 'http://www.saveme.ie',
        details: 'testing ',
        retailer: 'argos',
        userIdString: '525a8422f6d0f87f0e407aaa',
        price: 99.99,
        currency: 'Euro (\u20ac)',
        urlimage: 'http://ecx.images-amazon.com/images/I/A1nSvsCX0IL._SY355_.jpg',
        image: 'http://ecx.images-amazon.com/images/I/A1nSvsCX0IL._SY355_.jpg',
        category: 'Electronics',
        startdate: 'NA',
        enddate: 'NA',
        votes : 99,
        votesreal: 97,
        reported: false,
        commentcount : 0,
        upVoters: 'chrismaher.wit@gmail.com',
        downVoters: 'tcvip1@gmail.com',
        votesTrim: '2/11/2016',
        created: '2016-02-22T21:51:38.336Z',
        user: '56ba5bd94e1f2d0e00ef19f9'

      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Savings controller.
      SavingsController = $controller('SavingsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one saving object fetched from XHR', inject(function (Savings) {
      // Create a sample savings array that includes the new saving
      var sampleSavings = [mockSaving];

      // Set GET response
      $httpBackend.expectGET('api/savings').respond(sampleSavings);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.savings).toEqualData(sampleSavings);
    }));

    it('$scope.findOne() should create an array with one saving object fetched from XHR using a savingId URL parameter', inject(function (Savings) {
      // Set the URL parameter
      $stateParams.savingId = mockSaving._id;

      // Set GET response
      $httpBackend.expectGET(/api\/savings\/([0-9a-fA-F]{24})$/).respond(mockSaving);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.saving).toEqualData(mockSaving);
    }));

    describe('$scope.create()', function () {
      var sampleSavingPostData;

      beforeEach(function () {
        // Create a sample saving object
        sampleSavingPostData = new Savings({
          title: 'Saving test',
          link: 'http://www.saveme.ie',
          details: 'testing ',
          retailer: 'argos',
          userIdString: '525a8422f6d0f87f0e407aaa',
          price: 99.99,
          currency: 'Euro (\u20ac)',
          urlimage: 'http://ecx.images-amazon.com/images/I/A1nSvsCX0IL._SY355_.jpg',
          image: 'http://ecx.images-amazon.com/images/I/A1nSvsCX0IL._SY355_.jpg',
          category: 'Electronics',
          startdate: 'NA',
          enddate: 'NA',
          votes : 99,
          votesreal: 97,
          reported: false,
          commentcount : 0,
          upVoters: 'chrismaher.wit@gmail.com',
          downVoters: 'tcvip1@gmail.com',
          votesTrim: '2/11/2016',
          created: '2016-02-22T21:51:38.336Z',
          user: '56ba5bd94e1f2d0e00ef19f9'
        });

        // Fixture mock form input values
        scope.title = 'Saving test';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Savings) {
        // Set POST response
        $httpBackend.expectPOST('api/savings', sampleSavingPostData).respond(mockSaving);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the saving was created
        expect($location.path.calls.mostRecent().args[0]).toBe('savings/' + mockSaving._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/savings', sampleSavingPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock saving in scope
        scope.saving = mockSaving;
      });

      it('should update a valid saving', inject(function (Savings) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/savings\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/savings/' + mockSaving._id);
      }));

      it('should set scope.error to error response message', inject(function (Savings) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/savings\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(saving)', function () {
      beforeEach(function () {
        // Create new savings array and include the saving
        scope.savings = [mockSaving, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/savings\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockSaving);
      });

      it('should send a DELETE request with a valid savingId and remove the saving from the scope', inject(function (Savings) {
        expect(scope.savings.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.saving = mockSaving;

        $httpBackend.expectDELETE(/api\/savings\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to savings', function () {
        expect($location.path).toHaveBeenCalledWith('savings');
      });
    });


  });
}());
