// Root scope properties

window.imagingProps = {},
	initializeApp = function(jsonResp) {
		window.imagingProps.vtihost = jsonResp.vtihost;
		window.imagingProps.vtiport = jsonResp.vtiport;
		$(".footer-ent").html("Please contact ICT Team with your questions, comments, and suggestions.<br/>"
				+ "Copyright &copy; FFE-FSO. All rights reserved.");
		
	};

Imaging.ajax.getJson(WS_URLS.systemInit, {} , initializeApp);
//});

$(function() {
	
	// JQUERY PLUGIN : manage dialogs
	$.fn.showImagingDialog = function(options) { 
		
		var settings = $.extend({
            onclose: "hide" // These are the defaults.
        	}, options ),
        	$toshadow = $("#alf-hd, #bd, #viewer-header, #doc-tabs, .sticky-footer");
		
		$(".web-preview").css("visibility","hidden"); //Hide applet (cannot put it behind dialog)
		$toshadow.css("opacity", "0.4");
		return this.each(function() {
			var $dialog = $(this);
            $dialog.show();
            
            $(".closedialog, #btnCancel").unbind();
            $(".closedialog, #btnCancel").click(function(e) {
            	e.preventDefault();
            	if (settings.onclose === "remove") {
            		$dialog.remove();
            	} else {
            		$dialog.hide();
            		var dropzoneUpload = Dropzone.forElement("#dropzoneUpload");
            		if (dropzoneUpload) {
            			dropzoneUpload.removeAllFiles();
            		}
            	}
        		$(".web-preview").css("visibility","visible");
        		$toshadow.css("opacity", "1");
    			if(typeof settings.onclosecallback === 'function'){
    				settings.onclosecallback.call(this);
				}
            });
        });
    };
	
	// DETECT Form changes
	// Written by Luke Morton, licensed under MIT

	$.fn.watchChanges = function () {
		this.find("input[type='text'],select").each(function() {
			if ($(this).attr("name") === "fds:workAssignee") {
				$(this).data("basevalue", $("input#workAssignee").val());
			} else {
				$(this).data("basevalue", $(this).val());
			}
		});
		this.find("input[type='checkbox']").each(function() {
			$(this).data("basevalue", $(this).prop("checked"));
		});
		return this;
	};
	
		
});