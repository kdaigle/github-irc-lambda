process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

var irc = require("irc"),
  handlebars = require("handlebars"),
  templates = require("./templates/issue");

exports.handler = function(event, context) {
  var client = new irc.Client("irc.freenode.net", "kdaigleBotTest", {
    debug: true,
    autoConnect: false,
  });
  var compiledTemplate = handlebars.compile(templates.rawIssueTemplate);
  var compiledMessage = compiledTemplate(event);
  client.connect(function () {
    client.join("##kdaigle-test", function() {
      client.say("##kdaigle-test", compiledMessage);
      client.part("##kdaigle-test");
    });
  });

  client.addListener('error', function(message) {
      console.log('error: ', message);
  });
}
