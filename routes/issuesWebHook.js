var express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
var router = express.Router();

const Issues = require('../models/issues');
const Users = require('../models/users');

router.post('/', function (req, res, next) {
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    const intentMap = new Map();
    intentMap.set('user.identify', userIdentificationHandler);
    intentMap.set('user.report.issue', reportIssueHandler);

    agent.handleRequest(intentMap);
});


/* User Identification Handler */
async function reportIssueHandler(agent = new WebhookClient()) {

    console.log(agent);
}

async function userIdentificationHandler(agent = new WebhookClient()) {
    const phone = agent.parameters['phone-number'];
    if (!!phone) {
        const user = await Users.findOne({ phoneNumber: phone });
        if (!!user) {
            agent.clearOutgoingContexts();
            agent.setContext({
                name: 'user-details',
                lifespan: 5,
                parameters: {
                    username: user.username,
                    phoneNumber: user.phoneNumber
                }
            });
            agent.add(`Hi, ${user.username}`);
            agent.add(`Please enter your issue description..`);
        }
        else {
            agent.add('Not a registered mobile number!');
        }
    }
    else {
        agent.add('mobile number not provided!');
    }

    console.log(agent);
}

module.exports = router;
