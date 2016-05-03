function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

function getBoxes(docType) {
	var json = remote.call("/be/fsoffe/boxesDataList");
	var boxList = eval("(" + json + ")");
	
	if (docType == "BRIEF/LETTRE CONTR") {
		boxList.boxesDataList.push({lib:"MY PERSONAL", state:"true"});
	}
	return boxList;
}

function getKeywords() {
	var json = remote.call("/be/fsoffe/keywordsDataList.json?locale=" + locale);
	var obj = eval("(" + json + ")");
	return obj.keywordsDataList;
}

function getDocTypes() {
	var json = remote.call("/be/fsoffe/standardDataList.json?type=DocType");
	return eval("(" + json + ")");
}

function getDocLetterTypes() {
	var json = remote.call("/be/fsoffe/standardDataList.json?type=DocLetterType");
	return eval("(" + json + ")");
}

function getDocStatus() {
	var json = remote.call("/be/fsoffe/standardDataList.json?type=DocStatus");
	return eval("(" + json + ")");
}

function getDocPriorities() {
	var json = remote.call("/be/fsoffe/standardDataList.json?type=DocPriority");
	return eval("(" + json + ")");
}

function getDocumentProperties(nodeRef) {
	var json = remote.call("/imaging/documents/indexForm?nodeRef="+nodeRef);
	return eval("(" + json + ")");
}

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
	
	var formtype = args.formtype;
	var nodeRef = args.nodeRef;
	
	if (formtype == null) {
		formtype = "dialog";
	}
	model.formtype=formtype;
	model.result = getDocumentProperties(nodeRef);
	
	if (model.result.hasOwnProperty("status")) {
		statusError(model.result);
		return;
	}
	
	model.boxes = getBoxes(model.result.document.docType);
	
	if (model.boxes.hasOwnProperty("status")) {
		statusError(model.boxes);
		return;
	}
	
	var tmpDocTypes = getDocTypes();
	if (tmpDocTypes.hasOwnProperty("status")) {
		statusError(tmpDocTypes);
		return;
	} else {
		model.docTypes = unique(tmpDocTypes.standardDataList);
	}
	
	model.docLetterTypes = getDocLetterTypes();
	if (model.docLetterTypes.hasOwnProperty("status")) {
		statusError(model.docLetterTypes);
		return;
	}
	
	model.docStatus = getDocStatus();
	if (model.docStatus.hasOwnProperty("status")) {
		statusError(model.docStatus);
		return;
	}
	
	model.docPriorities = getDocPriorities();
	if (model.docPriorities.hasOwnProperty("status")) {
		statusError(model.docPriorities);
		return;
	}
	
	model.keywords = getKeywords();
	if (model.keywords.hasOwnProperty("status")) {
		statusError(model.keywords);
		return;
	}
	
}

main();