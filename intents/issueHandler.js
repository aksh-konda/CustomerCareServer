const Issues = require('../models/issues');
const issueStatus = require('../models/issue-status');
const { WebhookClient } = require('dialogflow-fulfillment');

/* Report Issue Handler */
function reportIssueHandler(agent) {
    const user_details = agent.getContext('user-details');
    const desc = agent.query;
    const issue = {
        issueId: create_UUID(),
        phoneNumber: user_details.parameters['phoneNumber'],
        description: desc,
        status: issueStatus.Created
    };
    console.log(issue);

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
function getIssueDetailsHandler(agent = new WebhookClient()) {
    const issueId = agent.parameters.IssueId;
    console.log(agent.parameters);
    if (!!issueId) {
        return Issues.findOne({ issueId: issueId })
            .then(issue => {
                if (!!issue) {
                    let date = new Date(issue.createdAt);
                    agent.add('Issue Details: ');
                    agent.setContext({
                        name: 'user-issue',
                        lifespan: 1,
                        parameters: {
                            issueId: issue.issueId,
                            description: issue.description,
                            status: issue.status,
                            createdOn: date.toUTCString(),
                        }
                    });
                    console.log(agent.getContext("user-issue"));
                    agent.setFollowupEvent('displayIssueDetails');
                }
                else {
                    return agent.add(`Issue with id: ${issueId} Not Found!`);
                }
            })
            .catch(err => {
                agent.add('error occurred! please restart the chatbot...');
                console.log(err);
            });
    }
}

/* Generates a unique Id of length 32*/
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

module.exports = {
    reportIssueHandler,
    getIssueDetailsHandler
}