function main()
{
  var pdfNodeRef = args.nodeRef;
  var result = remote.call("/isreadonly");
  
  /** FSOFFE - ADD PERMISSIONS CHECK **/
  var imagingDocRef = args.docRef;
  var jsonResp = remote.call("/imaging/utils/isinmyworkitem?nodeRef=" + imagingDocRef);
  var jsonObj = eval("(" + jsonResp + ")");
  model.isReadOnly = (result.status == 200 && result == "true") || jsonObj.isinmyworkitem === "no";
  
  var url = "/api/node/workspace/SpacesStore/" + pdfNodeRef.split('/')[3] + "/comments?reverse=true";
  var commentsResp = remote.call(url);
  jsonObj = eval("(" + commentsResp + ")");
  model.comments = jsonObj.items; 
}

main();
