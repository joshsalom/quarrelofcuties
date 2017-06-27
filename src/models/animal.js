var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var AnimalSchema  = new Schema({
  species: String,
  elo: Number
});

module.exports = mongoose.model('Animal', AnimalSchema);