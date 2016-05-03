function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function main() {
	
	var dateRangeStart = args.dateRangeStart;
	var dateRangeEnd = args.dateRangeEnd;
	var username = args.username;
	var bylettertype = args.byLetterType;
	
	var dNow = new Date();
    var curr_date = dNow.getDate();
    var curr_month = dNow.getMonth() + 1; //Months are zero based
    var curr_year = dNow.getFullYear();
    var nowStr = curr_date + "-" + curr_month + "-" + curr_year;
    
    if (!username) {
		username = user.id;
	}
    if (!bylettertype) {
		bylettertype = "false";
	}
	if (!dateRangeStart) {
		dateRangeStart = nowStr;
	}
	if (!dateRangeEnd) {
		dateRangeEnd = nowStr;
	}
	model.username = username;
	model.dateRangeStart = dateRangeStart;
	model.dateRangeEnd = dateRangeEnd;
	model.bylettertype = bylettertype;
	
	var json = remote.call("/imaging/dashboard/myactivities?username=" + username + "&dateRangeStart=" + dateRangeStart + "&dateRangeEnd=" + dateRangeEnd + "&byLetterType=" + bylettertype);
	var obj = eval("(" + json + ")");
	if (json.status == 200) {
		model.myactivities = obj;
	} else {
		statusError(obj);
		return;
	}
}

main();