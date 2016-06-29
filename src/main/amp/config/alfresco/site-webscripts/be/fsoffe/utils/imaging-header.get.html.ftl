<#assign activeSite = page.url.templateArgs.site!"">
<#assign pageId = page.id>
<nav class="navbar navbar-default">
	<div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">IMAGING</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <#assign dashClass = (pageId == "page-dashboard")?string("active","")>
        <li class="${dashClass}"><a href="${url.context}/page/site/${activeSite}/page-dashboard">Dashboard</a></li>
        <li><a href="${url.context}/page/site/${activeSite}/page-boxes">Workitem</a></li>
        <li><a href="${url.context}/page/site/${activeSite}/page-boxes?box=inbox">Inbox</a></li>
        <li><a href="${url.context}/page/site/${activeSite}/page-boxes?box=mypersonal">My personal</a></li>
        <#if user.isAdmin || servicelead == "true">
        	<li><a href="${url.context}/page/site/${activeSite}/page-boxes?box=admin">Administration</a></li>
		</#if>
        <#assign searchClass = (pageId == "page-search")?string("active","")>
        <li class="${searchClass}"><a href="${url.context}/page/site/${activeSite}/page-search">Search</a></li>
      </ul>	
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">${user.fullName} (<span id="userid">${user.id}</span>) <span class="caret"></span></a>
          <ul class="dropdown-menu">
			<#assign prefClass = (pageId == "page-preferences")?string("active","")>
            <li class="${prefClass}"><a href="${url.context}/page/site/${activeSite}/page-preferences">Preferences</a></li>
          </ul>
        </li>
      </ul>
	  <#if user.isAdmin >
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Alfresco <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="${url.context}/page/repository">Repository</a></li>
			<li><a href="${url.context}/page/site/settings/data-lists">Settings</a></li>
			<li><a href="${url.context}/page/console/admin-console/application">Admin tools</a></li>
          </ul>
        </li>
      </ul>
	  </#if>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>