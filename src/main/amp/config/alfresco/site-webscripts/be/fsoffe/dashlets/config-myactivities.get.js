function main() {
	var beginDate = args.dateRangeStart;
	var endDate = args.dateRangeEnd;
	var byLetterType = args.byLetterType;
	
	model.beginDate = beginDate;
	model.endDate = endDate;
	model.byLetterType = byLetterType == "true";
	
	//Is user a service leader
	var json = remote.call("/imaging/user/servicelead");
	if (json.status == 200) {
		var obj = eval("(" + json + ")");
		model.servicelead = obj.servicelead;
		
		if (obj.servicelead === "true") {
			json = remote.call("/imaging/user/servicemembers");
			if (json.status == 200) {
				obj = eval("(" + json + ")");
				model.servicemembers = unique(obj.members).sort(function(a, b) {return a.displayname > b.displayname});
			}
		}
	} else {
		model.servicelead = "false";
	}
}

function unique(arr) {
    var hash = {}, result = [];
    for ( var i = 0; i < arr.length; i++ ) {
        if ( !hash.hasOwnProperty(arr[i].username) ) { //it works with objects! in FF, at least
            hash[ arr[i].username ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

main();