function unique(arr) {
    var entry = {}, uniqArr = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!entry.hasOwnProperty(arr[i].id)) {
        	uniqArr.push(arr[i]);
            entry[arr[i].id] = 1;
        }
    }
    return uniqArr;
}

function main() {
	
	var json, pb;
	
	if (page.url.args.pbsessionid != null) {
		pb = true;
		var json = remote.call("/imaging/pb/readcontext?sessionid=" + page.url.args.pbsessionid);
		var pbcontext = eval("(" + json + ")");
		
		if (pbcontext.contextlist.length == 1) {
			model.sessionid = pbcontext.contextlist[0].sessionid;
			model.refdossier = pbcontext.contextlist[0].refdossier;
			model.employer = pbcontext.contextlist[0].employer;
			model.worker = pbcontext.contextlist[0].worker;
			model.person = pbcontext.contextlist[0].person;
			model.keyword1 = pbcontext.contextlist[0].keyword1;
			model.keyword2 = pbcontext.contextlist[0].keyword2;
		} else {
			model.sessionid = 0;
		}
	} else {
		pb = false;
		json = remote.call("/be/fsoffe/standardDataList.json?type=DocType");
		var doctypes = eval("(" + json + ")");
		model.doctypes = unique(doctypes.standardDataList);
		json = remote.call("/be/fsoffe/standardDataList.json?type=DocSource");
		var docsources = eval("(" + json + ")");
		model.docsources = unique(docsources.standardDataList);
	}
	
	model.pb = pb;
	
}

main();