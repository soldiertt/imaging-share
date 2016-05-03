function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	
	var nodeRef = args.nodeRef,
		json = remote.call("/imaging/user/allusers"),
		obj = eval("(" + json + ")");
	
	if (json.status == 200) {
		model.result = obj;
		model.priorities = getDocPriorities();
		if (model.priorities.hasOwnProperty("status")) {
			statusError(model.priorities);
			return;
		}
		model.document = getDocumentProperties(nodeRef);
		if (model.document.hasOwnProperty("status")) {
			statusError(model.document);
			return;
		} else {
			model.document = model.document.document;
		}
	} else {
		statusError(obj);
		return;
	}
	
}

function getDocPriorities() {
	var json = remote.call("/be/fsoffe/standardDataList.json?type=DocPriority");
	return eval("(" + json + ")");
}

function getDocumentProperties(nodeRef) {
	var json = remote.call("/imaging/documents/indexForm?nodeRef="+nodeRef);
	return eval("(" + json + ")");
}


main();