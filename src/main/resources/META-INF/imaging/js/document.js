$(function() {
	
	$("#doc-tabs").tabs({
		  collapsible: true,
		  active: false
	});

	var nodeRef = Imaging.utils.getURLParameter("nodeRef"),
		pbsessionid = Imaging.utils.getURLParameter("pbsessionid"),
		manageAutoform = function(jsonResponse, nodeRef) {
			if (jsonResponse.prefValue === "true") {
				Imaging.callbackMgr().executeCallback("editmetadata", nodeRef);
			}
		},
		manageAutoSaveAnnot = function(jsonResponse) {
			window.annotationautosave = (jsonResponse.prefValue === "true");
		};
		
	Imaging.boxes.refreshImportsAndNotes(nodeRef)
	Imaging.action.insertActions(nodeRef, "viewer", $("#doc-actions"));
	
	// Manage actions behaviour only once, when all actions are loaded
    $(document).unbind();
    $(document).ajaxComplete(function( event, xhr, settings ) { 
        if (settings.url.indexOf("renderdocactions") != -1) { 
			Imaging.action.manageActionsEvents(false); 
        } 
    }); 
    
	Imaging.utils.getUserPref("autoform", function(jsonResponse) { manageAutoform(jsonResponse, nodeRef); } );
	
	Imaging.utils.getUserPref("annotationautosave", manageAutoSaveAnnot);	
	
	 //Change window title with doc name
	 document.title = document.title.replace("Imaging document",$("#viewer-header h1").text());
	 
	 //Save window last position and size to restore it the same way
	 $(window).on('beforeunload', function() {
		 
		 $.jStorage.set("viewerPosition", {user: $("#userid").text(), scX: window.screenX, scY: window.screenY, winH: $(window).height(), winW: $(window).width() + 14});
		 // AUTO-RELEASE ON CLOSE - for PBI automatically closed viewers !!
		 if (pbsessionid != "null") {
			 var restoreAsync = function() {
			 	 $.ajaxSetup({
			       async: true
			     });
			 }
 			 // Synchronous to permit execution when window is closed !!
			 $.ajaxSetup({
			 	 async: false
			 });
			 
			 Imaging.action.runWebscriptAction("releaseoptional", false, nodeRef, restoreAsync);
		 }
	 });
});

	
window.viewonehandler = function(id, text) { 
	
	var nodeRef,
		pbsessionid,
		annotationLabel,
		strAnnotProperties,
		jsonData;
	
	if (id === 30) { //User create an annotation
		
		annotationLabel = text.toLowerCase();
		//strAnnotProperties = ViewONE.getAnnotation(annotationLabel);
		
		//if (strAnnotProperties.indexOf("TYPE = [TEXT]") == 0 && (annotationLabel.indexOf("stamp") == 0 || annotationLabel.indexOf("tampon") == 0 || annotationLabel.indexOf("stempel") == 0)) {
		//	ViewONE.modifyAnnotation(annotationLabel, "owner=admin");
		//	nodeRef = Imaging.utils.getURLParameter("nodeRef");	
		//	jsonData = {nodeRef: nodeRef};
			
		//	Imaging.ajax.postJson(WS_URLS.stampAuditEvent, jsonData, function(){});
				
		//}
		
		if (window.annotationautosave && (annotationLabel.indexOf("arrow") === 0 || annotationLabel.indexOf("highlight") === 0 || annotationLabel.indexOf("flèche") === 0) || 
				annotationLabel.indexOf("surbrillance") === 0 || annotationLabel.indexOf("pijl") === 0 || annotationLabel.indexOf("markeren") === 0) {
			ViewONE.saveAnnotations(); 
		}
	}
	
	if (id === 66 || id === 67) {
		if (window.annotationautosave) {
			ViewONE.saveAnnotations(); 
		}
	}
} 
