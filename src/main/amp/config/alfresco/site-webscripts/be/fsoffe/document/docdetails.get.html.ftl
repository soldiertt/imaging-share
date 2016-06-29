<div id="viewer-header">
	<span id="userid" class="hidden">${user.id}</span>
	<#if viewtype == "main"><img src="${absurl(url.context)}/res/imaging/img/${icon}" class="icon-location" alt="Location" /></#if>
	<h1>${displayname}</h1>
	<#if allowedit == "false"><h2 class="warning">${readonlymsg}</h2></#if>
	<div id="doc-actions"></div>
</div>