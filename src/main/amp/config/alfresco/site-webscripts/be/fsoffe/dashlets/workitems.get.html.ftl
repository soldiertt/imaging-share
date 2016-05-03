<div id="workitems-dashlet" class="dashlet">
	<div id="workitems-dashlet-title" class="title">${msg("title")} - ${workitems.documents?size} item(s)</div>
    <div id="workitems-dashlet-body" class="body">
		<table id="workitemstable">
			<thead>
				<tr>
					<th><img src="${absurl(url.context)}/res/imaging/img/wf-16.png" alt="In a workflow" /></th>
					<th>Document type</th>
					<th>Document name</th>
					<th>Linked</th>
				</tr>
			</thead>
			<tbody>
			<#list workitems.documents as document>
				<tr id="${document.nodeRef}">
					<td>
						<#if document.wficon?? >
							<img src="${absurl(url.context)}/res/imaging/img/${document.wficon}" alt="In a workflow" />
						</#if>
					</td>
					<td>${document.doctype}</td>
					<td>${document.name}</td>
					<td>${document.doclinked}</td>
				</tr>
			</#list>
			</tbody>
		</table>
    </div>
</div>
