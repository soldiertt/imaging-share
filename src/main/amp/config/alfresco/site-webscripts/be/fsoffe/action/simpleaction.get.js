/**
 * Main entry point for component webscript logic
 *
 * @method main
 */
function main()
{
   // Check mandatory parameters
   var nodeRef = args.nodeRef;
   var action = args.action;
   var method = args.method;
   
   if (nodeRef == null || nodeRef.length == 0 || action == null || action.length == 0 || method == null || method.length == 0) {
	   model.response = jsonUtils.toJSONString({"status":{"code":400},"message":"Parameters 'nodeRef' , 'action' and 'method' are required."});
	   return;
   }

   var conn = remote.connect("alfresco");
   var jsonResp = null;
   if (method == "POST") {
	   var jsonBody={};
	   jsonBody.nodeRef = nodeRef;
	   var jsonString = jsonUtils.toJSONString(jsonBody);
	   jsonResp = conn.post("/imaging/action/" + action, jsonString, "application/json");
   } else {
	   jsonResp = conn.get("/imaging/action/" + action + "?nodeRef=" + nodeRef);
   }
 
   model.response = jsonResp;
   
}

main();