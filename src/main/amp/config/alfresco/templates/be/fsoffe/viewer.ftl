<#include "./imaging-template.ftl" />

<@templateHeader>
  <meta http-equiv="Cache-Control" content="no-store"></meta>
  <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/viewer-min.css" />
</@>

<@templateBody>
    
    <@region id="document-details" scope="template" />
	<@region id="web-preview" scope="template" />
	
</@>

<@templateFooter>
   <script type="text/javascript" src="${page.url.context}/v1files/viewone.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/viewer-min.js"></script>
</@>