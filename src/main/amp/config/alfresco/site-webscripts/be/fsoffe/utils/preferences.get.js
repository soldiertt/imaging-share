function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	
	var json = remote.call("/imaging/user/userpref?prefName=autoview");
	var obj = eval("(" + json + ")");
	if (json.status == 200) { 
		model.autoview = obj.prefValue;
	} else {
		statusError(obj);
		return;
	}
	
	json = remote.call("/imaging/user/userpref?prefName=autoform");
	obj = eval("(" + json + ")");
	if (json.status == 200) { 
		model.autoform = obj.prefValue;
	} else {
		statusError(obj);
		return;
	}
	
	json = remote.call("/imaging/user/userpref?prefName=landingpage");
	obj = eval("(" + json + ")");
	if (json.status == 200) { 
		model.landingpage = obj.prefValue;
	} else {
		statusError(obj);
		return;
	}	
	
	json = remote.call("/imaging/user/userpref?prefName=annotationautosave");
	obj = eval("(" + json + ")");
	if (json.status == 200) { 
		model.annotationautosave = obj.prefValue;
	} else {
		statusError(obj);
		return;
	}	
	
	var landingOptions = [];
	landingOptions.push({ id: "dashboard", label: "Dashboard"});
	landingOptions.push({ id: "inbox", label: "Inbox"});
	landingOptions.push({ id: "workitem", label: "Workitem"});
	model.landingOptions = landingOptions;

}

main();