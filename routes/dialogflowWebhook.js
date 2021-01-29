var express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
var router = express.Router();

const Issues = require('../models/issues');
const { userIdentificationHandler } = require('../intents/userIdentity');
const { reportIssueHandler, getIssueDetailsHandler } = require('../intents/issueHandler');

const issueStatus = require('../models/issue-status');

router.post('/', function (req, res, next) {
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    const intentMap = new Map();
    intentMap.set('user.identify', userIdentificationHandler);
    intentMap.set('user.issue.report', reportIssueHandler);
    intentMap.set('user.issue.query', getIssueDetailsHandler);
    agent.handleRequest(intentMap);
});

module.exports = router;
