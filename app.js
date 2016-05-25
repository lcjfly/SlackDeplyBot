var CHANNEL_ID = 'D13AHGWMS';
var APP_DIR = "/home/ubuntu/workspace/NewbieServer";
var cp = require('child_process');

var NodeSlackClient = require('./Node-Slack-Client/NodeSlackClient');
var token = process.env.SLACK_API_TOKEN || 'xoxb-37378494434-DkzeG3oO4k790OnleW3ibMnY';
var slackClient = new NodeSlackClient("NewbieServer", token, CHANNEL_ID, function(msg) {
    console.log(msg);
    if(msg.trim() === 'deploy') {/* && git checkout master */
        cp.exec('cd '+APP_DIR+' && git checkout master && git pull', {}/*options, [optiona]l*/, function(err, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if(stderr) {
                slackClient.sendMessage('git checkout failed:'+stderr, CHANNEL_ID, function messageSent() {
                    // optionally, you can supply a callback to execute once the message has been sent
                });
            } else {
                slackClient.sendMessage('git checkout successfully:'+stdout, CHANNEL_ID, function messageSent() {
                    // optionally, you can supply a callback to execute once the message has been sent
                });
            }
            cp.exec('forever restart '+APP_DIR+'/app.js'/*command*/,{}/*options, [optiona]l*/, function(err, stdout, stderr){
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if(stderr) {
                    slackClient.sendMessage('server restart failed:'+stderr, CHANNEL_ID, function messageSent() {
                        // optionally, you can supply a callback to execute once the message has been sent
                    });
                } else {
                    slackClient.sendMessage('server restart successfully:'+stdout, CHANNEL_ID, function messageSent() {
                        // optionally, you can supply a callback to execute once the message has been sent
                    });
                }
            });
        });
    }
});
