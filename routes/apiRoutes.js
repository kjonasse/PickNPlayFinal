const db = require('../models/index')
var path = require('path');
var jwt = require('jsonwebtoken');
var week = 0;
const game = db.Game;
const Pick = db.Pick;
const User = db.User;

const SECRET = "supersecretkey";

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

app.get('/api/getScore', function(req,res){
  Pick.findAll({
    attributes: [
      'UserID',
      [Pick.sequelize.fn('SUM', Pick.sequelize.col('score')), 'score']
    ],
    include: [{
      model: User,
      required: true,
      attributes: ['username']
    }],
    group: ['UserID']
  }).then((results) => {
    res.status(200).json(results);
  })
});

app.post('/api/endGame', function(req, res){
  var wins = [];
  game.findAll({
    where:{
      week: week
    }
  }).then((results) => {
    
    for (var i = 0; i < results.length; i++) {

      var winLoss = () => {
        return Math.floor(Math.random() * 2);
      };

      if (winLoss() === 0 ){
        wins[i] = results[i].homeTeam;
      } else {
        wins[i] = results[i].awayTeam;
      }

    }

    for (var i = 0; i < wins.length; i++) {
      Pick.update({
        score: 1
      },
      { where: {
          pickedTeam: wins[i]
      }});
    }

  });
  res.status(200);
});

    
  app.post('/api/createPicks', authCheck, function(req, res){

    var picks = req.body.picks
    console.log(picks);
    console.log(req.decoded);

    //create picks
    for (var i = 0; i < picks.length; i++){
      Pick.create({
        week: week,
        pickedTeam: picks[i],
        UserId: req.decoded.id
      });
    }
  });

  app.get('/api/getGames', function(req,res){
    game.findAll({
      where:{
        week: week
      }
    }).then((results) => {
      // console.log(JSON.stringify(results));
      res.status(200).json(results);
    });
  });

  app.get('/api/startGame', function(req, res) {
    //Use this fucntion to find all picks as well (findAll)
    console.log('week:' + week + '------------------------------------------------------');
    week++;

    var awayTeams = [
      "Arizona Cardinals",
      "Kanas City Chiefs",
      "Dallas Cowboys",
      "New York Jets",
      "San Diego Chargers",
      "Tampa Bay Buccaneers",
      "Washington Redskins",
      "Green Bay Packers",
      "Chicago Bears",
      "New Orleans Saints",
      "Houston Texans",
      "Carolina Panthers",
      "Pittsburgh Steelers",
      "Cleveland Browns",
      "Baltimore Ravens",
      "Minnesota Vikings"
    ];

    var homeTeams = [
      "Atlanta Falcons",
      "Buffalo Bills",
      "Cincinnati Bengals",
      "Denver Broncos",
      "Detroit Lions",
      "Indianapolis Colts",
      "Jasksonville Jaguars",
      "Miami Dolphins",
      "New England Patriots",
      "New York Giants",
      "Oakland Raiders",
      "Philadelphia Eagles",
      "Los Angeles Rams",
      "San Francisco 49ers",
      "Seattle Seahawks",
      "Tennessee Titans"
    ];

    //pick varible for sql
    var picks = [];

    for (let i = 0; i < 16; i++) {

      var teams = pickTeams(awayTeams, homeTeams);

      //Create function for SQL DB
      game.create({
        week: week,
        homeTeam: teams.home,
        awayTeam: teams.away,
      }).then((pick) => {

        picks.push(pick);

        if (picks.length === 16) res.status(200).json(picks);

      });
    }
  });

  //Code to run random team picks
  function pickTeams(awayTeams, homeTeams) {
    //Random team picks
    var awayIndex = Math.floor(Math.random() * awayTeams.length);
    var homeIndex = Math.floor(Math.random() * homeTeams.length);

    var away = awayTeams[awayIndex];
    var home = homeTeams[homeIndex];

    //Splice deletes used items from the array
    awayTeams.splice(awayIndex, 1);
    homeTeams.splice(homeIndex, 1);

    return {
      home,
      away
    }
  };
};