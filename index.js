process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

var irc = require("irc"),
  handlebars = require("handlebars"),
  templates = require("./templates/issue");

exports.handler = function(event, context) {
  var channelName = event.config.channelName;
  var botName = event.config.botName;
  var client = new irc.Client("irc.freenode.net", botName, {
    debug: true,
    autoConnect: false,
  });
  var compiledTemplate = handlebars.compile(templates.rawIssueTemplate);
  var compiledMessage = compiledTemplate(event.payload);
  client.connect(function () {
    client.join(channelName, function() {
      client.say(channelName, compiledMessage);
      client.part(channelName, function() {
        client.send("QUIT");
        context.succeed();
      })
    });
  });
}
