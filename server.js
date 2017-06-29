//server.js

var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/quarrelofcuties');

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use(express.static('./public'));

var port = process.env.PORT || 3000;

var Animal = require('./src/models/animal');

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
    var animal = new Animal();
    animal.species = req.body.species;
    animal.elo = req.body.elo;
    
    //save model
    animal.save(function(err) {
      if (err)
        res.send(err);
      res.json({message: 'Animal created'});
    });
  })
//get all animals func
  .get(function(req, res) {
    Animal.find(function(err, animals) {
      if (err)
        res.send(err);
      res.json(animals);
    });
  });

router.route('/animals/:animal_id')
//get animal with id
  .get(function(req, res) {
    Animal.findById(req.params.animal_id, function(err, animal) {
      if (err)
        res.send(err);
      res.json(animal);
    });
  })
//update animal func
  .put(function(req, res) {
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
  })
  .delete(function(req, res) {
    Animal.remove({_id:req.params.animal_id}, function(err, animal) {
      if (err)
        res.send(err);
      res.json({message: 'Animal deleted'});
    });
  });




//api prefix
app.use('/api', router);

app.listen(port);
console.log('Server running on port ' + port);
