var express = require('express');
var router = express.Router();
const { WebhookClient } = require('dialogflow-fulfillment');

const { userIdentificationHandler } = require('../intents/userIdentity');
const { reportIssueHandler, getIssueDetailsHandler, issueCustomPayload } = require('../intents/issueHandler');

router.post('/', function (req, res, next) {
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    const intentMap = new Map();
    intentMap.set('user.identify', userIdentificationHandler);
    intentMap.set('user.issue.report', issueCustomPayload);
    intentMap.set('user.issue.register', reportIssueHandler);
    intentMap.set('user.issue.query', getIssueDetailsHandler);
    agent.handleRequest(intentMap);
});

module.exports = router;
