<ul id="imports-list">
	<#list result.documents as document>
		<#assign alloweditonline = "false" />
        <#assign source = "" />
		<li>
			<#if document.mimetype == "application/pdf">
				<a href="#" id="view-${document.docid}" data-noderef="${document.nodeRef}">
					<img src="${absurl(url.context)}/res/components/images/filetypes/pdf-file-48.png" alt="PDF" />
				</a>
			<#else>
				<#switch document.mimetype>
				  <#case "application/msword">
                     <#assign source = "${absurl(url.context)}/res/components/images/filetypes/doc-file-48.png"/>
				     <#assign alloweditonline = "true" />
				     <#break>
				  <#case "application/vnd.openxmlformats-officedocument.wordprocessingml.document">
					 <#assign source = "${absurl(url.context)}/res/components/images/filetypes/doc-file-48.png"/>
				     <#assign alloweditonline = "true" />
				     <#break>
				  <#case "application/vnd.ms-excel">
                     <#assign source = "${absurl(url.context)}/res/components/images/filetypes/xls-file-48.png"/>
				     <#assign alloweditonline = "true" />
				     <#break>
				  <#case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
					 <#assign source = "${absurl(url.context)}/res/components/images/filetypes/xls-file-48.png"/>
				     <#assign alloweditonline = "true" />
				     <#break>
				  <#default>
                     <#assign source = "${absurl(url.context)}/res/components/images/filetypes/generic-file-48.png"/>
				</#switch>
				<#if alloweditonline == "true">
					<a href="#" id="edit-${document.docid}" data-mimetype="${document.mimetype}" data-docname="${document.name}" data-docpath="${document.path}">
				<#else>
					<a href="${absurl(url.context)}/proxy/alfresco/api/node/content/workspace/SpacesStore/${document.docid}/${document.name}" id="open-${document.docid}">
				</#if>
                 <img src="${source}" alt="Edit online"/>
				</a>
			</#if>
            <#if (result.isinmyworkitem == "yes" && document.creator == user.id) || user.isAdmin >
				<a href="#" id="del-${document.docid}"><img src="${absurl(url.context)}/res/imaging/img/delimport-16.png" alt="Delete" /></a>
			</#if>
			<#if (result.isinmyworkitem == "yes") || user.isAdmin >
				<#if alloweditonline == "true">
					<a href="#" id="edit-${document.docid}" data-mimetype="${document.mimetype}" data-docname="${document.name}" data-docpath="${document.path}"><img src="${absurl(url.context)}/res/imaging/img/edit-online.png" alt="Edit online" /></a>
				</#if>
			</#if>
			<div class="importname">${document.name}</div>
		</li>
	</#list>
</ul>
