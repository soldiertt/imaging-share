<#include "./imaging-template.ftl" />

<@templateHeader>
  <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/viewer-min.css" />
  <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/comments-min.css" />
  <link rel="stylesheet" type="text/css" href="${page.url.context}/res/imaging/css/dropzone-ext.css" />
</@>

<@templateBody>
 
	<@region id="document-details" scope="template" />
    <div id="doc-tabs">
		<ul>
			<li><a href="#tab-imports">Imports <span id="importscount"></span></a></li>
			<li><a href="#tab-notes">Notes <span id="notescount"></span></a></li>
		</ul>
		<div id="tab-imports"></div>
		<div id="tab-notes"></div>
	</div>

	<@region id="web-preview" scope="template" />

	<div id="indexformpanel"></div>
	
	
	<!-- UPLOAD BOX -->
	<div id="uploadbox" class="modaldialog">
		<div class="actiondialoglarge">
			<div class="closedialog"></div>
			<h1>Add imports</h1>
			<form action="/share/proxy/alfresco/imaging/document/uploadimport" class="dropzone" id="dropzoneUpload">
				<input type="hidden" name="destination" />
			</form>	
			<div class="dialogfooter fileinputs">
				<button id="submit-files" class="btn btn-primary">Import</button>
				<button id="clear-files" class="btn btn-primary">Clear</button>
				<button id="btnCancel" class="btn btn-primary">Close</button>
			</div>
		</div>
	</div>
</@>

<@templateFooter>
   <script type="text/javascript" src="${page.url.context}/res/imaging/external/tinymce/tinymce.min.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/dropzone-config.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/fsoffe-min.js"></script>
   <script type="text/javascript" src="${page.url.context}/res/imaging/js/document-min.js"></script>
</@>