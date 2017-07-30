//server.js

var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');

let mdb;
MongoClient.connect('mongodb://localhost:27017/quarrelofcuties', (err, db) => {
  assert.equal(null, err);
  mdb = db;
});



app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, './public')));

var port = process.env.PORT || 3000;


//routes
var router = express.Router();

router.use(function(req, res, next) {
  //do logging
  console.log(req.method + " request for " + req.url);
  next();
});


router.get('/', (req, res) => {
  res.json({ message: 'Found API!'});
});

router.route('/animals')
//post func
  .post(function(req, res) {
    res.json('You aren\'t allowed to create an animal');
  })
//get all animals func
  .get(function(req, res) {
    let animals = {};
    mdb.collection('reddit').find({})
      .project({
        _id: 1,
        author: 1,
        score: 1,
        url: 1,
        elo: 1,
        gamesPlayed: 1
      })
      .each((err, animal) => {
        assert.equal(null, err);
    
        if(!animal) { //no more animals
          res.json({animals});
          return;
        }
        animals[animal._id] = animal;
      });
  });

router.route('/animals/:animal_id')
//get animal with id
  .get(function(req, res) {
    const animalIds = req.params.animal_id.split(',').map(ObjectID);
    let animals = {};
    mdb.collection('reddit').find({_id: {$in: animalIds }})
      .each((err, animal) => {
        assert.equal(null, err);
      
        if(!animal) { //no more animals
          res.json({animals});
          return;
        }
        animals[animal._id] = animal;
      });
  })
//update animal func
  .put(function(req, res) {
    mdb.collection('reddit').updateOne(
      {_id: ObjectID(req.params.animal_id)}, 
      {
        $set: {elo: req.body.elo},
        $inc: {gamesPlayed: 1}
      },
      {upsert: true},
      function(err, doc){
        assert.equal(null, err);
        res.json(doc);
        console.log(doc);
      });
  //db.inventory.findOneAndUpdate( {item: 'postcard'}, {$set: {elo:1500}, $inc: {games: 1}, {upsert: true}})
  })
  .delete(function(req, res) {
    res.json('You aren\'t allowed to delete an animal');
  });

router.route('/scrim') //get two scrim partners
  .get(function(req, res) {
    //let scrimList = {};
    mdb.collection('reddit').aggregate([
      {$match:{}},
      {$project: {_id:1, author:1, score:1, url:1, elo:1, gamesPlayed:1}},
      {$sort:{gamesPlayed:1}},
      {$limit:3},
      {$sample:{size:2}}
    ])
      .toArray(function(err, scrimArray) {
        assert.equal(null, err);
        res.json({scrimArray});
      });
  });

router.route('/rankings') //get top 10 for leaderboard
  .get(function(req, res) {
    mdb.collection('reddit').aggregate([
      {$match:{}},
      {$project: {_id:1, author:1, score:1, url:1, elo:1, gamesPlayed:1, thumbnail:1}},
      {$sort:{elo:-1}},
      {$limit:10}
    ])
      .toArray(function(err, rankArray) {
        assert.equal(null, err);
        res.json({rankArray});
      });
  });


/////////////////////////////////////////////////
//api prefix
app.use('/api', router);

app.listen(port);
console.log('Server running on port ' + port);
