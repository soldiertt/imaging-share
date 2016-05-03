logger.log("----- Start Imaging Workflow -----");

var workflow = actions.create("start-workflow"); 
workflow.parameters.workflowName = "activiti$imagingWorkflow"; 
workflow.parameters["bpm:workflowDescription"] = document.name; 
workflow.parameters["sendEMailNotifications"] = false; 
workflow.execute(document);