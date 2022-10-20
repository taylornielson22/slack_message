const core = require('@actions/core');
const github = require('@actions/github');
var request = require('request');
const SlackMessage = require('./slack_message').SlackMessage;
try {
    const payload = github.context.payload;
    const pr = payload.pull_request;
    console.log(`Event Trigger : ${github.context.event_name}`)
    var slack_message = new SlackMessage(core.getInput("username"), core.getInput("slack_webhook"), `#${core.getInput("channel")}`)
    if(core.getInput("message").length > 0)
        slack_message.create_message(core.getInput("message_title"), core.getInput("message"))
    else if (pr) {
        pr_title = `<${pr.html_url}|*#${pr.number}* ${pr.title}>`
        if(payload.review)
            slack_message.pr_message(payload.review.state, pr_title, `<${payload.review.user.url}|${payload.review.user.login}>`, payload.review.body)
        else if(payload.comment)
            slack_message.pr_message("comment", pr_title, `<${payload.comment.user.url}|${payload.comment.user.login}>`, payload.comment.body)
        else if(pr.state=="open")
            slack_message.pr_message("", pr_title, `<${pr.user.url}|${pr.user.login}>`, "")
    }
     
    console.log(`Sending payload to chanel #${core.getInput("channel")}`)
    console.log(`Payload:\n${slack_message.payload}`)
    request(slack_message.payload, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body) 
        }
     });
} catch (error) {
    console.log(error)
    //core.setFailed(error.message);
}
