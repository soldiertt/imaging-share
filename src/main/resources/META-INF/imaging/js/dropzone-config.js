$(function() {

	Dropzone.autoDiscover = false;
		
	//Enable DropZone (already in boxes-view + document templates)
	var dropzoneUpload = new Dropzone("#dropzoneUpload", {
		  paramName: "file", // The name that will be used to transfer the file
		  maxFilesize: 50, // MB
		  autoProcessQueue: false,
		  parallelUploads: 5,
		  maxFiles:10,
		  createImageThumbnails: false,
		  previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div><div class='dz-remove' data-dz-remove></div>\n</div>",
		  accept: function(file, done) {
			done(); 
		  },
		  init: function() {
			  
		    this.on("addedfile", function(file) { 
				var fileName = $(file.previewElement).find(".dz-filename span").text();
				var fileExt = fileName.split('.').pop();
				$(file.previewElement).addClass(fileExt);
			});
			this.on("success", function(file, resp) { 
				$(file.previewElement).find("img.dz-remove").hide(); 
			});
		  }
		});
	
	$("#submit-files").click(function(e) {
		e.preventDefault();
		dropzoneUpload.processQueue();
	});
	
	$("#clear-files").click(function(e) {
		e.preventDefault();
		dropzoneUpload.removeAllFiles();
	});
})