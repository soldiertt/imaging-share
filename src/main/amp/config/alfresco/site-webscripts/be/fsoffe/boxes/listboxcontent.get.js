function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() { 
    if (args.nodeRef != null && args.assignedtome != null && args.showworkitems != null) {
    	var boxname = args.boxname;
        var json = remote.call("/imaging/boxes/listboxcontent?nodeRef=" + args.nodeRef + "&assignedtome=" + args.assignedtome + "&showworkitems=" + args.showworkitems);
        var obj = eval("(" + json + ")"); 
        if (json.status == 200) { 
        	if (obj.boxname === "IDWG" || obj.boxname === "BRIEF-LETTRE-CONTR" || obj.boxname === "PREPENSION") {
        		model.viewmode = "calc";
        	} else if (obj.boxname === "ONDERZ-ENQ" || obj.boxname === "AFROMING-ECREMAGE" || obj.boxname === "DCD") {
        		model.viewmode = "extrapending";
        	} else if (obj.boxname === "BRIEF-LETTRE-CLIENT") {
        		model.viewmode = "briefclient";
        	} else {
        		model.viewmode = "classic";
        	} 
            model.assignedtome = args.assignedtome;
            model.showworkitems = args.showworkitems;
            model.result = obj; 
        } else { 
        	statusError(obj);
    		return;
        } 
          
    } else { 
    	statusError({"status":{"code":400},"message":"Bad request : missing required 'nodeRef' or 'assignedtome' !"});
		return;
    } 
} 
  
main();