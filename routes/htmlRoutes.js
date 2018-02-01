//dependencies
const db = require('../models/index')
var path = require('path');
var jwt = require('jsonwebtoken');
const game = db.Game;
const Pick = db.Pick;
const User = db.User;

const SECRET = "supersecretkey";

//routes
module.exports = function(app) {

  function authCheck(req, res, next){

    jwt.verify(req.cookies.AUTH, SECRET, function(err, decoded){
      if (err) {
        res.redirect('/login');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  };

  //index route
  app.get('/', function(req, res) {
    res.status(200).sendFile(path.join(__dirname, "../public/index.html"));
  });

  // route for user signup
  app.route('/signup')
      .get((req, res) => {
          res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
      })
      .post((req, res) => {
          User.create({
              username: req.body.username,
              email: req.body.email,
              password: req.body.password
          })
          .then(user => {
              
              res.redirect('/team');
          })
          .catch(error => {
              res.redirect('/signup');
          });
      });

  //login route
  app.route('/login')
    .get((req, res) => {
        res.status(200).sendFile(path.join(__dirname, '../public/login2.html'));
    })
    .post((req, res, next) => {
        var username = req.body.username,
            password = req.body.password;
        console.log(req.body);
        User.findOne({ where: { username: username } }).then(function (user) {
            try{
                if (!user) {
                    res.redirect('/login');
                } else if (!user.validPassword(password)) {
                    res.redirect('/login');
                } else {
                    // console.log(req);
                    // console.log('cookies',req.cookies);

                    var token = jwt.sign({
                      id: user.id,
                    }, SECRET);

                    res.cookie('AUTH',token, {
                      expires: new Date(Date.now() + (86400 * 14 * 1000)),
                      maxAge: (86400 * 14 * 1000),
                      httpOnly: true,
                      secure: false
                    });

                    res.redirect('/');
                }
            }catch(err){
                console.log("error: ", err);
                next(err);
            }
        });
    });


  //team route
  app.get('/team', function(req, res) {
    res.status(200).sendFile(path.join(__dirname, "../public/team.html"));
  });

  //score route
  app.get('/score', authCheck, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../public/scores.html"));
  });

  //team schedule
  app.get('/schedule', authCheck, (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../public/schedule.html"));
  });



  // route for user logout
  app.get('/logout', (req, res) => {
      if (req.cookies) {
          res.cookie('AUTH', '', {
            expires: new Date(0),
            maxAge: 0,
            httpOnly: true,
            secure: false
          });
          res.redirect('/');
      } else {
          res.redirect('/');
      }
  });

  // route for handling 404 requests(unavailable routes)
  app.get(function (err, req, res, next) {
    res.status(404).send("Sorry can't find that!")
  });

};