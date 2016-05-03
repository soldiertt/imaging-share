<#macro templateHeader doctype="strict">

   <#if doctype = "strict">
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
   <#else>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
   </#if>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${locale}" xml:lang="${locale}">
<head>
   <title><@region id="head-title" scope="global" chromeless="true"/></title>
   <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	
   <!-- Icons -->
   <link rel="shortcut icon" href="${page.url.context}/res/imaging/img/favicon.ico" type="image/vnd.microsoft.icon" />
   <link rel="icon" href="${page.url.context}/res/imaging/img/favicon.ico" type="image/vnd.microsoft.icon" />
    
   <#-- This MUST be placed before the <@outputJavaScript> directive to ensure that the Alfresco namespace
        gets setup before any of the other Alfresco JavaScript dependencies try to make use of it. -->
   <@markup id="messages">
      <#-- Common i18n msg properties -->
      <@generateMessages type="text/javascript" src="${url.context}/service/messages.js" locale="${locale}"/>
   </@markup>
   
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/external/bootstrap/css/bootstrap.min.css" />
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/external/bootstrap/css/bootstrap-theme.min.css" />
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/external/jquery-ui/css/jquery-ui.min.css" />
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/external/datatable/css/jquery.dataTables.css" />
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/external/chosen/chosen.min.css" />
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/external/messi/messi.min.css" />
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/external/dropzone/css/dropzone.css" />
   <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/global-min.css" />
  
   <@outputCSS/>
   
   <#-- Common Resources -->
      
   <#-- Template Resources (nested content from < @templateHeader > call) -->
   <#nested>
   
   <@markup id="resources">
   <#-- Additional template resources -->
   </@markup>

   <#-- Component Resources from .get.head.ftl files or from dependency directives processed before the
        <@outputJavaScript> and <@outputCSS> directives. -->
   ${head}

   <@markup id="ieStylesheets">
   <!-- MSIE CSS fix overrides -->
   <!--[if lt IE 7]><link rel="stylesheet" type="text/css" href='<@checksumResource src="${url.context}/res/css/ie6.css"/>'/><![endif]-->
   <!--[if IE 7]><link rel="stylesheet" type="text/css" href='<@checksumResource src="${url.context}/res/css/ie7.css"/>'/><![endif]-->
   </@markup>

   <@markup id="ipadStylesheets">
   <#assign tabletCSS><@checksumResource src="${url.context}/res/css/tablet.css"/></#assign>
   <!-- Android & iPad CSS overrides -->
   <script type="text/javascript">
      if (navigator.userAgent.indexOf(" Android ") !== -1 || navigator.userAgent.indexOf("iPad;") !== -1 || navigator.userAgent.indexOf("iPhone;") !== -1 )
      {
         document.write("<link media='only screen and (max-device-width: 1024px)' rel='stylesheet' type='text/css' href='${tabletCSS}'/>");
         document.write("<link rel='stylesheet' type='text/css' href='${tabletCSS}'/>");
      }
   </script>
   </@markup>
</head>
</#macro>

<#--
   Template "templateBody" macro.
   Pulls in main template body.
-->
<#macro templateBody type="">
<body id="Share" class="yui-skin-${theme} alfresco-share ${type} claro">
   <div class="sticky-wrapper">
<#-- Template-specific body markup -->
<#nested>
      <div class="sticky-push"></div>
   </div>
</#macro>

<#--
   Template "templateFooter" macro.
   Pulls in template footer.
-->
<#macro templateFooter>
   <div class="sticky-footer">
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/jquery/jquery.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/jquery-ui/js/jquery-ui.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/jquery-json/jquery.json.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/jstorage/jstorage.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/bootstrap/js/bootstrap.min.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/chosen/chosen.jquery.min.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/datatable/js/jquery.dataTables.min.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/dropzone/dropzone.min.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/external/messi/messi.js"></script>
		<script type="text/javascript" src="${page.url.context}/res/imaging/js/imaging/imaging-all-min.js"></script>
   		<script type="text/javascript" src="${page.url.context}/res/imaging/js/rootscope-min.js"></script>
   
		<#-- Template-specific footer markup -->
		<#nested>
   </div>
   
   <#-- This is where the JavaScript and CSS dependencies will initially be added through the use of the 
        <@script> and <@link> directives. The JavaScript can be moved through the use 
        of the <@relocateJavaScript> directive (i.e. to move it to the end of the page). These directives 
        must be placed before directives that add dependencies to them otherwise those resources will
        be placed in the output of the ${head} variable (i.e. this applied to all usage of those directives
        in *.head.ftl files) -->
   <@outputJavaScript/>
   <#-- <@relocateJavaScript/> -->
   
 </body>
</html>
</#macro>

<#--
   Template "templateHtmlEditorAssets" macro.
   @deprecated These files are now brought in for every page from the extendable components/resources.get.html webscript.
-->
<#macro templateHtmlEditorAssets></#macro>
