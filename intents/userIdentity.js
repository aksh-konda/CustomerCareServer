const Users = require('../models/users');
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
                    agent.add(`Hi, ${user.username}. Please enter your issue description..`);
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

module.exports = { userIdentificationHandler };