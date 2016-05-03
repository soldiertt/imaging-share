<div id="mytasks-dashlet" class="dashlet">
	<div id="mytasks-dashlet-title" class="title">${msg("title")} - ${mytasks.documents?size} item(s)</div>
    <div id="mytasks-dashlet-body" class="body">
        <table id="taskstable">
			<thead>
				<tr>
					<th>Document name</th>
					<th>Document type</th>
					<th>Source</th>
					<th>Expeditor</th>
					<th>Inbox</th>
					<th>Linked</th>
				</tr>
			</thead>
			<tbody>
			<#list mytasks.documents as task>
				<tr id="${task.nodeRef}">
					<td>${task.name}</td>
					<td>${task.doctype}</td>
					<td>${task.docsource}</td>
					<td>${task.workexpeditor}</td>
					<td>${task.inbox}</td>
					<td>${task.doclinked}</td>
				</tr>
			</#list>
			</tbody>
		</table>
    </div>
</div>
