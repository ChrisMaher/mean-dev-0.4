'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Saving = mongoose.model('Saving');

/**
 * Globals
 */
var user, saving;

/**
 * Unit tests
 */
describe('Saving Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      gender: 'M',
      county: 'Waterford',
      aboutme: 'About Me',
      profileImageURL: 'http://ecx.images-amazon.com/images/I/A1nSvsCX0IL._SY355_.jpg',
      ImageURL: 'http://ecx.images-amazon.com/images/I/A1nSvsCX0IL._SY355_.jpg',
      provider: 'Facebook'

    });

    user.save(function () {
      saving = new Saving({
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
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return saving.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      saving.title = '';

      return saving.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Saving.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
