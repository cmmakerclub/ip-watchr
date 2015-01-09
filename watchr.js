var Cylon = require('cylon');
var _ = require("underscore");
var parser = require("./parser.js");

var mqtt_server = '';

Cylon.robot({
  connections: {
    server: { adaptor: 'mqtt', host: mqtt_server }
  },

  devices: {},

  work: function(my) {

    my.server.subscribe('cmmc-ip');

    my.server.on('message', function (topic, data) {
      console.log(data);

      parser.setCallback(function(d) { console.log("PARSED: ", d) });

      parser.parse(data);
    });


  }
});

Cylon.start();
