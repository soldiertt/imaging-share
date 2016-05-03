<#include "./imaging-template.ftl" />

<@templateHeader>
  <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/search-min.css" />
</@>

<@templateBody>
<div id="doc3">
	<div>
		<@region id="imaging-header" scope="template" />
	</div>
	    
	 <@region id="search-form" scope="template" />
	    
	 <@region id="search-results" scope="template" />
</div>
</@>

<@templateFooter>
  <script type="text/javascript" src="${page.url.context}/res/imaging/js/fsoffe-min.js"></script>
  <script type="text/javascript" src="${page.url.context}/res/imaging/js/search-min.js"></script>
</@>