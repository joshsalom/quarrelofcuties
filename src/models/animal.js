var mongoose    = require('mongose');
var Schema      = mongoose.Schema;

var BearSchema  = new Schema({
    species: String,
    elo: Number
});

module.exports = mongoose.model('Animal', AnimalSchema);