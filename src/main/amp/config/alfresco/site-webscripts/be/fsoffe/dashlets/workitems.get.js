function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	//Get WorkItems
	var json = remote.call("/imaging/dashboard/myworkitems");
	var obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.workitems = obj;
	} else {
		statusError(obj);
		return;
	}
}

main();