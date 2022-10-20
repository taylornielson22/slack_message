
const core = require("@actions/core");

const json_payload = {
        uri: "",
        headers: {'content-type' : 'application/json'},
        method: 'POST',
        json: {
            "channel": "",
            "username": "",
            "text": "",
        }
}
const attachment = [
           {
              "fallback":"",
              "pretext":"",
              "color":"#D00000",
              "fields":[
                 {
                    "value":"",
                    "short":false
                 }
              ]
           }
        ]

class SlackMessage
{
    constructor(username, webhook, channel)
    {
        this.payload = json_payload
        this.payload.json.username = username
        this.payload.uri = webhook
        this.payload.json.channel = channel
    }

    pr_ready_message(pr_title, user) 
    {
        attachment[0].pretext = ":rocket: New PR ready for review! :rocket:"
        attachment[0].fallback = ":rocket: New PR ready for review! :rocket:"
        attachment[0].fields[0].value = `${pr_title} submitted by ${user} is ready for review`
        this.payload.json["attachments"]= attachment
        
	}

    pr_review_message(state, pr_title, review_user, body) 
    {
        if (state == "approved") 
            this.payload.json.text = `PR ${pr_title} was approved by ${review_user}! :heavy_check_mark:`
        else if (state == "changes_requested"){
            attachment[0].pretext = `${review_user} request changes on PR ${pr_title}`
            attachment[0].fields[0].value =  body
            this.payload.json["attachments"]= attachment
        }
	}
    pr_review_commemt_message(pr_title, comment_user, body){
        attachment[0].pretext = `${comment_user} has made a comment on PR ${pr_title}`
        attachment[0].fallback = `${comment_user} has made a comment on PR ${pr_title}`
        attachment[0].fields[0].value =  body
        this.payload.json["attachments"]= attachment

    }
    custom_message(title, message){
        if(title.length == 0)
            this.payload.json.text = message
        else{
            attachment[0].pretext = title
            attachment[0].fallback = title
            attachment[0].fields[0].value = message
            this.payload.json["attachments"]= attachment
        }
    }
}
	


module.exports = {
    SlackMessage
}

