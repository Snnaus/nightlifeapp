'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BarSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  yelpID: String,
  city: String,
  patrons: [{name: String, userID: String}]
});

module.exports = mongoose.model('Bar', BarSchema);