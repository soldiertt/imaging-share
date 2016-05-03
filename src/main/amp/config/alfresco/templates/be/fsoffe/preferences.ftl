<#include "./imaging-template.ftl" />

<@templateHeader>
  <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/preferences-min.css" />
</@>

<@templateBody>
<div id="doc3">
	<div>
		<@region id="imaging-header" scope="template" />
	</div>
	<@region id="preferences-form" scope="template" />
</div>    
</@>

<@templateFooter>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/fsoffe-min.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/preferences-min.js"></script>
</@>