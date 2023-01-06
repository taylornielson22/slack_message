const core = require('@actions/core');
const github = require('@actions/github');
const SlackMessage = require('./slack_message').SlackMessage;

try {
    const payload = github.context.payload;
    const pr = payload.pull_request;
    var slack_message = new SlackMessage(core.getInput("username"), core.getInput("slack_webhook"), `#${core.getInput("channel")}`)
    if(core.getInput("message").length > 0)
        slack_message.create_message(core.getInput("message_title"), core.getInput("message"))
    else if (pr) {
        pr_title = `<${pr.html_url}|*#${pr.number}* ${pr.title}>`
        if(payload.review)
            slack_message.pr_message(payload.review.state, pr_title, `<${payload.review.user.url}|${payload.review.user.login}>`, payload.review.body)
        else if(pr.state=="open")
            slack_message.pr_message("", pr_title, `<${pr.user.url}|${pr.user.login}>`, "")
    }
    console.log(`Sending message to channel #${core.getInput("channel")}`)
    slack_message.send_message()
} catch (error) {
    console.log(error)
}
