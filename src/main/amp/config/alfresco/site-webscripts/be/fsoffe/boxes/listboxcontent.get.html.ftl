<div id="actions-bar">
	<a href="#" id="act-assignedtome"><#if assignedtome="yes"><img src="${absurl(url.context)}/res/imaging/img/checked.png" alt="Assigned to me" /></#if><#if assignedtome="no"><img src="${absurl(url.context)}/res/imaging/img/unchecked.png" alt="Assigned to me" /></#if><span>Assigned to me</span></a>
	<a href="#" id="act-showworkitems"><#if showworkitems="yes"><img src="${absurl(url.context)}/res/imaging/img/checked.png" alt="Workitems" /></#if><#if showworkitems="no"><img src="${absurl(url.context)}/res/imaging/img/unchecked.png" alt="Workitems" /></#if><span>Show workitems</span></a>
	<a href="#" class="multi" id="act-toworkitems" data-method="POST"><img src="${absurl(url.context)}/res/imaging/img/action/toworkitems-16.png" alt="To workitem" /><span>To workitem</span></a>
	<span id="search-table">Search: <input type="search" name="searchterm" class="form-control" /></span>
</div>
<#assign tblClass="notempty">
<#if result.documents?size == 0>
	<#assign tblClass="empty">
</#if>
<table class="${tblClass}">
	<thead>
		<tr>
			<th><input type="checkbox" id="rowscheck" /></th>
			<th></th>
			<th></th>
			<th>Document type</th>
			<#if viewmode == "classic" || viewmode == "extrapending" || viewmode == "briefclient" >
				<th>Assignee</th>
				<th>Document name</th>
				<th>Linked</th>
				<th>Expeditor</th>
				<th>Source</th>
				<th>Status</th>
				<th>Dossier Nr</th>
			<#elseif viewmode == "calc">
				<th>Status</th>
				<th>Dossier Nr</th>
				<th>Document name</th>
				<th>Linked</th>
				<th>Assignee</th>
				<th>Source</th>
				<th>Expeditor</th>
			</#if>
			<th>Entry time</th>
			<#if viewmode == "briefclient">
				<th>A/S</th>
			</#if>
			<#if viewmode == "extrapending">
				<th class="icon"><img src="${absurl(url.context)}/res/imaging/img/pending-16.png" alt="Pending" /></th>
			</#if>
			<th>Work owner</th>
		</tr>
	</thead>
	<tbody>
	<#list result.documents as document>
		<#if document.wkmessage != "">
			<tr id="${document.nodeRef}" class="warning" data-warn-message="${document.wkmessage}">
		<#else>
			<tr id="${document.nodeRef}">
		</#if>
			<td>
				<#if !document.itemowner?has_content >
					<input type="checkbox" name="rows" value="${document.nodeRef}" />
				</#if>
			</td>
			<td class="icon">
				<div class="actions"> 
					<img src="${absurl(url.context)}/res/imaging/img/contextmenu.png" alt="Actions" />
					<div class="action-menu" />
				</div>
			</td>
			<td class="icon"><img src="${absurl(url.context)}/res/imaging/img/preview-16.png" alt="Preview" class="preview" /></td>
			<td class="colnowrap">${document.doctype}</td>
			
			<#if viewmode == "classic" || viewmode == "extrapending" || viewmode == "briefclient" >
				<td>${document.workassignee}</td>
				<td class="colname">${document.name}</td>
				<td>${document.doclinked}</td>
				<td>${document.workexpeditor}</td>
				<td>${document.docsource}</td>
				<td><#if document.docstatus??>${document.docstatus?c}</#if></td>
				<td>${document.docdossiernr}</td>
			<#elseif viewmode == "calc">
				<td><#if document.docstatus??>${document.docstatus?c}</#if></td>
				<td>${document.docdossiernr}</td>
				<td class="colname">${document.name}</td>
				<td>${document.doclinked}</td>
				<td>${document.workassignee}</td>
				<td>${document.docsource}</td>
				<td>${document.workexpeditor}</td>
			</#if>
			<td class="colnowrap">${document.workentrytime}</td>
			<#if viewmode == "briefclient">
				<td>${document.doclettertype}</td>
			</#if>
			<#if viewmode == "extrapending">
				<td class="icon">
				<#if document.workpending == "yes" >
					<img src="${absurl(url.context)}/res/imaging/img/pending-16.png" alt="Pending" />
				</#if>
				</td>
			</#if>
			<td>${document.itemowner}</td>
		</tr>
	</#list>
	</tbody>
</table>