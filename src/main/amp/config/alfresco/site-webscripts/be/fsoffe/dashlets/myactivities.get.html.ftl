<div id="myactivities-dashlet" class="dashlet">
	<div id="myactivities-dashlet-title" class="title">${msg("title")} - 
		From <b><span id="dateRangeStart">${dateRangeStart}</span></b> 
		to <b><span id="dateRangeEnd">${dateRangeEnd}</span></b> -
		for user <b><span id="forUser">${username}</span></b>
		<span class="hidden" id="byLetterType">${bylettertype}</span>
	</div>
    <div id="myactivities-dashlet-body" class="body">
	    <div class="toolbar">
	    	<a id="configMyactivitiesLink" href="#">${msg("config")}</a>
	  	</div>
    	<#assign classLabel = "" />
    	<#if bylettertype == "true">
    		<#assign classLabel = "hidden" />
    	</#if>
        <table id="myactivitiestable_normal" class="${classLabel}">
			<thead>
				<tr>
					<th>Document type</th>
					<th>Count</th>
				</tr>
			</thead>
			<tbody>
			<#list myactivities.documents as document>
				<tr>
					<td>${document.doctype}</td>
					<td>${document.count}</td>
				</tr>
			</#list>
			</tbody>
		</table>
    	<#if bylettertype == "true">
    		<#assign classLabel = "" />
    	<#else>
    		<#assign classLabel = "hidden" />
    	</#if>
		<table id="myactivitiestable_lettertype" class="${classLabel}">
			<thead>
				<tr>
					<th>Document type</th>
					<th>Letter Type</th>
					<th>Count</th>
				</tr>
			</thead>
			<tbody>
			<#list myactivities.documents as document>
				<tr>
					<td>${document.doctype}</td>
					<td>${document.lettertype!}</td>
					<td>${document.count}</td>
				</tr>
			</#list>
			</tbody>
		</table>
    </div>
</div>
<!-- CONFIG BOX -->
<div id="activitiesconfigbox" class="modaldialog">
	<div class="actiondialog">
		<div class="closedialog"></div>
		<h1>My activities configuration</h1>
		<form>
			<div class="inputfield">
				<input type="text" name="activities-start" class="datefield form-control" /> (from) <br/>
				<input type="text" name="activities-end" class="datefield form-control" /> (to)
			</div>
		</form>	
		<div class="dialogfooter">
			<button id="submit-activitiesconfig">Submit</button>
			<button id="btnCancel">Cancel</button>
		</div>
	</div>
</div>