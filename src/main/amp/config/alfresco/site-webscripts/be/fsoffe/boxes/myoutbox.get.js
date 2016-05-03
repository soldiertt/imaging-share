function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	var json = remote.call("/imaging/boxes/outbox");
	var obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.result = obj;
	} else {
		statusError(obj);
		return;
	}
}

main();