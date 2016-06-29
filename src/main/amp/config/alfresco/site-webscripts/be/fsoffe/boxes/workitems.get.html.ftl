<div id="actions-bar">
	<a href="#" class="multi" id="act-release" data-method="POST"><img src="${absurl(url.context)}/res/imaging/img/action/release-16.png" alt="Release" /><span>Release</span></a> 
	<a href="#" class="multi" id="act-indexform"><img src="${absurl(url.context)}/res/imaging/img/action/editmetadata-16.png" alt="Form" /><span>Form</span></a>
	<a href="#" class="multi" id="act-sendtodefault" data-method="GET"><img src="${absurl(url.context)}/res/imaging/img/action/sendtodefault-16.png" alt="Send to default" /><span>Send to default</span></a>
	<div class="boxright"><span>Search: <input type="search" name="searchterm" class="form-control" /></span><span id="boxinfo"></span></div>
</div>
<#assign tblClass="notempty">
<#if workitems.documents?size == 0>
	<#assign tblClass="empty">
</#if>
<table class="${tblClass}">
	<thead>
		<tr>
			<th><input type="checkbox" id="rowscheck" /></th>
			<th></th>
			<th class="icon"><img src="${absurl(url.context)}/res/imaging/img/wf-16.png" alt="In a workflow" /></th>
			<th></th>
			<th>Document type</th>
			<th>Document name</th>
			<th>Linked</th>
			<th>Expeditor</th>
			<th>Source</th>
			<th>Status</th>
			<#if serviceclient == "true">
			<th>A/S</th>
			</#if>
			<th>Dossier Nr</th>
			<th>Inbox</th>
		</tr>
	</thead>
	<tbody>
	<#list workitems.documents as document>
		<tr id="${document.nodeRef}">
			<td>
				<input type="checkbox" name="rows" value="${document.nodeRef}" />
			</td>
			<td class="icon">
				<div class="actions">
					<img src="${absurl(url.context)}/res/imaging/img/contextmenu.png" alt="Actions" />
					<div class="action-menu" />
				</div>
			</td>
			<td class="icon">
				<#if document.wficon?? >
					<img src="${absurl(url.context)}/res/imaging/img/${document.wficon}" alt="In a workflow" />
				</#if>
			</td>
			<td class="icon"><img src="${absurl(url.context)}/res/imaging/img/preview-16.png" alt="Preview" class="preview" /></td>
			<td class="colnowrap">${document.doctype}</td>
			<td class="colname">${document.name}</td>
			<td>${document.doclinked}</td>
			<td>${document.workexpeditor}</td>
			<td>${document.docsource}</td>
			<td><#if document.docstatus??>${document.docstatus?c}</#if></td>
			<#if serviceclient == "true">
			<td>${document.doclettertype}</td>
			</#if>
			<td>${document.docdossiernr}</td>
			<td class="colnowrap">${document.inbox}</td>
		</tr>
	</#list>
	</tbody>
</table>