//server.js

var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
var path = require('path');
var MongoClient = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
//import {MongoClient, ObjectID} from 'mongodb';
var assert = require('assert');

//mongoose.connect('mongodb://localhost/quarrelofcuties');
let mdb;
MongoClient.connect('mongodb://localhost:27017/quarrelofcuties', (err, db) => {
  assert.equal(null, err);
  mdb = db;
});



app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, './public')));

var port = process.env.PORT || 3000;

//var Animal = require('./src/models/animal');

//routes
var router = express.Router();

router.use(function(req, res, next) {
  //do logging
  console.log('Something is happening.');
  next();
});


router.get('/', (req, res) => {
  res.json({ message: 'Found API!'});
});

router.route('/animals')
//post func
  .post(function(req, res) {
    res.json('You aren\'t allowed to create an animal');
  /*
    var animal = new Animal();
    animal.species = req.body.species;
    animal.elo = req.body.elo;
    
    //save model
    animal.save(function(err) {
      if (err)
        res.send(err);
      res.json({message: 'Animal created'});
    });
    */
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
    /*
    Animal.find(function(err, animals) {
      if (err)
        res.send(err);
      res.json(animals);
    });
    */
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
    /*
    Animal.findById(req.params.animal_id, function(err, animal) {
      if (err)
        res.send(err);
      res.json(animal);
    });
    */
  })
//update animal func
  .put(function(req, res) {
    mdb.collection('reddit').findOneAndUpdate(
      {_id: ObjectID(req.params.animal_id)}, 
      {$set: {elo: req.body.elo}},
      {upsert: true},
      function(err, doc){
        assert.equal(null, err);
        res.json(doc);
      });
  //db.inventory.findOneAndUpdate( {item: 'postcard'}, {$set: {elo:1500}, $inc: {games: 1}, {upsert: true}})
  })
  /*
    Animal.findById(req.params.animal_id, function(err, animal) {
      if (err)
        res.send(err);
      animal.species = req.body.species;
      animal.elo = req.body.elo;
      animal.save(function(err) {
        if (err)
          res.send(err);
        res.json({message: 'Animal updated'});
      });
    });
    */
  .delete(function(req, res) {
    res.json('You aren\'t allowed to delete an animal');
    /*
    Animal.remove({_id:req.params.animal_id}, function(err, animal) {
      if (err)
        res.send(err);
      res.json({message: 'Animal deleted'});
    });
    */
  });

router.route('/scrim') //get two scrim partners
  .get(function(req, res) {
    //let scrimList = {};
    mdb.collection('reddit').find({})
      .sort({games:1})
      .limit(2)
      .project({
        _id: 1,
        author: 1,
        score: 1,
        url: 1,
        elo: 1,
        gamesPlayed: 1
      })
      .toArray(function(err, scrimArray) {
        assert.equal(null, err);
        res.json({scrimArray});
      });
      
    /*
      .each((err, animal) => {
        assert.equal(null, err);
    
        if(!animal) { //no more animals
          res.json({scrimList});
          return;
        }
        scrimList[animal._id] = animal;
      });
      */
  });

/////////////////////////////////////////////////
//api prefix
app.use('/api', router);

app.listen(port);
console.log('Server running on port ' + port);
