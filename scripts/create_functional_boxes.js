var dropzoneFolder = companyhome.childByNamePath(imaging.getConstant("dropzoneFolderName"));
if (dropzoneFolder == null && companyhome.hasPermission("CreateChildren")) {
  dropzoneFolder = companyhome.createNode(imaging.getConstant("dropzoneFolderName"),"fds:folder");
  dropzoneFolder.setInheritsPermissions(false);
  logger.log("'" + imaging.getConstant("dropzoneFolderName") + "' folder created, only admin access");
} else {
  logger.log("'" + imaging.getConstant("dropzoneFolderName") + "' folder already exists");
}

// This folder must be imported with containing rule
var entryFolder = companyhome.childByNamePath(imaging.getConstant("workflowEntryFolderName"));
if (entryFolder != null) {
  entryFolder.setInheritsPermissions(false);
  logger.log("'" + imaging.getConstant("workflowEntryFolderName") + "' folder already exists");
} else {
  logger.log("Error : '" + imaging.getConstant("workflowEntryFolderName") + "' folder does not exists");
}

//This folder must be imported with containing rule
var autotrashFolder = companyhome.childByNamePath(imaging.getConstant("autoTrashFolderName"));
if (autotrashFolder != null) {
  autotrashFolder.setInheritsPermissions(false);
  autotrashFolder.setPermission("Collaborator");
  logger.log("'" + imaging.getConstant("autoTrashFolderName") + "' folder already exists");
} else {
  logger.log("Error : '" + imaging.getConstant("autoTrashFolderName") + "' folder does not exists");
}

var failureFolder = companyhome.childByNamePath(imaging.getConstant("failureFolderName"));
if (failureFolder == null && companyhome.hasPermission("CreateChildren")) {
  failureFolder = companyhome.createNode(imaging.getConstant("failureFolderName"),"fds:folder");
  failureFolder.setInheritsPermissions(false);
  logger.log("'" + imaging.getConstant("failureFolderName") + "' folder created, admin access only");
} else {
  logger.log("'" + imaging.getConstant("failureFolderName") + "' folder already exists");
}

var imagingSiteLib = companyhome.childByNamePath(imaging.getConstant("imagingDocLibPath"));
if (imagingSiteLib != null) {
	var repoFolder = imagingSiteLib.childByNamePath(imaging.getConstant("repoFolderName"));
	if (repoFolder == null && imagingSiteLib.hasPermission("CreateChildren")) {
	  repoFolder = imagingSiteLib.createNode(imaging.getConstant("repoFolderName"),"fds:folder");
	  repoFolder.setInheritsPermissions(false);
	  repoFolder.setPermission("Collaborator");
	  logger.log("'Final' folder created, everyone is Collaborator");
	} else {
	  logger.log("'Final' folder already exists");
	}
	
	var boxesFolder = imagingSiteLib.childByNamePath(imaging.getConstant("boxesFolderName"));
	if (boxesFolder == null && imagingSiteLib.hasPermission("CreateChildren")) {
	  boxesFolder = imagingSiteLib.createNode(imaging.getConstant("boxesFolderName"),"fds:folder");
	  logger.log("'Boxes' folder created, everyone is Consumer");
	} else {
	  logger.log("'Boxes' folder already exists");
	}
	
	var docquery = "select e.fds:stateBoxe, e.fds:idBoxe, e.fds:libBoxe from fds:boxesDataList as e WHERE e.fds:idBoxe NOT in ('NONE','EXIT')";

	var def = {
		query : docquery,
	    language : "cmis-alfresco"
	};

	var results = search.query(def);
	if (results != null) {
		logger.log("Found " + results.length + " boxes.");
		for (var i = 0; i < results.length; i++) {
			var boxFolder = boxesFolder.childByNamePath(results[i].properties["fds:libBoxe"]);
	        if (boxFolder == null && boxesFolder.hasPermission("CreateChildren")) {
	        	// create the folder for the first time
	        	boxFolder = boxesFolder.createNode(results[i].properties["fds:libBoxe"],"fds:folder");
	        	//boxFolder.setInheritsPermissions(false);
	        	var authGroup = people.getGroup("GROUP_IMG-" + results[i].properties["fds:libBoxe"]);
	        	if (authGroup != null) {
	        		boxFolder.setPermission("Collaborator", authGroup.properties["cm:authorityName"]);
	        	} else {
	        		logger.log("Cannot find any group with name : IMG-" + results[i].properties["fds:libBoxe"]);
	        	}
	        	logger.log("Box created : " + results[i].properties["fds:libBoxe"]);
	        } else {
	          logger.log("Box already exists : " + results[i].properties["fds:libBoxe"]);
	        }
		}
	}
} else {
	logger.log("Error : path 'Sites/imaging/documentLibrary' does not exists");
}
