function main() {
	var pdfName = document.properties["cm:name"],
		docProperties = pdfName.split("_");
	
	/** ERROR : file name does not match expected pattern (PRN_18_20090201161925_jbourlet_132465_0.pdf) **/
	if (docProperties.length !== 6) {
		return "DROPZONE2 ERROR : Document has invalid name '" + pdfName + "' (moved to Failure) !";
	} 
	
	var	docSourceAbb = docProperties[0],
		docTypeTemp = docProperties[1],
		docDatePrefix = docProperties[2],
		docAssignee = docProperties[3],
		docDossierNr = docProperties[4],
		docQuestionId = docProperties[5], //extension will be removed later
		docSource="",
		docType="";
	
	docQuestionId = docQuestionId.substring(0, docQuestionId.length - 4); //Remove extension
	
	if (docAssignee == "0") {
		docAssignee = "";
	}
	
	if (docSourceAbb == "UPD") {
		docSource = "upload";
	} else if (docSourceAbb == "PRN") {
		docSource = "printer";
	}
	
	var docquery = "select e.fds:idParamStandard from fds:standardDataList as e WHERE e.fds:typeParamStandard='DocType'"
		+ " AND e.fds:techIdParamStandard=" + docTypeTemp;
	
	var def = {
			query : docquery,
			language : "cmis-alfresco"
	};
	
	var results = search.query(def);
	
	if (results != null && results.length == 1) {
		docType = results[0].properties["fds:idParamStandard"];
	}
	
	logger.log("docType : " + docType + " (" + docTypeTemp + ")");
	logger.log("source : " + docSource);
	logger.log("inDate : " + docDatePrefix);
	logger.log("assignee : " + docAssignee);
	logger.log("dossiernr : " + docDossierNr);
	logger.log("questionId : " + docQuestionId);
	
	var dateNow = new Date();
	var msSuffix = dateNow.getMilliseconds();
	
	var finalDocName = docDatePrefix + docSourceAbb + ("00" + msSuffix).slice(-3);
	
	logger.log("DROPZONE2 : finalDocName : " + finalDocName);
	
	/** ERROR : file content is empty **/
	if (document.properties.content.size === 0) {
		return "DROPZONE2 ERROR : Document " + finalDocName + " (" + pdfName + ") is empty (was moved to Failure) !";
	}
	/** ERROR : problem when archiving the pdf **/
	if (!imaging.signAndArchivePDF(document, finalDocName)) {
		return "DROPZONE2 ERROR : Document " + finalDocName + " (" + pdfName + ") cannot be archived (was moved to Failure) !";
	}
	
	var year = parseInt(docDatePrefix.substr(0,4)),
		month = parseInt(docDatePrefix.substr(4,2), 10)-1,
		day = parseInt(docDatePrefix.substr(6,2), 10),
		hour = parseInt(docDatePrefix.substr(8,2), 10),
		minute = parseInt(docDatePrefix.substr(10,2), 10),
		second = parseInt(docDatePrefix.substr(12,2), 10);
	
	var createProperties = new Array(4);
	createProperties["fds:docSource"] = docSource;
	createProperties["fds:docType"] = docType;
	createProperties["fds:docClass"] = "Dossier";
	createProperties["fds:docInDate"] = new Date(year, month, day, hour, minute, second);
	var newdoc = space.createNode(finalDocName, "fds:document", createProperties);
	
	document.move(newdoc);
	document.properties["cm:name"] = finalDocName + ".pdf";
	document.specializeType("fds:content");
	document.properties["fds:contentOrigin"] = "Internal";
	document.properties["cm:isIndexed"] = true;
	
	newdoc.addAspect("fds:archived");
	newdoc.properties["fds:archivedDate"] = new Date();
	newdoc.save()
	
	if (docTypeTemp == "22") { //Brief lettre GAAJ
		document.properties["cm:isContentIndexed"]=true;
	} else {
		document.properties["cm:isContentIndexed"]=false;
	}
	document.save();
	
	var jsonDoc = newdoc.createFile("workflow.json");
	if (jsonDoc != null) {
		jsonDoc.content += "{" + "\r\n" 
						+ "\"assignee\" : \"" + docAssignee + "\",\r\n"
						+ "\"dossiernr\" : \"" + docDossierNr + "\"\r\n"
						+ "}";
	}
	
	/** UPDATE ClientServer database if needed */
	if (docSource === "upload") {
		imaging.updateGroupAnswerOrVrgl(docTypeTemp, finalDocName, docQuestionId);
	}
	newdoc.move(companyhome.childByNamePath("Entry"));

}

function run(document) {
	var message = main(document);
	if (typeof message !== "undefined") {
		logger.log(message);
		document.name = document.name + (Math.floor((Math.random() * 1000) + 1));
		document.save()
		document.move(companyhome.childByNamePath("Failure"));
	}
}

run(document);