const core = require('@actions/core');
const github = require('@actions/github');
var request = require('request');
const SlackMessage = require('./slack_message').SlackMessage;
try {
     const payload = github.context.payload;
    // const review = payload.review;
     const pr = payload.pull_request;

    var slack_message = new SlackMessage(core.getInput("username"), core.getInput("slack_webhook"), `#${core.getInput("channel")}`)
    if(core.getInput("message").length > 0)
        slack_message.custom_message(core.getInput("message_title"), core.getInput("message"))
    else if (event_name.indexOf("pull_request") >= 0 && pr) {
        pr_title = `<${pr.html_url}|*#${pr.number}* ${pr.title}>`
        if(github.event_name == "pull_request" && pr.state=="open")
            slack_message.pr_ready_message(pr_title, `<${pr.user.url}|${pr.user.login}>`)
        else if(event_name == "pull_request_review")
            slack_message.pr_review_message(payload.review.state, pr_title, `<${payload.review.user.url}|${payload.review.user.login}>`)
        else if(event_name == "pull_request_review_comment")
                slack_message.pr_review_commemt_message(pr_title, `<${payload.comment.user.url}|${payload.comment.user.login}>`, payload.comment.body)
    }
    request(slack_message.payload(), function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body) 
        }
      });
} catch (error) {
    console.log(error)
    //core.setFailed(error.message);
}
