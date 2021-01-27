var express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
var router = express.Router();

const Issues = require('../models/issues');
const Users = require('../models/users');

const issueStatus = require('../models/issue-status');

router.post('/', function (req, res, next) {
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    const intentMap = new Map();
    intentMap.set('user.identify', userIdentificationHandler);
    intentMap.set('user.report.issue', reportIssueHandler);
    intentMap.set('user.issue.details', getIssueDetailsHandler);

    agent.handleRequest(intentMap);
});


/* Report Issue Handler */
function reportIssueHandler(agent) {
    const user_details = agent.getContext('user-details');
    const desc = agent.query;
    console.log(issue);
    const issue = {
        issueId: create_UUID(),
        phoneNumber: user_details.parameters['phone-number'],
        description: desc,
        status: issueStatus.Created
    };

    return Issues.create(issue)
        .then(resp => {
            agent.clearOutgoingContexts();
            agent.add(`Issue Created Successfully!
            To check the status of the issue use the issue id: ${resp.issueId}`);
        })
        .catch(err => {
            console.log(err);
            agent.add('error occurred! please restart the chatbot...');
        })

}

/* Issue Details Request Handler */
function getIssueDetailsHandler(agent) {
    const issueId = agent.parameters['IssueId'];

    if (!!issueId) {
        return Issues.findOne({ issueId: issueId })
            .then(issue => {
                if (!!issue) {
                    agent.add(`Issue Details:
                    issueId: ${issue.issueId}
                    description: ${issue.description}
                    status: ${issue.status}
                    created on: ${issue.createdAt}`);
                }
                else {
                    return agent.add(`Issue with id: ${issueId} Not Found!`);
                }
            })
            .catch(err => {
                agent.add('error occurred! please restart the chatbot...');
            });
    }
}

/* User Identification Handler */
async function userIdentificationHandler(agent) {
    const phone = agent.parameters['phone-number'];
    if (!!phone) {
        await Users.findOne({ phoneNumber: phone })
            .then(user => {
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
                    agent.add(`Hi, ${user.username}
                    Please enter your issue description..`);
                }
                else {
                    agent.end(`${phoneNumber} is not a registered mobile number!`);
                }
            })
            .catch(err => {
                agent.add('error occurred! please restart the chatbot...');
            });
    }
    else {
        return agent.end('mobile number not provided!');
    }

}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

module.exports = router;
