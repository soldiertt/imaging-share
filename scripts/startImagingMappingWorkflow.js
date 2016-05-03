logger.log("----- Start Imaging Scanning Rule -----");
if (document.hasAspect("fds:mypersonal")) {
	logger.log("Error : document already have fds:mypersonal aspect applied !");
	var dossierCreated = document.properties["cm:created"];
	var destYear = dossierCreated.getFullYear();
	var destMonth = dossierCreated.getMonth();
	var destDay = dossierCreated.getDate();
	var repoPath = imaging.getConstant("finalPath") + "/" + destYear + "/" + destMonth + "/" + destDay;
	logger.log("Moving the document back to repository : " + repoPath);
	document.move(createDestinationPath(repoPath));
} else {
	logger.log("----- Start Imaging Mapping Workflow -----");
	var workflow = actions.create("start-workflow"); 
	workflow.parameters.workflowName = "activiti$imagingMappingWorkflow"; 
	workflow.parameters["bpm:workflowDescription"] = document.name; 
	workflow.parameters["sendEMailNotifications"] = false; 
	workflow.execute(document);
}

function createDestinationPath(repoPath) {
	var folders = repoPath.split("/");
	var storagePathNode = companyhome.childByNamePath(folders[0]);
	var currentPathNode = storagePathNode;
	var tempPathNode;
	for (var i=1; i < folders.length; i++) {
		tempPathNode = currentPathNode.childByNamePath(folders[i]);
		if (tempPathNode == null && folders[i] != "Imaging" && folders[i] != "documentLibrary") {
			currentPathNode = currentPathNode.createNode(folders[i], "fds:folder");
		} else {
			currentPathNode = tempPathNode;
		}
	}
	return currentPathNode;
}