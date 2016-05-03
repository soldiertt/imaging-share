$(function() {
	
	var pbsessionid;
	
	function isValidDate(date) {
	    var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date),
	    	d, m, y, composedDate;
	    
	    if (matches == null) { 
	    	return false;
	    }
	    d = matches[1];
	    m = matches[2] - 1;
	    y = matches[3];
	    composedDate = new Date(y, m, d);
	    
	    return composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
	}
	
	function makeDatatable(pbsessionid) {
		
		var winToClose = [];
		var winOpened = [];
		
		$("#search-results table").dataTable( { 
	        "bPaginate": false, 
	        "bInfo" : false, 
	        "sDom" : '<f>t',
	        "aoColumnDefs": [
							{ "bSortable": false, aTargets: [ 0 ] },
							{ "bSortable": false, aTargets: [ 1 ] },
							{ "bSortable": false, aTargets: [ -1 ] },
	                        { "bSortable": false, aTargets: [ -3 ] }
	                     ]
	    }); 
		
		//Remove view action for document in primary workflow and locate action for others.
		if (pbsessionid == 0) {
			$(".action-menu-search").each(function() {
				var $wfImage = $(this).parent().parent().find("td:first img");
				if ($wfImage.length > 0 && $wfImage.attr("alt") !== "My personal" && $wfImage.attr("data-collaborator") === "yes") {
					// There is a workflow icon, not a My Personal workflow and i am Collaborator
					$(this).find(".act-viewfromsearch").remove(); // Remove View action
				} else {
					$(this).find(".act-locate").remove(); // Remove Locate action
				}
			});
		} else {
			$(".act-locate").remove(); // Remove all locate actions
		}
		
		// Generate menu's
		$("ul.actions-list").menu();
		
		//Close all child windows when list window is closed and pb mode
		$(window).on('beforeunload', function() {
			if (pbsessionid != 0) {
				for (var i = 0; i < winToClose.length; i++) {
					winToClose[i].close();
				}
			}
		});
		 
		// CLICK ON VIEW ACTION 
		$(".act-viewfromsearch a").click(function(e) {
			e.stopPropagation();
			e.preventDefault();
			var $el = $(this),
				actionName = $el.attr("href").substring(1),
				nodeRef = $el.closest("tr").attr("id"),
				getData = { nodeRef: nodeRef, action: actionName, method: $el.attr("data-act-method") },
				checkActionStatus = function(jsonResponse, nodeRef) {
				
					// Check action execution status and call callback if success
					if (jsonResponse.actionstatus == "OK") {
						
						var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
						var winRef;
						
						if (!isChrome) {
							var foundOpenedViewer = false;
							$.each(winOpened, function(index, elem) {
								if (elem.nodeRef === nodeRef) {
									foundOpenedViewer = true;
									elem.winRef.focus(); // DOES NOT WORK ON CHROME !
								}
							});
							
							if (!foundOpenedViewer) {
								
								if (pbsessionid != 0) {
									winRef = Imaging.utils.newWindow("page-document?nodeRef=" + nodeRef + "&pbsessionid=" + pbsessionid);
									winToClose.push(winRef);
								} else {
									winRef = Imaging.utils.newWindow("page-document?nodeRef=" + nodeRef);
								}
								
								winOpened.push({"nodeRef":nodeRef, "winRef": winRef});
								
								winRef.attachEvent('onbeforeunload', function() {
									 var indexToRemove = -1;
									 $.each(winOpened, function(index, elem) {
										if (elem.nodeRef === nodeRef) {
											indexToRemove = index;
										} 
									 });
									 winOpened.splice(indexToRemove, 1);
								});
								
							}
						} else {
							
							if (pbsessionid != 0) {
								winRef = Imaging.utils.newWindow("page-document?nodeRef=" + nodeRef + "&pbsessionid=" + pbsessionid);
								winToClose.push(winRef);
							} else {
								Imaging.utils.newWindow("page-document?nodeRef=" + nodeRef);
							}
						}
						
					} else {
						Imaging.utils.infoBox("Information", jsonResponse.errormessage);
					}
				};
			
			//Select effect on current row
			$el.closest("tbody").find("td").removeClass("selected");
			$el.closest("tr").find("td").addClass("selected");
			Imaging.ajax.getJsonWait(WS_URLS.simpleAction, getData, function(jsonResponse) { checkActionStatus(jsonResponse, nodeRef); })
			
		});
		
		// CLICK ON LOCATE ACTION 
		$(".act-locate").click(function(e) {
			e.stopPropagation();
			e.preventDefault();
			
			Imaging.onClickAction.menuActionClick($(this));
			
		});
		
		// DBL CLICK ON A ROW
		var $tablerows = $('#search-results table.notempty tbody tr');
		$tablerows.dblclick(function(e) { 
			$(this).find(".actions-list a").trigger("click");
		});
		
		// MANAGE THUMBNAIL ON PREVIEW ICON CLICK
	    $('#search-results table.notempty tbody tr td.icon img.preview').click(function(e) {
	    	var $tableRow = $(this).parent().parent(); 
	    	
			xOffset = 100;
	    	yOffset = 30;
	    	
	    	var nodeRef = $tableRow.attr("id"),
	    		docName = $tableRow.find("td.colname").text(),
	    		getData = { nodeRef: nodeRef },
	    		displayThumbnail = function(jsonResult) {
	        		var nodeId = jsonResult.docinfo.nodeRef.substring(24),
	        			imageSrc = "../../../proxy/alfresco/api/node/workspace/SpacesStore/" + nodeId + "/content/thumbnails/imgpreview?ph=true&c=queue",
	        			$image = $("<img />").attr("id","imgpreview").attr("src", imageSrc);
	        		
	        		$("<div />").attr("id","docpreview")
	        			.append($image)
	        			.append("<br/><span>" + docName + "</span>")
	        			.css("top",(e.pageY - xOffset) + "px").css("left",(e.pageX + yOffset) + "px")
	        			.appendTo("body");
	        		$tableRow.parent().on('mousemove', function() {
	        			$("#docpreview").remove();
	        			$(this).unbind();
	        		});
	        	};
	    	
	    	Imaging.ajax.getJson(WS_URLS.docMainPDFRef, getData, displayThumbnail);
	        	
	    	
	    });
	    
	    // If list images from PB, open the first document in viewer
	    /*
	    if (pbsessionid != 0) {
	    	$(".action-menu-search:first a").trigger("click");
	    }
	    */
	}
	
	if (Imaging.utils.getURLParameter("pbsessionid") != "null") {
		//****************
		//** PBI WINDOW **
		//****************
		pbsessionid = Imaging.utils.getURLParameter("pbsessionid");
		$("div#alf-hd").hide();
		//Change window title
		document.title = "PBI";
	} else {
		//***************************
		//** CLASSIC SEARCH WINDOW **
		//***************************
		pbsessionid = 0;
		$("#search-form h1").click(function() {
			// show/hide the form when clicking on it
			$("#search-form form").toggle();
		});
		  
		// initialize all date fields
		$(".datefield").datepicker({ 
			dateFormat: 'dd-mm-yy',
			buttonImage: "../../../res/imaging/img/calendar.gif",
			showOn: "button",
			buttonImageOnly: true,
			showButtonPanel: true,
			constrainInput: true
		});
		
		// initialize select fields
		$("#search-form select").chosen({
			allow_single_deselect: true
		});
		
		// when form is submitted
		$("#search-form form").submit(function(e) {
			  
			e.preventDefault();
			
			var $btn = $( ":input[type=submit]:focus" );
			if ($btn.attr("id") == "clear") {
				 $(this).each (function() { this.reset(); });
				 $("select[name='doctype'],select[name='doclinked'],select[name='docsource']").trigger("chosen:updated"); 
			}
			var $form = $(this),
				url = $form.attr("action"),
				searchData = Imaging.form.getFieldsAsObject($form),
				renderResults = function(html) {
					$("#search-results").replaceWith(html);
					makeDatatable(pbsessionid);
				},
				startDate = $("input[name='doccreationdate-start']").val();
				endDate = $("input[name='doccreationdate-end']").val();
				
			if ((startDate != "" && !isValidDate(startDate)) || (endDate != "" && !isValidDate(endDate))) {
				Imaging.utils.errorBox("Invalid dates", "Some dates are invalid !")
			} else {
				$("#search-results").html("<img src='/share/res/imaging/img/ajax-loader.gif' alt='Searching...' />");
				Imaging.ajax.get(url, searchData, renderResults);
			}
				
		});
	}
	
	makeDatatable(pbsessionid);
	
});
