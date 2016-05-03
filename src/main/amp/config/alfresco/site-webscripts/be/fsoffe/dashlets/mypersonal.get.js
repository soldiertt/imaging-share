function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	
	//get assigned tasks (documents)
	var json = remote.call("/imaging/boxes/mypersonal");
	var obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.mypersonal = obj;
	} else {
		statusError(obj);
		return;
	}
	
}

main();