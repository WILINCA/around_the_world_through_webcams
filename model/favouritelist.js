var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var favourite = new Schema({
    title: {type: String, default: "Favourite"},
    places:[{type: ObjectId, ref:'Place'}]
});

module.exports = mongoose.model('Favourite', favourite);