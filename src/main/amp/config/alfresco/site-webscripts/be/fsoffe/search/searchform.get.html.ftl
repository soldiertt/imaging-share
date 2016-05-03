<#if pb>
	<div id="pb-context">
		<div class="ctx-value"><label>Session id : </label>${sessionid?c}</div>
		<#if refdossier??>
			<div class="ctx-value"><label>Dossier : </label>${refdossier?c}</div>
		</#if>
		<#if employer??>
			<div class="ctx-value"><label>Employer : </label>${employer}</div>
		</#if>
		<#if worker??>
			<div class="ctx-value"><label>Employee : </label>${worker}</div>
		</#if>
		<#if person??>
			<div class="ctx-value"><label>Person : </label>${person}</div>
		</#if>
		<#if keyword1??>
			<div class="ctx-value"><label>Keyword 1 : </label>${keyword1}</div>
		</#if>
		<#if keyword2??>
			<div class="ctx-value"><label>Keyword 2 : </label>${keyword2}</div>
		</#if>
	</div>
<#else>
	<div id="search-form">
		<h1>Search form</h1>
		<form action="../../imaging/components/search/searchresults?search=true">
			<div class="searchcol">
				<label>Document name :</label>
				<div class="inputfield">
					<input type="text" name="docname" class="form-control" />
				</div>
				
				<label>Document type :</label>
				<div class="inputfield">
					<select name="doctype" data-placeholder="Select a document type ..." class="form-control">
						<#list doctypes as doctype>
							<option value="${doctype.id}">${doctype.lib}</option>
						</#list>
					</select>
				</div>
				
				<label>Source :</label>
				<div class="inputfield">
					<select name="docsource" data-placeholder="Select a source ..." class="form-control">
						<#list docsources as docsource>
							<option value="${docsource.id}">${docsource.lib}</option>
						</#list>
					</select>
				</div>
				
			</div>
			<div class="searchcol">
				<label>Linked? : </label>
				<div class="inputfield">
					<select name="doclinked" class="form-control">
						<option value=""></option>
						<option value="true">linked</option>
						<option value="false">not linked</option>
					</select>
				</div>
				<label>Creation date : </label>
				<div class="inputfield">
					<input type="text" name="doccreationdate-start" class="datefield form-control" /> (from) <br/>
					<input type="text" name="doccreationdate-end" class="datefield form-control" /> (to)
				</div>
			</div>
			<div class="searchcol">
				<label>Content : </label>
				<div class="inputfield">
					<input type="text" name="fulltext1" class="form-control" />
				</div>
				<label>
					<input type="radio" name="operator1" value="or" checked />or
					&nbsp;
					<input type="radio" name="operator1" value="and" />and
				</label>
				<div class="inputfield">
					<input type="text" name="fulltext2" class="form-control" />
				</div>
				<label>Dossier Nr : </label>
				<div class="inputfield">
					<input type="text" name="dossiernr" class="form-control" />
				</div>
			</div>
			<input type="submit" id="submit" value="Search" class="btn btn-primary" /><br/>
			<input type="submit" id="clear" value="Clear" class="btn btn-primary" />
		</form>
	</div>
</#if>