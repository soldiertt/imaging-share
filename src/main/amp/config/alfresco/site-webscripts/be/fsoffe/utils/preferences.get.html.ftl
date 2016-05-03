<div id="pref-form">
	<form id="preferencesform" method="post" action="../../../proxy/alfresco/imaging/user/savepreferences">
	<h1>My preferences</h1>
	
	<div id="pref-autoview">
		<label>Autoview</label>
		<#if autoview == "true">
			<span class="preffield"><input type="checkbox" name="autoview" value="autoview" checked></span>
		<#else>
			<span class="preffield"><input type="checkbox" name="autoview" value="autoview"></span>
		</#if>
	</div>
	
	<div id="pref-autoform">
		<label>Autoform</label>
		<#if autoform == "true">
			<span class="preffield"><input type="checkbox" name="autoform" value="autoform" checked></span>
		<#else>
			<span class="preffield"><input type="checkbox" name="autoform" value="autoform"></span>
		</#if>
	</div>
	
	<div id="pref-annotationautosave">
		<label>Auto-save annotations</label>
		<#if annotationautosave == "true">
			<span class="preffield"><input type="checkbox" name="annotationautosave" value="annotationautosave" checked></span>
		<#else>
			<span class="preffield"><input type="checkbox" name="annotationautosave" value="annotationautosave"></span>
		</#if>
	</div>
	
	<div id="pref-landing">
		<label>Landing page</label>
		<span class="preffield">
			<select name="landingpage">
				<#list landingOptions as landing>
					<#if landing.id == landingpage>
						<#assign selectAttr = "selected" />
					<#else>
						<#assign selectAttr = "" />
					</#if>
					<option value="${landing.id}" ${selectAttr}>${landing.label}</option>
				</#list>
			</select>
		</span>		
	</div>
	
	<input type="submit" id="submit" value="Save" class="btn btn-primary" />
	
	</form>
</div>