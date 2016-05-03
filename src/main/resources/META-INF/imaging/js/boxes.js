$(function() {
    // CLICK ON A STANDARD BOX MENU ITEM 
    $("#left-menu li.normalbox").click(function(event) { 
    	Imaging.onClickBoxes.normalBoxClick($(this));
        event.preventDefault(); 
    }); 
    
    // CLICK ON MY WORK ITEMS - MY PERSONAL - OUTBOX
    $("#left-menu li#workitem, #left-menu li#mypersonal, #left-menu li#outbox, #left-menu li#admin").click(function(event) {
    	Imaging.onClickBoxes.specialBoxClick($(this), null);
        event.preventDefault(); 
    }); 
      
    // RENDER THE TABS (will be hidden at first load) 
    $("#doc-tabs").tabs(); 
    
    // SELECT THE APPROPRIATE BOX AFTER PAGE LOAD
    if (Imaging.utils.getURLParameter("box") == "inbox") {
    	//Check if need to locate a specific document
    	var nodeRef = Imaging.utils.getURLParameter("locate");
    	if (nodeRef !== "null") {
    		var locateDocument = function(jsonResponse) {
    			var boxid = jsonResponse.docdetails.parentboxid;
    			Imaging.onClickBoxes.normalBoxClick($("[id='" + boxid + "']"), nodeRef);
    		};
    		// Need parent box and name
    		Imaging.ajax.getJson(WS_URLS.docDetails, {nodeRef: nodeRef}, locateDocument);
    	} else {
    		// First Inbox
        	$("#left-menu li.normalbox:first").trigger("click");	
    	}
    } else if (Imaging.utils.getURLParameter("box") == "mypersonal") {
    	// My personal
    	$("#left-menu li#mypersonal").trigger("click");
    } else if (Imaging.utils.getURLParameter("box") == "admin") {
    	// Administration
    	$("#left-menu li#admin").trigger("click");
    } else {
    	// My workitem
    	$("#left-menu li#workitem").trigger("click");
    }
});