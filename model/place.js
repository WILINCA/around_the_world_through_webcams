var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var place = new Schema({
    title: String,
    location: String,
    likes: {type: Number, default: 0}
});

module.exports = mongoose.model('Place', place);