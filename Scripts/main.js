// Tasks
const Tasks = require("Tasks.js");
nova.assistants.registerTaskAssistant(Tasks.fava, {
    identifier: "fava",
    name: "Fava"
});
nova.assistants.registerTaskAssistant(Tasks.beancount, {
    identifier: "beancount",
    name: "Beancount"
});

// Issues
const Issues = require("Issues.js");
nova.assistants.registerIssueAssistant("beancount", Issues.beancount, {
    event: "onSave"
});
