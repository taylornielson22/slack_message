
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


    pr_message(state, pr_title, user, body) 
    {
	switch(state){
	    case "approved":
                create_message("",`PR ${pr_title} was approved by ${user}! :heavy_check_mark:`)
		break;
            case "changes_requested":
            	create_message(`${user} requested changes on PR ${pr_title}`, body)
		break;
	    case "comment":
	        create_message(`${user} left a comment on PR ${pr_title}`, body)
	        break;
	    default:
	        create_message(":rocket: New PR ready for review! :rocket:", `${pr_title} submitted by ${user} is ready for review`)
			
	}
   }
    create_message(title, message){
        if(title.length == 0)
            this.payload.json.text = message
        else{
            attachment[0].pretext = title
            attachment[0].fields[0].value = message
            this.payload.json["attachments"]= attachment
        }
    }
}
	


module.exports = {
    SlackMessage
}

