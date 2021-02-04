const Issues = require('../models/issues');
const issueStatus = require('../models/issue-status');
const { WebhookClient, Payload, Card } = require('dialogflow-fulfillment');
const descMap = require('../models/issue-desc');
const customPayload = require('../models/custom-payload');

function issueCustomPayload(agent) {
    console.log('custom');
    // console.log(agent);
    agent.add(new Payload(agent.UNSPECIFIED, customPayload, { sendAsMessage: true, rawPayload: true }));

    // console.log(agent);
}

/* Report Issue Handler */
function reportIssueHandler(agent) {
    const user_details = agent.getContext('user-details');
    const desc = descMap[agent.parameters["option"]];
    const issue = {
        issueId: create_UUID(),
        phoneNumber: user_details.parameters['phoneNumber'],
        description: desc,
        status: issueStatus.Created,
    };
    console.log(issue);

    return Issues.create(issue)
        .then(resp => {
            agent.clearOutgoingContexts();
            agent.add(`Issue Created Successfully!\n
            To check the status of the issue...\n
            please use the issue id: ${resp.issueId}`);
        })
        .catch(err => {
            console.log(err);
            agent.add('error occurred! please restart the chatbot...');
        })
}

/* Issue Details Request Handler */
function getIssueDetailsHandler(agent = new WebhookClient()) {
    const issueId = agent.parameters.IssueId;
    // console.log(agent.parameters);
    if (!!issueId) {
        return Issues.findOne({ issueId: issueId })
            .then(issue => {
                if (!!issue) {
                    let date = new Date(issue.createdAt);
                    return agent.add(`Issue : ${issue.issueId}\n
                            Details:
                            \nDescription: \n${issue.description}
                            \nStatus: \n${issue.status}
                            \nCreated On: \n${date.toUTCString()}`);
                }
                else {
                    return agent.add(`Issue with id: ${issueId} Not Found!`);
                }
            })
            .catch(err => {
                console.log(err);
                agent.add('error occurred! please restart the chatbot...');
            });
    }
}

/* Generates a unique Id of length 32*/
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

module.exports = {
    reportIssueHandler,
    getIssueDetailsHandler,
    issueCustomPayload,
}