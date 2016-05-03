<form id="indexFormID" method="POST">
	<#if formtype == "inline">
		<h1>Index Form<div class="closeform"></div></h1>
	<#else>
		<h1>Index Form : ${result.document.name}</h1>
	</#if>
	<#if formtype == "inline">
		<div class="indexformfooter">
			<input type="hidden" name="nodeRef" value="${result.document.nodeRef}">
			<input type="submit" name="submit" id="submit" value="Save & Close" class="btn btn-primary">
		</div>
	</#if>
	<div class="indexfield">
		<label>Document Name</label>
		<div class="indexinput col2">
			<span class="readonly">${result.document.name}</span>
		</div>
	</div>
	
	<div class="indexfield">
		<label>Document Type</label>
		<div class="indexinput col4">
			<#if result.document.parent == "DISPATCHING" || result.document.parent == "FONDSBOX">
				<select data-placeholder="Select a document type ..." id="docType" name="fds:docType" class="form-control">
			<#else>
				<select data-placeholder="Select a document type ..." id="docType" name="fds:docType"  class="form-control" disabled>
			</#if>	
				<#list docTypes as docType>
					<#if result.document.docType == docType.id>
						<option value="${docType.id}" selected>${docType.lib}</option>
					<#else>
						<option value="${docType.id}">${docType.lib}</option>
					</#if>
				</#list>
			</select>
		</div>
	</div>
	<#if result.document.haswfaspect == "yes" >
	<div class="indexfield">
		<label>Destination</label>
		<div class="indexinput col2">
			<#if result.document.parent == "DISPATCHING" || result.document.parent == "FONDSBOX">
			<select id="boxes" name="fds:workBox"  class="form-control" disabled>
			<#else>
			<select id="boxes" name="fds:workBox" class="form-control">
			</#if>	

			<#list boxes.boxesDataList as box>
				<#if box.state == "true">
					<#if result.document.varDefaultDestination == box.lib>
						<option value="${box.lib}" selected>${box.lib}</option>
					<#else>
						<option value="${box.lib}">${box.lib}</option>
					</#if>
				</#if>
			</#list>
			</select>
		</div>
	</div>
	<div class="indexfield">
		<label>Assignee</label>
		<div class="indexinput col4">
			<!-- Store as a hidden field to get it back with javascript : to find selected user when generating new list -->
			<input type="hidden" id="workAssignee" name="workAssignee" value="${result.document.workAssignee}" disabled />
			<#if result.document.parent == "DISPATCHING" || result.document.parent == "FONDSBOX">
			<select data-placeholder="Select a user ..." name="fds:workAssignee" class="form-control" disabled>
			<#else>
			<select data-placeholder="Select a user ..." name="fds:workAssignee" class="form-control">
			</#if>
				<option value=""></option>
			</select>
		</div>
	</div>
	</#if>
	<div class="indexfield">
		<label>Creation Date</label>
		<div class="indexinput col2">	
			<span class="readonly">${result.document.created}</span>
		</div>
	</div>
	<#if result.document.haswfaspect == "yes" >
	<div class="indexfield">
		<label>Inbox Date In</label>
		<div class="indexinput col4">
			<span class="readonly">${result.document.workEntryTime}</span>
		</div>
	</div>
	<div class="indexfield">
		<label>Dossier Number</label>
		<div class="indexinput col2">
			<#if result.document.parent == "VOORBER-PREPAR" || result.document.parent == "IDWG" || result.document.parent == "GAAJ" || result.document.parent == "ONDERZ-ENQ" || result.document.parent == "SV-IF" || result.document.parent == "BRIEF-LETTRE-CLIENT">
				<input type="text" name="fds:docDossierNr" value="${result.document.docdossiernr}" class="form-control">
			<#else>
				<input type="text" name="fds:docDossierNr" value="${result.document.docdossiernr}" class="form-control" disabled>
			</#if>	
		</div>
	</div>
	<div class="indexfield">
		<label>Dossier Status</label>
		<div class="indexinput col4">
			<#if result.document.parent == "VOORBER-PREPAR" || result.document.parent == "IDWG">
				<select data-placeholder="Select a status ..." id="docStatus" name="fds:workDossierStatus" class="form-control">
			<#else>
				<select data-placeholder="Select a status ..." id="docStatus" name="fds:workDossierStatus" class="form-control" disabled>
			</#if>
				<option value=""></option>
				<#list docStatus.standardDataList as docStatus>
					<#if result.document.workStatus?? && result.document.workStatus == docStatus.id?number>
						<option value="${docStatus.id}" selected>${docStatus.lib}</option>
					<#else>
						<option value="${docStatus.id}">${docStatus.lib}</option>
					</#if>
				</#list>
			</select>
		</div>
	</div>
	</#if>
    <#if result.document.haswfaspect == "no" >
	<div class="indexfield">
		<label>Dossier Number</label>
		<div class="indexinput col4">
			<input type="text" name="fds:docDossierNr" value="${result.document.docdossiernr}" class="form-control" disabled>
		</div>
	</div>
	</#if> 
	<div class="indexfield">
		<label>Linked ?</label>
		<div class="indexinput col2">
			<#if user.isAdmin>
				<#if result.document.docLinked == "yes">
					<input type="checkbox" name="fds:docLinked" checked>
				<#else>
					<input type="checkbox" name="fds:docLinked">
				</#if>	
			<#else>
				<#if result.document.docLinked == "yes">
					<input type="checkbox" name="fds:docLinked" checked disabled>
				<#else>
					<input type="checkbox" name="fds:docLinked" disabled>
				</#if>	
			</#if>
		</div>
	</div>

	<#if result.document.haswfaspect != "yes" && result.document.docprocessedby?? >
	<div class="indexfield">
		<label>Processed by</label>
		<div class="indexinput col4">
			<input type="text" name="fds:docProcessedBy" value="${result.document.docprocessedby}" class="form-control" disabled>
		</div>
	</div>
	</#if>

	<#if result.document.parent == "GAAJ">
    <div class="indexfield">
	    <label>Keywords</label>
		<div class="indexinput col4">
			<#if result.document.keywords?size == 0>
				<select id="keywords1" data-placeholder="Select a keyword ..." name="fds:keywords" class="form-control">
					<option value=""></option>
					<#list keywords as keyword>
						<option value="${keyword.id}">${keyword.lib}</option>
					</#list>
				</select>
				<select id="keywords2" data-placeholder="Select a keyword ..." name="fds:keywords" class="form-control">
					<option value=""></option>
					<#list keywords as keyword>
						<option value="${keyword.id}">${keyword.lib}</option>
					</#list>
				</select>
			</#if>
			<#list result.document.keywords as dockeyword>
				<select id="keywords${dockeyword}" data-placeholder="Select a keyword ..." name="fds:keywords" class="form-control">
					<option value=""></option>
					<#list keywords as keyword>
						<#if dockeyword == keyword.id>
							<option value="${keyword.id}" selected>${keyword.lib}</option>
						<#else>
							<option value="${keyword.id}">${keyword.lib}</option>
						</#if>
					</#list>
				</select>
			</#list>
			<#if result.document.keywords?size == 1 >
				<select id="keywords2" data-placeholder="Select a keyword ..." name="fds:keywords" class="form-control">
					<option value=""></option>
					<#list keywords as keyword>
						<option value="${keyword.id}">${keyword.lib}</option>
					</#list>
				</select>
			</#if>
		</div>
	</div>
    </#if>

	<!-- displayed only when in BRIEF-LETTRE-CLIENT box in the workflow or in the repository with some specific document types -->
	<#if (result.document.parent == "BRIEF-LETTRE-CLIENT" || (result.document.haswfaspect == "no" && (result.document.docType == "INFO CLIENT/KLANT" || result.document.docType == "LETTRE CLIENT" || result.document.docType == "BRIEF KLANT")))>
    <div class="indexfield">
		<label>Letter Type</label>
		<div class="indexinput col4">
			<#if (result.document.parent == "BRIEF-LETTRE-CLIENT") >
			<select id="docLetterType" name="fds:docLetterType" class="form-control">
			<#else>
			<select id="docLetterType" name="fds:docLetterType" class="form-control" disabled>
			</#if>	
			<#list docLetterTypes.standardDataList as letterType>
				<#if result.document.doclettertype == letterType.id>
					<option value="${letterType.id}" selected>${letterType.lib}</option>
				<#else>
					<option value="${letterType.id}">${letterType.lib}</option>
				</#if>
			</#list>
			</select>
		</div>
	</div>
	</#if>

	<#if result.document.haswfaspect == "yes" && (result.document.parent == "ONDERZ-ENQ" || result.document.parent == "AFROMING-ECREMAGE" || result.document.parent == "DCD")>
    <div class="indexfield">
		<label>Pending</label>
		<div class="indexinput col4">
			<#if result.document.workpending == "yes">
				<input type="checkbox" name="fds:workPending" checked>
			<#else>
				<input type="checkbox" name="fds:workPending">
			</#if>
		</div>
	</div>
	</#if>

	<#if result.document.parent == "BRIEF-LETTRE-CONTR">
    <div class="indexfield">
		<label>Priority</label>	
		<div class="indexinput col4">
			<select id="docPriority" name="fds:docPriority" data-placeholder="Select a priority ..." class="form-control">
				<#list docPriorities.standardDataList as priority>
					<#if priority.id == result.document.docPriority>
						<option value="${priority.id}" selected>${priority.lib}</option>
					<#else>
						<option value="${priority.id}">${priority.lib}</option>
					</#if>
				</#list>
			</select>
		</div>
	</div>
	</#if>

	<#if formtype != "inline">
		<div class="dialogfooter">
			<input type="hidden" name="nodeRef" value="${result.document.nodeRef}">
			<input type="submit" name="submit" id="submit" value="Save & Close" class="btn btn-primary">
			<input type="submit" name="savesend" id="savesend" value="Save & Send" class="btn btn-primary">
			<button id="btnCancel" class="btn btn-primary">Cancel</button>
		</div>
	</#if>	
</form>