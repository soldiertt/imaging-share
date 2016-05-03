var spacename = document.properties["cm:name"],
	source = document.properties["fds:docSource"],
	inDate = document.properties["fds:docInDate"],
	lastdigits = "";

logger.log("spacename : " + spacename);
logger.log("source : " + source);
logger.log("inDate : " + inDate);


/* GENERATE DATE TIME STRING */
var year = inDate.getFullYear(),
	month = inDate.getMonth() + 1, // beware: January = 0; February = 1, etc.
	day = inDate.getDate(),
	hour = inDate.getHours(),
	minute = inDate.getMinutes(),
	second = inDate.getSeconds();

var finalDate = year + ("0" + month).slice(-2) + ("0" + day).slice(-2) + ("0" + hour).slice(-2) + ("0" + minute).slice(-2) + ("0" + second).slice(-2);

logger.log("finalDate : " + finalDate);
	
/* GENERATE SOURCE TRIGRAM */
var trigram = "NON";
if (source == "upload") {
	trigram = "UPD";
} else if (source == "scanner") {
	trigram = "SCN";
} else if (source == "mail") {
	trigram = "EML";
} else if (source == "printer") {
	trigram = "PRN";
}

logger.log("trigram: " + trigram);

/* GENERATE LAST 3 DIGITS */
if (spacename.length > 2) {
	lastdigits = spacename.substr(spacename.length - 3);
} else {
	lastdigits = spacename;
}
lastdigits = utils.pad(lastdigits, 3);

logger.log("lastDigits : " + lastdigits);

/* GENERATE FINAL NAME */
var finalName = finalDate + trigram + lastdigits;
logger.log("final name : " + finalName);
document.properties["cm:name"]=finalName;
document.save();

/* PROCESS CHILDREN */
var docchildren = document.children;
var childName, childExt, lastDotIndex, underscoreIndex, importsToKeep = [];
for (var i=0; i<docchildren.length; i++) {
	childName = docchildren[i].properties["cm:name"];
	lastDotIndex = childName.lastIndexOf(".");
	underscoreIndex = childName.indexOf("_");
	if (lastDotIndex != -1 && lastDotIndex != childName.length - 1) {
		childExt = childName.substr(lastDotIndex+1).toLowerCase();
	} else {
		childExt = "";
	}
	if (underscoreIndex != -1 ) { //This is an import
		if (childExt == "xls" || childExt == "xlsx") {
			importsToKeep.push(docchildren[i]); //Keep xl files
		} else {
			docchildren[i].remove(); // Remove other imports
		}
	}
	logger.log("underscoreIndex : " + underscoreIndex);
	logger.log("childExt : " + childExt);
	if (underscoreIndex == -1 && childExt == "pdf") { // This is the main document
		docchildren[i].properties["cm:name"]=finalName + ".pdf";
		docchildren[i].save();
	}
}

if (importsToKeep.length > 0) {
	var importsFolder = document.createNode("imports", "fds:folder");
	for (var i=0; i<importsToKeep.length; i++) {
		importsToKeep[i].move(importsFolder);
	}
}

/* SEND DOCUMENT TO ENTRY */
document.move(companyhome.childByNamePath("Entry"));