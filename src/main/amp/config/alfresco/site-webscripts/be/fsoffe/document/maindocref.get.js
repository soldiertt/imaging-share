function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

/**
 * Main entry point for component webscript logic
 *
 * @method main
 */
function main()
{
   // Check mandatory parameters
   var parentNodeRef = args.nodeRef;
   if (parentNodeRef == null || parentNodeRef.length == 0) {
	   statusError({"status":{"code":400},"message":"Bad request : missing required 'nodeRef' parameter !"});
	   return;
   } else {
  
	   var nodeRef="";
	   var jsonReal = remote.call("/imaging/document/realdocref?nodeRef=" + parentNodeRef);
	   var obj = eval("(" + jsonReal + ")");
	   if (jsonReal.status == 200) {
		   model.response = jsonReal;
	   } else {
		   statusError(obj);
		   return;
	   }
   }
}

main();