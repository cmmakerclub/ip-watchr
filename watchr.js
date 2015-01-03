var Cylon = require('cylon');
var _ = require("underscore");
var Q = require('q');

var splitMessage = function(str, tokenizer) {
  var deferred = Q.defer();
  deferred.resolve(str.split(tokenizer));
  return deferred.promise;
}

var filterDataIndex = function(data, idx) {
  return _.filter(data.split(" "), function (val, idx) {
    return idx >= 1 && idx <= 3;
  });
}


function splitLinesToArray(lines) {
    return Q.all(_.map(lines, filterDataIndex));
}

var mqtt_server = '';
Cylon.robot({
  connections: {
    server: { adaptor: 'mqtt', host: mqtt_server }
  },

  devices: {},

  work: function(my) {

    my.server.subscribe('cmmc-ip');

    my.server.on('message', function (topic, data) {
      console.log(topic + ": " + data);

      splitMessage(data, "\n")
        .then(function(lines) { 
          return splitLinesToArray(lines);
        })
        .then(function(v) {
          return Q.fapply(_.filter, [v, function(v, i) {  return !_.isEmpty(v); }])
        })
        .then(function(v) {
          console.log(v, typeof(v), v.length, typeof(v[0]), v[0].length, v[0]);
        })
        .done();
    });


  }
});

Cylon.start();
