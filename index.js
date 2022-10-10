const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");
var Payload = require('./payload').Payload

const slack_payload = new Payload(core.getInput("channel"), core.getInput("username"))
var message_input = core.getInput("message")
const payload = github.context.payload;

if (message_input.length > 0) {
    core.info("Using message input variable to use as slack message")
    slack_payload.set_message(message_input)
} else {
    pr_title = `PR <${payload.pull_request.html_url}|*#${payload.pull_request.number}* ${pull_request.title}>`
    if (payload.review) {
        var reviewer = `<${payload.review.user.url}|${payload.review.user.login}>`
        slack_payload.set_message_attachment(review_message(payload.review.state, reviewer, pr_title), payload.review.body)
    } else if (payload.pull_request.state = "open")
        slack_payload.set_message_attachment(":rocket: New PR ready for review! :rocket:", `${pr_title} submitted by <${payload.pull_request.user.url}|${payload.pull_request.user.login}>`)
}
json_payload = slack_payload.create_payload_file()
exec(`curl -X POST ${core.getInput("message")} -H "Content-Type: application/json" -d ${json_payload}`, (error, stdout, stderr) => {
    if (error)
        console.error(error);
    else if (stderr)
        console.error(`stderr: ${stderr}`);
    else
        console.log(`stdout:\n${stdout}`);
});

