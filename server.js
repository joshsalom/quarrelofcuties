//server.js

var express = require('express');
var app     = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

//routes
var router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Found API!'});
});

//api prefix
app.use('/api', router);

app.listen(port);
console.log('Server running on port ' + port);
