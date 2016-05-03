function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function statusManagedError(message) {
	status.code = 500;
	status.message = message;
	status.redirect = true;
}

function main() {
	var json, obj, pb, search = args.search;
	
	if (search != null) {
		pb = false;
	} else {
		pb = page.url.args.pbsessionid != null;
	}
	
	if (pb) {
		json = remote.call("/imaging/pb/list?sessionid=" + page.url.args.pbsessionid);
		obj = eval("(" + json + ")"); 
	} else {
		var docname = args.docname,
			doctype = args.doctype,
			docsource = args.docsource,
			doclinked = args.doclinked,
			doccreationdate_start = args["doccreationdate-start"],
			doccreationdate_end = args["doccreationdate-end"],
			fulltext1 = args.fulltext1,
			fulltext2 = args.fulltext2,
			operator1 = args.operator1,
			dossiernr = args.dossiernr,
		
		json = remote.call("/imaging/search/search?"
				+ "search=" + search
				+ "&docname=" + encodeURIComponent(docname)
				+ "&doctype=" + encodeURIComponent(doctype)
				+ "&docsource=" + encodeURIComponent(docsource)
				+ "&doclinked=" + doclinked
				+ "&doccreationdate-start=" + encodeURIComponent(doccreationdate_start)
				+ "&doccreationdate-end=" + encodeURIComponent(doccreationdate_end)
				+ "&dossiernr=" + encodeURIComponent(dossiernr)
				+ "&fulltext1=" + encodeURIComponent(fulltext1)
				+ "&fulltext2=" + encodeURIComponent(fulltext2)
				+ "&operator1=" + operator1
				);
		obj = eval("(" + json + ")"); 
	}
	
    if (json.status == 200) {
    	if (typeof obj.error == "undefined" || obj.error == "") {
    		model.result = obj; 
    	} else {
    		statusManagedError(obj.error);
    		return;
    	}
    } else { 
    	statusError(obj);
    	return;
    } 
}

main();