<form id="indexFormMultiID" action="../../../proxy/alfresco/imaging/action/savedocument" method="POST" enctype="multipart/form-data">
	<h1>Index form</h1>
	<div class="indexfield">
		<label>Bestemmeling<br/>Destination</label>
		<div class="indexinput col4">
			<select id="boxes" name="fds:workBox">
				<#list boxes.boxesDataList as box>
					<#if box.state == "true">
						<#if 'EXIT' == box.lib>
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
		<label>Persoon<br/>Personne</label>
		<div class="indexinput col4">
			<select data-placeholder="Select a user ..." name="fds:workAssignee">
				<option value=""></option>
				<#list users as user>
					<option value="${user.userid}">${user.displayname}</option>
				</#list>
			</select>
		</div>
	</div>
	<div class="dialogfooter">
		<input type="submit" id="submit" value="Save & Send" class="btn btn-primary">
		<button id="btnCancel" class="btn btn-primary">Cancel</button>
	</div>	
</form>