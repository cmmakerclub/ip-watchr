var Q = require('q');
var _ = require("underscore");
var exports = module.exports = {};

var callback  = function(data) { console.log("LOCAL CALLBACK"); };
var filterIdx = { head: 1, tail: 3 };

var splitLinesToArray = function(lines) {
    return Q.all(_.map(lines, filterDataIndex));
}

var splitMessage = function(str, tokenizer) {
  var deferred = Q.defer();
  deferred.resolve(str.split(tokenizer));
  return deferred.promise;
}

var filterDataIndex = function(data, idx) {
  return _.filter(data.split(" "), function (val, idx) {
    return idx >= filterIdx.head && idx <= filterIdx.tail;
  });
}

var removeNull = function(v) {
    return Q.fapply(_.filter, [v, function(v, i) {  return _.isEmpty(v) == false; }])
}

exports.setCallback = function(c) {
    callback = c;
}

exports.parse = function(data, cb) {
    splitMessage(data, "\n")
    .then(splitLinesToArray)
    .then(removeNull)
    .then(function(v) {
        callback(v);
    })
    .done();
}