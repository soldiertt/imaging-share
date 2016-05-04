<#assign supportedMimeTypes = ["image/tiff","image/bmp","image/jpeg","image/gif","image/png","image/jp2",
							   "application/pdf", "application/msword","application/acad","application/dxf",
							   "application/vnd.ms-excel","application/vnd.ms-powerpoint",
							   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
							   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							   "application/vnd.openxmlformats-officedocument.presentationml.presentation"]>

<#if supportedMimeTypes?seq_contains(node.mimeType)>
<div class="web-preview shadow" width="100%" height="800">
	<div class="bd">
		<div id="${args.htmlid}-daeja-div" class="preview-swf" width="100%" height="800">
				<!--<applet codebase="${url.context}/v1files"
					archive="ji.jar, daeja1.jar, daeja2.jar, daeja3.jar"
					code="ji.applet.jiApplet.class"
					name="ViewONE"
					width="100%"
					height="900"
					hspace="0"
					vspace="0"
					align="middle"
					MAYSCRIPT="true">-->
			<object class="com.ibm.dv.client.Viewer" id="ViewONE" width="100%" height="900">
				<!--<param name="cabbase" value="ji.cab, daeja1.cab, daeja2.cab, daeja3.cab">-->
				<param name="abortSaveOnShutdown" value="false" />
				<param name="annotate" value="true">
				<#if allowedit == "true" >
					<param name="annotateEdit" value="true">
				<#else>
					<param name="annotateEdit" value="false">
				</#if>
				<param name="annotationAllowHideAll" value="true">
				<param name="annotationAutoPrompt" value="false">
				<param name="annotationAutoSave" value="false">
				<param name="annotationDateStyle" value="short"> 
				<param name="annotationDefaults" value="all {init='1,0,0,1,0,0'}"> 
				<param name="annotationEncoding" value="UTF8">
				<param name="annotationHideButtons" value="line,note,highlightPoly,hyperlink,square,rectangle,redact,redactPoly,poly,openPoly,oval,freehand,ruler,angle,circle"> 
				<param name="annotationJavascriptExtensions" value="true"> 
				<#if node.annotationNodeRef??>
					<param name="annotationFile" value="${url.context}/proxy/alfresco/api/node/content/${node.annotationNodeRef?replace(':/','')}/${node.annotationName}">
				</#if>
				<param name="annotationNoteTextWrapping" value="true" />
				<param name="annotationPostPrefix" value="noderef=${node.nodeRef}">
				<param name="annotationSavePost" value="${url.context}/service/components/daeja/save">
				<param name="annotationSecurityModel" value="2"> 
				
				<param name="annotationStamp1" value="&lt;userid&gt;&lt;N&gt;&lt;date&gt;">
				<param name="annotationStamp2" value="image:${url.context}/res/imaging/img/annot/approved.png&lt;255,255,255&gt;">
				<param name="annotationStamp3" value="image:${url.context}/res/imaging/img/annot/rejected.png&lt;129,129,129&gt;">
				<param name="annotationStamp4" value="image:${url.context}/res/imaging/img/annot/overdue.png&lt;255,255,255&gt;">
				<param name="annotationStamp5" value="image:${url.context}/res/imaging/img/annot/check.png&lt;255,255,255&gt;">
				<param name="annotationStamp6" value="image:${url.context}/res/imaging/img/annot/cross.png&lt;255,255,255&gt;">
				<param name="annotationStamp7" value="image:${url.context}/res/imaging/img/annot/question.png&lt;255,255,255&gt;">
				<param name="annotationStamp8" value="image:${url.context}/res/imaging/img/annot/exclamation.gif&lt;206,237,220&gt;">
				<param name="annotationStamp9" value="image:${url.context}/res/imaging/img/annot/star.png&lt;255,255,255&gt;">
				<param name="annotationStamp10" value="image:${url.context}/res/imaging/img/annot/phone.png&lt;0,0,0&gt;">
				<param name="annotationStamp11" value="image:${url.context}/res/imaging/img/annot/downarrow.png&lt;255,255,255&gt;">
				<param name="annotationStamp12" value="image:${url.context}/res/imaging/img/annot/uparrow.png&lt;255,255,255&gt;">
				<param name="annotationStamp13" value="image:${url.context}/res/imaging/img/annot/circle.png&lt;255,255,255&gt;">
				
				<param name="annotationStampProperties1" value="&lt;menu=Initials&gt;&lt;color=white&gt;&lt;FontHeight=16&gt;&lt;FillColor=red&gt;"> 
				<param name="annotationStampProperties2" value="&lt;menu=Approved&gt;&lt;scale=2.0&gt;">
				<param name="annotationStampProperties3" value="&lt;menu=Rejected&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties4" value="&lt;menu=Overdue&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties5" value="&lt;menu=Check&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties6" value="&lt;menu=Cross&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties7" value="&lt;menu=Question&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties8" value="&lt;menu=Exclamation&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties9" value="&lt;menu=Star&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties10" value="&lt;menu=Phone&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties11" value="&lt;menu=Down arrow&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties12" value="&lt;menu=Up arrow&gt;&lt;scale=1.0&gt;">
				<param name="annotationStampProperties13" value="&lt;menu=Circle&gt;&lt;scale=1.0&gt;">
				
				<param name="customAnnotationToolTip" value="&lt;user&gt; - &lt;createdate&gt;">
				<param name="defaultFontHeight" value="16">
				<param name="defaultPDFResolution" value="300" />
				<param name="enhance" value="true">
				<param name="enhanceColor" value="true">
				<param name="enhancemode" value="0">
				<param name="eventInterest" value="30,66,67,41">
				<param name="eventhandler" value="viewonehandler">   
				<param name="fileButtonOpen" value="false">
				<param name="fileButtonClose" value="false">
				<param name="fileButtonSave" value="false">
				<param name="fileKeys" value="false">
				<param name="fileMenus" value="false">
				<param name="filename" value="${url.context}/proxy/alfresco/api/node/content/${node.nodeRef?replace(':/','')}/${node.name}">
				<param name="keepScroll" value="true" />
				<param name="menuNewWindow" value="false" />
				<param name="newWindowButtons" value="true">
				<param name="newWindowKey" value="false">
				<param name="scale" value="ftow">  
				<param name="scrollbars" value="false"/>
				<param name="useAcceptLanguageHTTPHeader" value="true">
				<param name="useBrowserAlertOnShutdown" value="false" />
				<#if user.isAdmin >
					<param name="userAdmin" value="true">
				</#if>
				<param name="userID" value="${user.id}">
				<param name="version3Features" value="true">
				<param name="viewmode" value="thumbsleft">
				<!--</applet>-->
			</object>
		</div>
	</div>
</div>

<#else>
	<script type="text/javascript">//<![CDATA[
	new Alfresco.WebPreview("${args.htmlid}").setOptions(
	{
		nodeRef: "${node.nodeRef}",
		name: "${node.name?js_string}",
		icon: "${node.icon}",
		mimeType: "${node.mimeType}",
		previews: [<#list node.previews as p>"${p}"<#if (p_has_next)>, </#if></#list>],
		size: "${node.size}"
	}).setMessages(
		${messages}
	);
	//]]></script>
	<div class="web-preview shadow">
	   <div class="hd">
		  <div class="title">
			 <h4>
				<img id="${args.htmlid}-title-img" src="${url.context}/components/images/generic-file-32.png" alt="File"/>
				<span id="${args.htmlid}-title-span"></span>
			 </h4>
		  </div>
	   </div>
	</div>
</#if>