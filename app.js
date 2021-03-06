var CHANNEL_ID = 'D13AHGWMS';
var APP_DIR = "/ProjectNewbie/NewbieServer";
var cp = require('child_process');

var NodeSlackClient = require('./Node-Slack-Client/NodeSlackClient');
var token = process.env.SLACK_API_TOKEN || 'xoxb-37378494434-JPg5OHLhXef4yKMXxqwKi2wf';
var slackClient = new NodeSlackClient("NewbieServer", token, CHANNEL_ID, function(msg) {
    console.log(msg);
    if(msg.trim() === 'start') {
        cp.exec('forever start '+APP_DIR+'/app.js'/*command*/,{}/*options, [optiona]l*/, function(err, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if(stderr) {
                rtm.sendMessage('server start failed:'+stderr, CHANNEL_ID, function messageSent() {
                    // optionally, you can supply a callback to execute once the message has been sent
                });
            } else {
                rtm.sendMessage('server start ok!', CHANNEL_ID, function messageSent() {
                    // optionally, you can supply a callback to execute once the message has been sent
                });
            }
            
        });
    } else if(msg && msg.trim() === 'deploy') {/* && git checkout master */
        cp.exec('cd '+APP_DIR+' && git pull && npm install', {}/*options, [optiona]l*/, function(err, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if(stderr) {
                slackClient.sendMessage('git pull failed:'+stderr, CHANNEL_ID, function messageSent() {
                    // optionally, you can supply a callback to execute once the message has been sent
                });
            } else {
                slackClient.sendMessage('git pull ok:'+stdout, CHANNEL_ID, function messageSent() {
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
                    slackClient.sendMessage('server restart ok!', CHANNEL_ID, function messageSent() {
                        // optionally, you can supply a callback to execute once the message has been sent
                    });
                }
            });
        });
    }
});
