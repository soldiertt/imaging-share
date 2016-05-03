function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	//Get WorkItems
	json = remote.call("/imaging/dashboard/myworkitems");
	var obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.workitems = obj;
	} else {
		statusError(obj);
		return;
	}
	//Check if service client
	json = remote.call("/imaging/user/serviceclient");
	var obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.serviceclient = obj.serviceclient;
	} else {
		statusError(obj);
		return;
	}
}

main();