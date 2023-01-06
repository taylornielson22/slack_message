
const core = require("@actions/core");
const { exec } = require("child_process");
const json_payload = {
    uri: "",
    headers: {'content-type' : 'application/json'},
    method: 'POST',
    json: {
        "channel": "",
        "username": "",
        "text": "",
    }}
const attachment = [{
    fallback:"",
    pretext:"",
    color:"#65c8f0",
    fields:[{
        value:"",
        short:false 
    }]}]


class SlackMessage
{
    constructor(username, webhook, channel)
    {
        this.payload = json_payload
        this.payload.json.username = username
        this.payload.uri = webhook
        this.payload.json.channel = channel
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

    pr_message(state, pr_title, user, body) {
	    switch(state){
	        case "approved":
                this.create_message("",`PR ${pr_title} was approved by ${user}! :cool-dog:`)
		        break;
            case "changes_requested":
            	this.create_message(`${user} requested changes on PR ${pr_title}`, body)
		        break;
	        case "commented":
	            this.create_message(`${user} left a comment on PR ${pr_title}`, body)
	            break;
	        default:
	            this.create_message(":rocket: New PR ready for review! :rocket:", `${pr_title} submitted by ${user} is ready for review`)
		        attachment[0].color = "#D00000"	
	    }
   }

   send_message() {
	    var json_payload = JSON.stringify(this.payload.json)
	    exec(`curl -X POST ${this.payload.uri} -H "Content-Type: application/json" --data '${json_payload}'`, (error, stdout, stderr) => {
    	    	if (error)
        	    core.setFailed(error);
    	    	else if (stderr)
        	    core.setFailed(`stderr: ${stderr}`);
    	    	else
        	    console.log(`stdout:\n${stdout}`);
	    });
   }
}

module.exports = {
    SlackMessage
}
