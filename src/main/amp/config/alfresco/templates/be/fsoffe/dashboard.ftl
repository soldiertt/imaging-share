<#include "./imaging-template.ftl" />

<@templateHeader>
  <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/dashboard-min.css" />
</@>

<@templateBody>
<div id="doc3">
	<div>
		<@region id="imaging-header" scope="template" />
	</div>
	
	<div class="dashlet-left">
		<@region id="mytasks-dashlet" scope="template" />
	</div>
	 
	<div class="dashlet-left">   
		<@region id="workitem-dashlet" scope="template" />
	</div>
	
	<div class="dashlet-left">
		<@region id="mypersonal-dashlet" scope="template" />
	</div>
	    
	<div class="dashlet-left dashlet-wrapper">
		<@region id="myactivities-dashlet" scope="template" />
	</div>
</div>
</@>

<@templateFooter>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/fsoffe-min.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/dashlets-min.js"></script>
</@>