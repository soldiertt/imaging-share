//IF NEED TO PERSIST DASHLET INFO
//var c = sitedata.getComponent(url.templateArgs.componentId);
//c.properties["dateRangeStartStr"] = dateRangeStart;
//c.properties["dateRangeEndStr"] = dateRangeEnd;
//c.properties["usernameStr"] = username;
//c.properties["bylettertypeStr"] = bylettertype;
//c.save();

var dateRangeStart = String(json.get("dateRangeStart"));
var dateRangeEnd = String(json.get("dateRangeEnd"));
var username = user.id;
if (json.has("username")) {
	username = String(json.get("username"));
}
var bylettertype = "false";
if (json.has("bylettertype")) {
	bylettertype = String(json.get("bylettertype"));
}

model.dateRangeStart = dateRangeStart;
model.dateRangeEnd = dateRangeEnd;
model.username = username;
model.bylettertype = bylettertype;

var json = remote.call("/imaging/dashboard/myactivities?username=" + username + "&dateRangeStart=" + dateRangeStart + "&dateRangeEnd=" + dateRangeEnd + "&byLetterType=" + bylettertype);
if (json.status == 200) {
	obj = eval("(" + json + ")");
	model.myactivities = obj;
} else {
	status.code = 500;
	status.message = "Process error : cannot retrieve my activities !";
	status.redirect = true;
}
