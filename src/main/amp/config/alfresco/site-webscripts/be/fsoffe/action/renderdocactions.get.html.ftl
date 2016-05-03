<ul class="actions-list">
	<#list result.actions as action>
		<li><a href="#${action.name}" data-act-type="${action.type}" data-act-url="${action.url}" data-act-url-target="${action.urlTarget}"><img src="${absurl(url.context)}/res/imaging/img/action/${action.name}-16.png" alt="${msg("document.action.${action.name}.label")}" /> ${msg("document.action.${action.name}.label")}</a></li>
	</#list>
</ul>

