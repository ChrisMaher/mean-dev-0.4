'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Coupon = mongoose.model('Coupon'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, coupon;

/**
 * Coupon routes tests
 */
describe('Coupon CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new coupon
    user.save(function () {
      coupon = {
        title: 'Coupon Title',
        content: 'Coupon Content'
      };

      done();
    });
  });

  it('should be able to save an coupon if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(200)
          .end(function (couponSaveErr, couponSaveRes) {
            // Handle coupon save error
            if (couponSaveErr) {
              return done(couponSaveErr);
            }

            // Get a list of coupons
            agent.get('/api/coupons')
              .end(function (couponsGetErr, couponsGetRes) {
                // Handle coupon save error
                if (couponsGetErr) {
                  return done(couponsGetErr);
                }

                // Get coupons list
                var coupons = couponsGetRes.body;

                // Set assertions
                (coupons[0].user._id).should.equal(userId);
                (coupons[0].title).should.match('Coupon Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an coupon if not logged in', function (done) {
    agent.post('/api/coupons')
      .send(coupon)
      .expect(403)
      .end(function (couponSaveErr, couponSaveRes) {
        // Call the assertion callback
        done(couponSaveErr);
      });
  });

  it('should not be able to save an coupon if no title is provided', function (done) {
    // Invalidate title field
    coupon.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(400)
          .end(function (couponSaveErr, couponSaveRes) {
            // Set message assertion
            (couponSaveRes.body.message).should.match('Title cannot be blank');

            // Handle coupon save error
            done(couponSaveErr);
          });
      });
  });

  it('should be able to update an coupon if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(200)
          .end(function (couponSaveErr, couponSaveRes) {
            // Handle coupon save error
            if (couponSaveErr) {
              return done(couponSaveErr);
            }

            // Update coupon title
            coupon.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing coupon
            agent.put('/api/coupons/' + couponSaveRes.body._id)
              .send(coupon)
              .expect(200)
              .end(function (couponUpdateErr, couponUpdateRes) {
                // Handle coupon update error
                if (couponUpdateErr) {
                  return done(couponUpdateErr);
                }

                // Set assertions
                (couponUpdateRes.body._id).should.equal(couponSaveRes.body._id);
                (couponUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of coupons if not signed in', function (done) {
    // Create new coupon model instance
    var couponObj = new Coupon(coupon);

    // Save the coupon
    couponObj.save(function () {
      // Request coupons
      request(app).get('/api/coupons')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single coupon if not signed in', function (done) {
    // Create new coupon model instance
    var couponObj = new Coupon(coupon);

    // Save the coupon
    couponObj.save(function () {
      request(app).get('/api/coupons/' + couponObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', coupon.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single coupon with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/coupons/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Coupon is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single coupon which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent coupon
    request(app).get('/api/coupons/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No coupon with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an coupon if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(200)
          .end(function (couponSaveErr, couponSaveRes) {
            // Handle coupon save error
            if (couponSaveErr) {
              return done(couponSaveErr);
            }

            // Delete an existing coupon
            agent.delete('/api/coupons/' + couponSaveRes.body._id)
              .send(coupon)
              .expect(200)
              .end(function (couponDeleteErr, couponDeleteRes) {
                // Handle coupon error error
                if (couponDeleteErr) {
                  return done(couponDeleteErr);
                }

                // Set assertions
                (couponDeleteRes.body._id).should.equal(couponSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an coupon if not signed in', function (done) {
    // Set coupon user
    coupon.user = user;

    // Create new coupon model instance
    var couponObj = new Coupon(coupon);

    // Save the coupon
    couponObj.save(function () {
      // Try deleting coupon
      request(app).delete('/api/coupons/' + couponObj._id)
        .expect(403)
        .end(function (couponDeleteErr, couponDeleteRes) {
          // Set message assertion
          (couponDeleteRes.body.message).should.match('User is not authorized');

          // Handle coupon error error
          done(couponDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Coupon.remove().exec(done);
    });
  });
});
