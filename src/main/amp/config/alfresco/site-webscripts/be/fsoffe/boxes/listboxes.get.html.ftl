<ul>
	<li id="workitem">Workitem <span class="boxitemscount"><#if workitemscount &gt; 0 >(${workitemscount})</#if></span></li>
	<li id="boxes">Inboxes
		<ul>
			<li id="mypersonal">My Personal <span class="boxitemscount"><#if mypersonalcount &gt; 0 >(${mypersonalcount})</#if></span></li>
			<#list result.boxes as boxitem>
			<li id="${boxitem.nodeRef}" class="normalbox">${boxitem.name} <span class="boxitemscount"><#if boxitem.docCount &gt; 0 >(${boxitem.docCount})</#if></span></li>
			</#list>
		</ul>
	</li>
	<li id="outbox">Outbox</li>
	<#if user.isAdmin || servicelead == "true">
		<li id="admin">Administration</li>
	</#if>
</ul>
