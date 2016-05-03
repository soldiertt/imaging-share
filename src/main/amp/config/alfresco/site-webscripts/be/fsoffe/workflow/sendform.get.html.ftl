<form id="sendform" method="post" action="../../../proxy/alfresco/imaging/action/send">
<h1>Send - ${document.name}</h1>
<div class="indexfield">
	<label>Assignee :</label>
	<div class="indexinput col4">
		<select data-placeholder="Select a user ..." id="selectuser" name="selectuser">
			<option value=""></option>
			<#list result.allusers as user>
				<option value="${user.userid}">${user.displayname}</option>
			</#list>
		</select>
	</div>
</div>
<div class="indexfield">
	<label>Priority :</label>
	<div class="indexinput col2">
		<select data-placeholder="Select a priority ..." id="priority" name="priority">
		<#list priorities.standardDataList as priority>
			<#if priority.id == document.docPriority>
				<option value="${priority.id}" selected>${priority.lib}</option>
			<#else>
			<option value="${priority.id}">${priority.lib}</option>
			</#if>
		</#list>
		</select>
	</div>
</div>
<div class="dialogfooter">
	<input type="submit" id="submit" value="Send" class="btn btn-primary" />
	<button id="btnCancel" class="btn btn-primary">Cancel</button>
</div>
</form>