$(function() {
	
	$("#mypersonaltable").dataTable( {
	    "bPaginate": false,
	    "bInfo" : false,
	    "bFilter" : false,
	    "aaSorting": [[ 5, "desc" ]]
	});
	
	$("#workitemstable").dataTable( {
	    "bPaginate": false,
	    "bInfo" : false,
	    "bFilter" : false,
	    "aaSorting": [[ 1, "asc" ]],
	    "aoColumnDefs": [
	                     { "bSortable": false, aTargets: [ 0 ] }
	                     ]
	});
	
	$("#taskstable, #myactivitiestable_normal, #myactivitiestable_lettertype").dataTable( {
	    "bPaginate": false,
	    "bInfo" : false,
	    "bFilter" : false
	});
	
	$("#workitemstable tbody tr").dblclick(function(e){
		Imaging.utils.goTo("page-boxes?nodeRef=" + $(this).attr("id"));
	});
	
	$("#mypersonaltable tbody tr").dblclick(function(e){
    	Imaging.callbackMgr().executeCallback("toworkitems", $(this).attr("id"));
	});

	$("#taskstable tbody tr").dblclick(function(e){
    	Imaging.callbackMgr().executeCallback("toworkitems", $(this).attr("id"));
	});
	
	var onMyactivitiesConfigClick = function(e) {
		e.preventDefault();
		var $link = $(this),
			currentData = { dateRangeStart: $("#dateRangeStart").text(), 
				dateRangeEnd: $("#dateRangeEnd").text(), 
				byLetterType: $("#byLetterType").text() },
				
			showMyactivitiesConfigDialogFn = function(html) {
			//Show the dialog
	    	var $mydialog = $('<div id="myactivitiesconfigdialog" class="modaldialog"><div id="myactivitiesconfigpanel" class="actiondialog"><div class="closedialog"></div></div></div>')
	    		.appendTo("body");
	    	
	    	$("#myactivitiesconfigpanel").append(html);
	    	
	    	// initialize all date fields
			$("#myactivitiesconfigpanel .datefield").datepicker({ 
				dateFormat: 'dd-mm-yy',
				buttonImage: "../../../res/imaging/img/calendar.gif",
				showOn: "button",
				buttonImageOnly: true,
				showButtonPanel: true,
				constrainInput: true
			});
			
	    	$("#myactivities-form").submit(function(e) {
		        e.preventDefault();
				var $form = $(this),
			    	datefrom = $form.find("#myactivities-dateRangeStart").val(),
			    	dateend = $form.find("#myactivities-dateRangeEnd").val(),
			    	bylettertype = $form.find("#myactivities-bylettertype").prop('checked');
			    	url = WS_URLS.dashletMyactivities,
			    	jsonData = { dateRangeStart: datefrom, dateRangeEnd: dateend, byLetterType: bylettertype },
			    	reRenderDashlet = function(dashletHtml) {
						$link.closest(".dashlet-wrapper").html(dashletHtml);
						$("#myactivitiestable_normal, #myactivitiestable_lettertype").dataTable( {
						    "bPaginate": false,
						    "bInfo" : false,
						    "bFilter" : false
						});
						$("#configMyactivitiesLink").click(onMyactivitiesConfigClick);
					};
					
				$mydialog.remove();
				Imaging.ajax.get(url, jsonData, reRenderDashlet);
	        });
	        
	        $mydialog.showImagingDialog({onclose: "remove"});
		};
		Imaging.ajax.get(WS_URLS.configDashletMyactivities, currentData, showMyactivitiesConfigDialogFn);
	};
	
	$("#configMyactivitiesLink").click(onMyactivitiesConfigClick);
});