<div id="actions-bar">
	<a href="#" class="multi" id="act-toworkitems" data-method="POST"><img src="${absurl(url.context)}/res/imaging/img/action/toworkitems-16.png" alt="To workitem" /><span>To workitem</span></a>
	<div class="boxright"><span>Search: <input type="search" name="searchterm" class="form-control" /></span><span id="boxinfo"></span></div>
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
			<th>Work owner</th>
			<th>Document type</th>
			<th>Type</th>
			<th>Document name</th>
			<th>Linked</th>
			<th>Assignee</th>
			<th>Priority</th>
			<th>Expeditor</th>
			<th>Entry time</th>
		</tr>
	</thead>
	<tbody>
	<#list result.documents as document>
		<tr id="${document.nodeRef}">
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
			<td>${document.itemowner}</td>
			<td class="colnowrap">${document.doctype}</td>
			<td>${document.myperstype}</td>
			<td class="colname">${document.name}</td>
			<td>${document.doclinked}</td>
			<td>${document.mypersassignee}</td>
			<td>${document.docpriority?cap_first}</td>
			<td>${document.mypersexpeditor}</td>
			<td>${document.mypersentrytime}</td>
		</tr>
	</#list>
	</tbody>
</table>