// Check mandatory parameters

var docNodeRef = args.noderef;
var returnStatus = "OK";

if (docNodeRef == null || docNodeRef.length == 0) {
	returnStatus = "Document not found";
} else {

	//EXTRA FSOFFE : check if permissions to save annotations !
	var jsonParentDoc = remote.call("/imaging/document/parentdoc?nodeRef=" + docNodeRef);
	if (jsonParentDoc.status == 200 && jsonParentDoc != null && jsonParentDoc.toString().trim().length() != 0) {
	   obj = eval("(" + jsonParentDoc + ")");
	   fdsDocument = obj.docinfo.nodeRef;
	   var jsonAllow = remote.call("/imaging/document/allowedit?nodeRef=" + fdsDocument);
	   if (jsonAllow.status == 200) {
		   var objAllow = eval("(" + jsonAllow + ")");
		   if (objAllow.allowedit != "true") {
			   returnStatus = "Document not in workitem !";
		   } else {
			   var numData = args.numdata;
				
				var paramsJSON = {};
				paramsJSON.noderef = docNodeRef;
				paramsJSON.numdata = numData;
				
				// Getting the string for the annotations.
				for ( var i = 1 ; i <= numData ; i++ ) {	
					paramsJSON["data0"+i] = args["data0"+i];
				}	
				
				var connector = remote.connect("alfresco");
				
				var result = connector.post("/daeja/annot/store", jsonUtils.toJSONString(paramsJSON), "application/json");	
				
				if (result.status != "OK") {
					 returnStatus = "Failed :: " + result.response;
				} else {	
					 returnStatus = result.response;
				}
		   }
	   } else {
		   status.code = 500;
		   status.message = "Unable to check if user is allowed to edit.";
		   status.redirect = true;
	   }
	}
		
}

model.status = returnStatus;