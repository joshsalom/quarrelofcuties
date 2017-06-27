//server.js

var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/quarrelofcuties');

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var Animal = require('./src/models/animal');

//routes
var router = express.Router();

router.use(function(req, res, next) {
  //do logging
  console.log('Something is happening.');
  next();
});

router.route('/animals')
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
});

router.get('/', (req, res) => {
  res.json({ message: 'Found API!'});
});



//api prefix
app.use('/api', router);

app.listen(port);
console.log('Server running on port ' + port);
