function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}


function main() {
	var json = remote.call("/imaging/boxes/listboxes");
	var obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.result = obj;
	} else {
		statusError(obj);
		return;
	}
	
	//Get WorkItems count
	json = remote.call("/imaging/dashboard/myworkitems");
	obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.workitemscount = obj.documents.length;
	} else {
		statusError(obj);
		return;
	}
	
	//Get MyPersonal count
	json = remote.call("/imaging/boxes/mypersonal");
	obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.mypersonalcount = obj.documents.length;
	} else {
		statusError(obj);
		return;
	}
	
	//Is user a service leader
	json = remote.call("/imaging/user/servicelead");
	obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.servicelead = obj.servicelead;
	} else {
		statusError(obj);
		return;
	}
	
}

main();