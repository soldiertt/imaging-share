<#include "./imaging-template.ftl" />

<@templateHeader>
  <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/dashboard-min.css" />
</@>

<@templateBody>
<div id="doc3">
	<div>
		<@region id="imaging-header" scope="template" />
	</div>
	
	<div class="dash-table">
		<div class="column-left">
			<div class="dashlet-wrapper">
				<@region id="mytasks-dashlet" scope="template" />
			</div>
			<div class="dashlet-wrapper">
				<@region id="mypersonal-dashlet" scope="template" />
			</div>
		</div>
		
		<div class="column-right">
			<div class="dashlet-wrapper">   
				<@region id="workitem-dashlet" scope="template" />
			</div>
			<div class="dashlet-wrapper">
				<@region id="myactivities-dashlet" scope="template" />
			</div>
		</div>
	</div>
</div>
</@>

<@templateFooter>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/fsoffe-min.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/dashlets-min.js"></script>
</@>