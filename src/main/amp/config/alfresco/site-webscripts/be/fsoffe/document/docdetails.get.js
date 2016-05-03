function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	var nodeRef = args.nodeRef;
	var viewtype = args.viewtype;
	if (viewtype == null) {
		viewtype = "main";
	}
	model.viewtype = viewtype;
	model.readonlymsg = "";
	
	var displayname = "",
		icon,
		json,
		jsonAllow,
		obj,
		objAllow;
	
	if (nodeRef != null) {
		
		if (viewtype == "main") {
			
			json = remote.call("/imaging/document/docdetails?nodeRef=" + nodeRef);
			obj = eval("(" + json + ")");
			if (json.status == 200) {
				displayname = obj.docdetails.name;
				icon = obj.docdetails.icon;
			} else {
				statusError(obj);
				return;
			}
			
			jsonAllow = remote.call("/imaging/document/allowedit?nodeRef=" + nodeRef);
			objAllow = eval("(" + jsonAllow + ")");
			if (jsonAllow.status != 200) {
				statusError(objAllow);
				return;
			}
			
		} else {
			
			var fdsDocument = null;
			json = remote.call("/imaging/document/parentdoc?nodeRef=" + nodeRef);
			obj = eval("(" + json + ")");
			if (json.status == 200) {
				fdsDocument = obj.docinfo.nodeRef;
			} else {
				statusError(obj);
				return;
			}
			
			jsonAllow = remote.call("/imaging/document/allowedit?nodeRef=" + fdsDocument);
			objAllow = eval("(" + jsonAllow + ")");
			if (jsonAllow.status != 200) {
				statusError(objAllow);
				return;
			}
			
			json = remote.call("/imaging/document/docdetails?nodeRef=" + fdsDocument);
			obj = eval("(" + json + ")");
			if (json.status == 200) {
				displayname = obj.docdetails.name;
			} else {
				statusError(obj);
				return;
			}
			
			displayname += " - ";
			json = remote.call("/imaging/document/docdetails?nodeRef=" + nodeRef);
			obj = eval("(" + json + ")");
			if (json.status == 200) {
				displayname += obj.docdetails.name;
			} else {
				statusError(obj);
				return;
			}
		}
		
		model.displayname = displayname;
		model.icon = icon;
		model.allowedit = objAllow.allowedit;

		if (objAllow.allowedit === "false") {
			if (objAllow.hasaspectworkitem === "true") {
				model.readonlymsg = "(Read-only mode - locked by '" + objAllow.itemowner + "')";
			} else if (objAllow.hasaspectmypersonal === "true") {
				model.readonlymsg = "(Read-only mode - assigned to '" + objAllow.mypersassignee + "')";
			} else {
				model.readonlymsg = "(Read-only mode)";
			}
		}
			
	} else {
		statusError({"status":{"code":400},"message":"Bad request : missing required 'nodeRef' parameter !"});
		return;
	}
}

main();