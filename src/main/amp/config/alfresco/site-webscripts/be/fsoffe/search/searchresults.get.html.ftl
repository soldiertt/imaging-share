<div id="search-results">
<#assign tblClass="notempty">
<#if result.documents?size == 0>
	<#assign tblClass="empty">
</#if>
<#if result.limited == "yes">
<div class="warning">Your search results reached the maximum results size, you may need to refine your search !</div> 
</#if>
<table class="${tblClass}">
	<thead>
		<tr>
			<th><img src="${absurl(url.context)}/res/imaging/img/wf-16.png" alt="In a workflow" /></th>
			<th></th>
			<th>Document name</th>
			<th>Dossier Nr</th>
			<th>Document type</th>
			<th>Linked</th>
			<th>Source</th>			
			<th>Letter</th>
			<th>Location</th>
			<th><img src="${absurl(url.context)}/res/imaging/img/workitem-16.png" alt="Workitem" /></th>
			<th>Work owner</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
	<#list result.documents as document>
		<tr id="${document.nodeRef}">
			<td>
				<#if document.workexpeditor?has_content >
					<img src="${absurl(url.context)}/res/imaging/img/wf-16.png" alt="In a workflow" data-collaborator="${document.collaborator}" />
				</#if>
				<#if document.hasaspectmypers == "true" >
					<img src="${absurl(url.context)}/res/imaging/img/home.gif" alt="My personal" />
				</#if>
			</td>
			<td class="icon"><img src="${absurl(url.context)}/res/imaging/img/preview-16.png" alt="Preview" class="preview" /></td>
			<td class="colname">${document.name}</td>
			<td>${document.docdossiernr}</td>
			<td>${document.doctype}</td>
			<td>${document.doclinked}</td>
			<td>${document.docsource}</td>
			<td>${document.docletter}</td>
			<td class="colnowrap">${document.inbox}</td>
			<td>
				<#if document.itemowner?has_content >
					<img src="${absurl(url.context)}/res/imaging/img/workitem-16.png" alt="Workitem" />
				</#if>
			</td>
			<td>${document.itemowner}</td>
			<td class="actions">
				<div class="action-menu-search">
					<ul class="actions-list">
						<li class="act-viewfromsearch"><a href="#viewfromsearch" data-act-method="POST">VIEW</a></li>
						<li class="act-locate"><a href="#locate" data-act-type="url" data-act-url="page-boxes?box=inbox&locate={nodeRef}">LOCATE</a></li>
					</ul>
				</div>
			</td>
		</tr>
	</#list>
	</tbody>
</table>
</div>