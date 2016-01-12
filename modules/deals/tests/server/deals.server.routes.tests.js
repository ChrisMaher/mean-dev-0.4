'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Deal = mongoose.model('Deal'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, deal;

/**
 * Deal routes tests
 */
describe('Deal CRUD tests', function () {
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

    // Save a user to the test db and create new deal
    user.save(function () {
      deal = {
        title: 'Deal Title',
        content: 'Deal Content'
      };

      done();
    });
  });

  it('should be able to save an deal if logged in', function (done) {
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

        // Save a new deal
        agent.post('/api/deals')
          .send(deal)
          .expect(200)
          .end(function (dealSaveErr, dealSaveRes) {
            // Handle deal save error
            if (dealSaveErr) {
              return done(dealSaveErr);
            }

            // Get a list of deals
            agent.get('/api/deals')
              .end(function (dealsGetErr, dealsGetRes) {
                // Handle deal save error
                if (dealsGetErr) {
                  return done(dealsGetErr);
                }

                // Get deals list
                var deals = dealsGetRes.body;

                // Set assertions
                (deals[0].user._id).should.equal(userId);
                (deals[0].title).should.match('Deal Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an deal if not logged in', function (done) {
    agent.post('/api/deals')
      .send(deal)
      .expect(403)
      .end(function (dealSaveErr, dealSaveRes) {
        // Call the assertion callback
        done(dealSaveErr);
      });
  });

  it('should not be able to save an deal if no title is provided', function (done) {
    // Invalidate title field
    deal.title = '';

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

        // Save a new deal
        agent.post('/api/deals')
          .send(deal)
          .expect(400)
          .end(function (dealSaveErr, dealSaveRes) {
            // Set message assertion
            (dealSaveRes.body.message).should.match('Title cannot be blank');

            // Handle deal save error
            done(dealSaveErr);
          });
      });
  });

  it('should be able to update an deal if signed in', function (done) {
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

        // Save a new deal
        agent.post('/api/deals')
          .send(deal)
          .expect(200)
          .end(function (dealSaveErr, dealSaveRes) {
            // Handle deal save error
            if (dealSaveErr) {
              return done(dealSaveErr);
            }

            // Update deal title
            deal.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing deal
            agent.put('/api/deals/' + dealSaveRes.body._id)
              .send(deal)
              .expect(200)
              .end(function (dealUpdateErr, dealUpdateRes) {
                // Handle deal update error
                if (dealUpdateErr) {
                  return done(dealUpdateErr);
                }

                // Set assertions
                (dealUpdateRes.body._id).should.equal(dealSaveRes.body._id);
                (dealUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of deals if not signed in', function (done) {
    // Create new deal model instance
    var dealObj = new Deal(deal);

    // Save the deal
    dealObj.save(function () {
      // Request deals
      request(app).get('/api/deals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single deal if not signed in', function (done) {
    // Create new deal model instance
    var dealObj = new Deal(deal);

    // Save the deal
    dealObj.save(function () {
      request(app).get('/api/deals/' + dealObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', deal.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single deal with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/deals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Deal is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single deal which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent deal
    request(app).get('/api/deals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No deal with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an deal if signed in', function (done) {
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

        // Save a new deal
        agent.post('/api/deals')
          .send(deal)
          .expect(200)
          .end(function (dealSaveErr, dealSaveRes) {
            // Handle deal save error
            if (dealSaveErr) {
              return done(dealSaveErr);
            }

            // Delete an existing deal
            agent.delete('/api/deals/' + dealSaveRes.body._id)
              .send(deal)
              .expect(200)
              .end(function (dealDeleteErr, dealDeleteRes) {
                // Handle deal error error
                if (dealDeleteErr) {
                  return done(dealDeleteErr);
                }

                // Set assertions
                (dealDeleteRes.body._id).should.equal(dealSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an deal if not signed in', function (done) {
    // Set deal user
    deal.user = user;

    // Create new deal model instance
    var dealObj = new Deal(deal);

    // Save the deal
    dealObj.save(function () {
      // Try deleting deal
      request(app).delete('/api/deals/' + dealObj._id)
        .expect(403)
        .end(function (dealDeleteErr, dealDeleteRes) {
          // Set message assertion
          (dealDeleteRes.body.message).should.match('User is not authorized');

          // Handle deal error error
          done(dealDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Deal.remove().exec(done);
    });
  });
});
