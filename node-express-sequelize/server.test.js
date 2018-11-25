
var request = require('request');
var should = require('chai').should();
var app = require('./server.js').app;
var User = require('./server.js').User;

describe('server', function() {
  var server;
  beforeEach(function(done) {
    User.sync({ force: true })
      .then(function () {
        return User.create({ username: 'beth' });
      })
      .then(function() {
        server = app.listen(3000, function() {
          done();
        });
      })
      .catch(function(err) {
        done(err);
      });
  });

  afterEach(function() {
    server.close();
  });

  it('should respond with a 200 status code to /users', function(done) {
    request.get('http://127.0.0.1:3000/users', function(err, res) {
      if (err) {
        return done(err);
      }
      var body = JSON.parse(res.body);
      res.statusCode.should.be.within(200, 300);
      done();
    });
  });

  it('should respond with a 404 status code to a nonexistent route', function(done) {
    request.get('http://127.0.0.1:3000/foo', function(err, res) {
      if (err) {
        return done(err);
      }
      res.statusCode.should.equal(404);
      done();
    });
  });

  it('should respond with an array of users currently in the database', function(done) {
    request.get('http://127.0.0.1:3000/users', function(err, res) {
      if (err) {
        return done(err);
      }
      var body = JSON.parse(res.body);
      Array.isArray(body).should.equal(true);
      body.length.should.equal(1);
      done();
    });
  });

});
