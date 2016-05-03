<div id="actions-bar">
	<a href="#" class="multi" id="act-toworkitems" data-method="POST"><img src="${absurl(url.context)}/res/imaging/img/action/toworkitems-16.png" alt="To workitem" /><span>To workitem</span></a>
	<span id="search-table">Search: <input type="search" name="searchterm" class="form-control" /></span>
</div>
<#assign tblClass="notempty">
<#if result.outboxes?size == 0>
	<#assign tblClass="empty">
</#if>
<table class="${tblClass}">
	<thead>
		<tr>
			<th><input type="checkbox" id="rowscheck" /></th>
			<th></th>
			<th>Document name</th>
			<th>Document type</th>
			<th>From</th>
			<th>To</th>
			<th>Sent Time</th>
		</tr>
	</thead>
	<tbody>
	<#list result.outboxes as document>
		<tr id="${document.nodeRef}">
			<td>
				<#if document.checkbox == "yes">
					<input type="checkbox" name="rows" value="${document.nodeRef}" />
				</#if>
			</td>
			<td class="icon"><img src="${absurl(url.context)}/res/imaging/img/preview-16.png" alt="Preview" class="preview" /></td>
			<td class="colname">${document.name}</td>
			<td class="colnowrap">${document.doctype}</td>
			<td>${document.from}</td>
			<#if document.to == "Workflow">
				<td>${document.inbox}</td>
			<#else>
				<td>${document.to}</td>
			</#if>
			<td class="colnowrap">${document.senttime}</td>
		</tr>
	</#list>
	</tbody>
</table>