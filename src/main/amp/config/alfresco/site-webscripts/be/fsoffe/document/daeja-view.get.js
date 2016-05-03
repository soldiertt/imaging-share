function statusError(obj) {
	status.code = obj.status.code;
	status.message = obj.message;
	status.redirect = true;
}

/**
 * Main entry point for component webscript logic
 *
 * @method main
 */
function main()
{
	var obj, objAllow, json, jsonAllow, jsonReal, jsonParentDoc;
   var viewtype = args.viewtype;
   if (viewtype == null) {
	   viewtype = "main";
   }

   // Check mandatory parameters
   var parentNodeRef = args.nodeRef;
   if (parentNodeRef == null || parentNodeRef.length == 0) {
	   statusError({"status":{"code":400},"message":"Parameter 'nodeRef' is missing."});
	   return;
   }
   
   var nodeRef="";
   if (viewtype == "main") {
	   //EXTRA FSO-FFE : get real document node, the first document child of the folder
	   // Call repo : get first content child item
	   jsonAllow = remote.call("/imaging/document/allowedit?nodeRef=" + parentNodeRef);
	   objAllow = eval("(" + jsonAllow + ")");
	   if (jsonAllow.status == 200) {
		   model.allowedit = objAllow.allowedit;
	   } else {
		   statusError(objAllow);
		   return;
	   }
	  
	   jsonReal = remote.call("/imaging/document/realdocref?nodeRef=" + parentNodeRef);
	   obj = eval("(" + jsonReal + ")");
	   if (jsonReal.status == 200) {
		   nodeRef = obj.docinfo.nodeRef;
	   } else {
		   statusError(obj);
		   return;
	   }
   } else {
	   var fdsDocument = null;
	   nodeRef = parentNodeRef;
	   jsonParentDoc = remote.call("/imaging/document/parentdoc?nodeRef=" + nodeRef);
	   obj = eval("(" + jsonParentDoc + ")");
	   if (jsonParentDoc.status == 200) {
		   fdsDocument = obj.docinfo.nodeRef;
		   jsonAllow = remote.call("/imaging/document/allowedit?nodeRef=" + fdsDocument);
		   objAllow = eval("(" + jsonAllow + ")");
		   if (jsonAllow.status == 200) {
			   model.allowedit = objAllow.allowedit;
		   } else {
			   statusError(objAllow);
			   return;
		   }
	   } else {
		   statusError(obj);
		   return;
	   }
   }
   
   // Call repo for node's metadata
   json = remote.call("/daeja/annot/metadata?nodeRef=" + nodeRef);
   if (json.status == 200) {
      var node = {},
         n = eval('(' + json + ')');
         mcns = "{http://www.alfresco.org/model/content/1.0}",
         content = n.properties[mcns + "content"];
   
      // Call repo for available previews
      json = remote.call("/api/node/" + nodeRef.replace(":/", "") + "/content/thumbnaildefinitions");
      var previews =  eval('(' + json + ')');

      node.nodeRef = nodeRef;
      node.name = n.properties[mcns + "name"];
      node.icon = "/components/images/generic-file-32.png";
      node.mimeType = n.mimetype;
      node.previews = previews;
      if (content) {
         var size = content.substring(content.indexOf("size=") + 5);
         size = size.substring(0, size.indexOf("|"));
         node.size = size;
      } else {
         node.size = "0";
      }
      
	  if ( n.annotationNodeRef != null ) {
		node.annotationNodeRef = n.annotationNodeRef;
   		node.annotationName    = n.annotationName;   	
   	  }

      // Prepare the model
      model.node = node;
   }
   
}

// Start the webscript
main();