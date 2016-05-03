<form id="myactivities-form" action="">
<h1>${msg("label.dialogTitle")}</h1>
<#if servicelead == "true">
<div class="indexfield">
	<label>${msg("label.username")} :</label>
	<div class="indexinput col4">
    	<select id="myactivities-username" name="username">
        	<#list servicemembers as member>
            	<#if member.username == user.id>
            		<option value="${member.username}" selected>${member.displayname}</option>
            	<#else>
            		<option value="${member.username}">${member.displayname}</option>
            	</#if>
            </#list>
         </select>
     </div>
</div>
</#if>
<div class="indexfield">
	<label>${msg("label.dateRangeStart")} :</label>
	<div class="indexinput col4">
         <input id="myactivities-dateRangeStart" type="text" name="dateRangeStart" value="${beginDate}" maxlength="10" class="datefield form-control" />&nbsp;*
    </div>
</div>
<div class="indexfield">
	<label>${msg("label.dateRangeEnd")} :</label>
	<div class="indexinput col4">
        <input id="myactivities-dateRangeEnd" type="text" name="dateRangeEnd" value="${endDate}" maxlength="10" class="datefield form-control" />&nbsp;*
    </div>
</div>
<div class="indexfield">
	<label>${msg("label.byLetterType")} :</label>
	<div class="indexinput col4">
    	<input id="myactivities-bylettertype" type="checkbox" name="bylettertype" <@if byLetterType 'checked' '' /> />
    </div>      
</div>     

<div class="dialogfooter">
	<input type="submit" id="submit" value="Submit" class="btn btn-primary" />
	<button id="btnCancel" class="btn btn-primary">Cancel</button>
</div>
</form>
<#macro if if then else=""><#if if>${then}<#else>${else}</#if></#macro>