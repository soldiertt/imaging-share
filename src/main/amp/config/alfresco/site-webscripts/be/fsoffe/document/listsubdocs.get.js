function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	var nodeRef = args.nodeRef;
	
	if (nodeRef != null) {
		var json = remote.call("/imaging/document/listsubdocs?nodeRef=" + nodeRef + "&type=imports");
		var obj = eval("(" + json + ")");
		if (json.status == 200) {
			model.result = obj;
		} else {
			statusError(obj);
			return;
		}
		
	} else {
		statusError({"status":{"code":400},"message":"Bad request : missing required 'nodeRef' parameter !"});
		return;
	}
}

main();