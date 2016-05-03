/**
 * Main entry point for component webscript logic
 * 
 * @method main
 */
function main() {
	
	var action = args.action, 
		method = args.method, 
		conn = remote.connect("alfresco"),
		errormessage = "",
		jsonObj,
		erroroccurs = false;
    logger.log("multi-action :" + action + "/" + method);
        
	model.actionstatus = "OK";
	
	for (argNodeRef in argsM) {
		if (argNodeRef == "noderefs[]") {
			for each (nodeRef in argsM[argNodeRef]) {
				var jsonResp = null;
				logger.log("ref :" + nodeRef);
				if (method == "POST") {
					jsonBody = {};
					for (arg in args) {
						if (arg != "action" && arg != "noderefs[]" && arg != "method") {
							jsonBody[arg] = args[arg];
							logger.log("data: '" + arg + "' value '" + args[arg] + "'");
						}
					}
					jsonBody.nodeRef = nodeRef;
					var jsonString = jsonUtils.toJSONString(jsonBody);
					jsonResp = conn.post("/imaging/action/" + action, jsonString,
						"application/json");
				} else {
					jsonResp = conn.get("/imaging/action/" + action + "?nodeRef=" + nodeRef);
				}

				if (jsonResp.status == 200) {
					jsonObj = eval("(" + jsonResp + ")");
					if (jsonObj.actionstatus === "NOK") {
						errormessage += "<br/>" + jsonObj.errormessage;
						erroroccurs = true;
					}
				} else {
					erroroccurs = true;
				}
				
			}
		}
	}

	if (erroroccurs) {
		model.actionstatus = "NOK";
		model.errormessage = "Not all actions were successfully executed." + errormessage + "<br/>Please retry or contact ICT Team if error persists.";
	}
	
}

main();