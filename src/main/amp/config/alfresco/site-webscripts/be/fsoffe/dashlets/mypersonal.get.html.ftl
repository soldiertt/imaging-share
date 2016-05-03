<div id="mypersonal-dashlet" class="dashlet">
	<div id="mypersonal-dashlet-title" class="title">${msg("title")} - ${mypersonal.documents?size} item(s)</div>
    <div id="mypersonal-dashlet-body" class="body">
        <table id="mypersonaltable">
			<thead>
				<tr>
					<th>Document name</th>
					<th>Document type</th>
					<th>Type</th>
					<th>Source</th>
					<th>Expeditor</th>
					<th>Priority</th>
				</tr>
			</thead>
			<tbody>
			<#list mypersonal.documents as document>
				<tr id="${document.nodeRef}">
					<td>${document.name}</td>
					<td>${document.doctype}</td>
					<td>${document.myperstype}</td>
					<td>${document.docsource}</td>
					<td>${document.mypersexpeditor}</td>
					<td>${document.docpriority?cap_first}</td>
				</tr>
			</#list>
			</tbody>
		</table>
    </div>
</div>
