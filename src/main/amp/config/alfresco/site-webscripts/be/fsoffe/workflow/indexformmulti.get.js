function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function getBoxes() {
	var json = remote.call("/be/fsoffe/boxesDataList");
	return eval("(" + json + ")");
}

function getUsers() {
	var json = remote.call("/imaging/user/allusers");
	return eval("(" + json + ")");
}

function main() {
	model.boxes = getBoxes();
	if (model.boxes.hasOwnProperty("status")) {
		statusError(model.boxes);
		return;
	}
	model.users = getUsers();
	if (model.users.hasOwnProperty("status")) {
		statusError(model.users);
		return;
	} else {
		model.users = model.users.allusers;
	}
}

main();