function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {

	//Is user a service leader
	var json = remote.call("/imaging/user/servicelead");
	obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.servicelead = obj.servicelead;
	} else {
		statusError(obj);
		return;
	}
}

main();