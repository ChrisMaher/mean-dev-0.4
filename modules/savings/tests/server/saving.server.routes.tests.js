'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Saving = mongoose.model('Saving'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, saving;

/**
 * Saving routes tests
 */
describe('Saving CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'testtest',
      password: 'testtest'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test1@test1.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new saving
    user.save(function () {
      saving = {
        title: 'Saving Title',
        details: 'Saving Content',
          link: 'http://www.saveme.ie',
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
      };

      done();
    });
  });

  it('should be able to save an saving if logged in', function (done) {
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

        // Save a new saving
        agent.post('/api/savings')
          .send(saving)
          .expect(200)
          .end(function (savingSaveErr, savingSaveRes) {
            // Handle saving save error
            if (savingSaveErr) {
              return done(savingSaveErr);
            }

            // Get a list of savings
            agent.get('/api/savings')
              .end(function (savingsGetErr, savingsGetRes) {
                // Handle saving save error
                if (savingsGetErr) {
                  return done(savingsGetErr);
                }

                // Get savings list
                var savings = savingsGetRes.body;

                // Set assertions
                (savings[0].user._id).should.equal(userId);
                (savings[0].title).should.match('Saving Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an saving if not logged in', function (done) {
    agent.post('/api/savings')
      .send(saving)
      .expect(403)
      .end(function (savingSaveErr, savingSaveRes) {
        // Call the assertion callback
        done(savingSaveErr);
      });
  });

  it('should not be able to save an saving if no title is provided', function (done) {
    // Invalidate title field
    saving.title = '';

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

        // Save a new saving
        agent.post('/api/savings')
          .send(saving)
          .expect(400)
          .end(function (savingSaveErr, savingSaveRes) {
            // Set message assertion
            (1).should.equal(1);

            // Handle saving save error
            done(savingSaveErr);
          });
      });
  });

  it('should be able to update an saving if signed in', function (done) {
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

        // Save a new saving
        agent.post('/api/savings')
          .send(saving)
          .expect(200)
          .end(function (savingSaveErr, savingSaveRes) {
            // Handle saving save error
            if (savingSaveErr) {
              return done(savingSaveErr);
            }

            // Update saving title
            saving.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing saving
            agent.put('/api/savings/' + savingSaveRes.body._id)
              .send(saving)
              .expect(200)
              .end(function (savingUpdateErr, savingUpdateRes) {
                // Handle saving update error
                if (savingUpdateErr) {
                  return done(savingUpdateErr);
                }

                // Set assertions
                (savingUpdateRes.body._id).should.equal(savingSaveRes.body._id);
                (savingUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of savings if not signed in', function (done) {
    // Create new saving model instance
    var savingObj = new Saving(saving);

    // Save the saving
    savingObj.save(function () {
      // Request savings
      request(app).get('/api/savings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single saving if not signed in', function (done) {
    // Create new saving model instance
    var savingObj = new Saving(saving);

    // Save the saving
    savingObj.save(function () {
      request(app).get('/api/savings/' + savingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', saving.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single saving with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/savings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Saving is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single saving which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent saving
    request(app).get('/api/savings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No saving with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an saving if signed in', function (done) {
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

        // Save a new saving
        agent.post('/api/savings')
          .send(saving)
          .expect(200)
          .end(function (savingSaveErr, savingSaveRes) {
            // Handle saving save error
            if (savingSaveErr) {
              return done(savingSaveErr);
            }

            // Delete an existing saving
            agent.delete('/api/savings/' + savingSaveRes.body._id)
              .send(saving)
              .expect(200)
              .end(function (savingDeleteErr, savingDeleteRes) {
                // Handle saving error error
                if (savingDeleteErr) {
                  return done(savingDeleteErr);
                }

                // Set assertions
                (savingDeleteRes.body._id).should.equal(savingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an saving if not signed in', function (done) {
    // Set saving user
    saving.user = user;

    // Create new saving model instance
    var savingObj = new Saving(saving);

    // Save the saving
    savingObj.save(function () {
      // Try deleting saving
      request(app).delete('/api/savings/' + savingObj._id)
        .expect(403)
        .end(function (savingDeleteErr, savingDeleteRes) {
          // Set message assertion
          (savingDeleteRes.body.message).should.match('User is not authorized');

          // Handle saving error error
          done(savingDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Saving.remove().exec(done);
    });
  });
});
