'use strict';

var _ = require('lodash');
var Bar = require('./bar.model');
var yelp = require('./yelpquery');

// Get list of bars
exports.index = function(req, res) {
  Bar.find(function (err, bars) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(bars);
  });
};

// Get a single bar
exports.show = function(req, res) {
  Bar.findById(req.params.id, function (err, bar) {
    if(err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    return res.json(bar);
  });
};

// Creates a new bar in the DB.
exports.create = function(req, res) {
  Bar.create(req.body, function(err, bar) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(bar);
  });
};

// Updates an existing bar in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Bar.findById(req.params.id, function (err, bar) {
    if (err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    _.extend(bar, req.body);
    bar.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(bar);
    });
  });
};

// Deletes a bar from the DB.
exports.destroy = function(req, res) {
  Bar.findById(req.params.id, function (err, bar) {
    if(err) { return handleError(res, err); }
    if(!bar) { return res.status(404).send('Not Found'); }
    bar.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

// takes parameters to use with the yelp api and returns yelps response
exports.yelpQuery = function(req, res){
  yelp.request_yelp(req.body, function(error, response, body){
    if(error){ return handleError(res, error); }
    if(!body){ return res.status(404).send('Not Found'); }
    return res.status(200).json(body);
  });
};

// takes a mongo query and then returns the bars that match that query
exports.checkForBars = function(req, res){
  Bar.find(req.body, function(err, bars){
    if(err){ return handleError(res, err) }
    if(!bars){ return res.status(404).send('Not Found') }
    return res.status(200).json(bars);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}