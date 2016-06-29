var Imaging = {};

 /**********************************************************
 ****************** FORM **********************************
 **********************************************************/
 Imaging.form = {
    getFieldsAsObject: function($form) {
    	
    	//Get all enabled input text, get all enabled select box, get all hidden fields
		var inputs = $form.find( "input[type='text']:enabled:not([readonly]), select:enabled:not([readonly]), input[type='hidden']:enabled, input[type='radio']:checked, input[type='checkbox']:enabled").filter(":not(.chosen-search input)"),
			formData = {},
			keywordsArray = [];
		
		inputs.each(function() {
			var $field = $(this);
			if ($field.attr("type") === "checkbox") {
				attributeValue = $field.prop("checked");
			} else {
				attributeValue = $field.val();
			}
			if ($field.attr("name") == "fds:keywords") {
				keywordsArray.push($field.val());
				attributeValue = keywordsArray;
			} 
			formData[$field.attr("name")] = attributeValue; 
		});
		
		return formData;
    }
};

/*********************************************************
***************** BOXES ***********************************
**********************************************************/
Imaging.boxes = {
	// LIST THE CONTENT OF A FUNCTIONAL BOX
	// nodeRef : nodeRef of the box
	// assignedtome : if "yes", show only the documents assigned to me, if "no", show all documents.
	// showworkitems : if "yes", show also documents in workitems, if "no" (default), skip those documents.
	listBoxContent: function(nodeRef, assignedtome, showworkitems, nodeRefToHighligth) {
		$("#content-table").html("<img src='/share/res/imaging/img/ajax-loader.gif' alt='Loading...' />");
		var getData = { nodeRef: nodeRef, assignedtome: assignedtome, showworkitems: showworkitems};
		var displayContentTableLocal = function(response) {
			var imgBoxes = Imaging.ImgLib().Boxes;
			imgBoxes.displayContentTable(response, "inbox", assignedtome, showworkitems, [], nodeRefToHighligth);
		}
		Imaging.ajax.get(WS_URLS.listBoxContent, getData, displayContentTableLocal);
	},
	refreshImportsAndNotes: function (nodeRef) {
		var getData = { nodeRef: nodeRef };
		var tabsPanel = Imaging.ImgLib().TabsPanel;
		tabsPanel.refresh(getData);
	}
};

/**********************************************************
***************** ONClick - Boxes**************************
**********************************************************/

Imaging.onClickBoxes = {
	normalBoxClick: function($box, nodeRefToHighlight) {
        Imaging.boxes.listBoxContent($box.attr("id"), "no", "no", nodeRefToHighlight); 
        $("#left-menu li").removeClass("selected-box"); 
        $box.addClass("selected-box"); 
	},
	specialBoxClick: function($box, selectedNodeRef) {
		var fromWorkitem = $("#left-menu li.selected-box").attr("id") === "workitem";
	    var imgBoxes = Imaging.ImgLib().Boxes;
		imgBoxes.listSpecialBox($box.attr("id"), fromWorkitem, selectedNodeRef);
	    $("#left-menu li").removeClass("selected-box"); 
	    $box.addClass("selected-box"); 
	},
	rowClick: function($row, dblClickManager, view) {
		var $firstAction = $row.find(".action-menu ul.actions-list li:first-child a"),
     	checkYesNoAnswer = function(val) {
     		if (val === "Y") {
     			$firstAction.trigger("click");	
     		}
     	};
     
        if (dblClickManager.alreadyclicked) { 
        	dblClickManager.alreadyclicked = false; // reset 
            clearTimeout(dblClickManager.alreadyclickedTimeout); 
            // DOUBLE CLICK 
            // 1. Same behaviour as simple click 
            if (view === "workitem") { 
                $row.siblings().removeClass("selected"); 
                $row.addClass("selected"); 
                var nodeRef = $row.attr("id"); 
                $("#doc-title").text($row.find("td.colname").text()); 
                Imaging.boxes.refreshImportsAndNotes(nodeRef);
                $("#doc-tabs").show(); 
            } 
            // 2. Trigger the first action in the menu
            if ($firstAction.attr("href") === "#adminrelease") {
            	Imaging.utils.yesnoBox("Admin release", "Are you sure you want to release this document ?", checkYesNoAnswer);
            } else {
            	$firstAction.trigger("click");
            }
         } else { 
        	 dblClickManager.alreadyclicked = true; 
        	 dblClickManager.alreadyclickedTimeout = setTimeout(function(){ 
        		 dblClickManager.alreadyclicked = false; // reset when it happens 
                 // SINGLE CLICK 
                 if (view === "workitem") { 
                     $row.siblings().removeClass("selected"); 
                     $row.addClass("selected"); 
                     var nodeRef = $row.attr("id"); 
                     $("#doc-title").text($row.find("td.colname").text()); 
                     Imaging.boxes.refreshImportsAndNotes(nodeRef);
                     $("#doc-tabs").show(); 
                 } 
             },300); // <-- dblclick tolerance here 
         } 
	},
	headCheckBoxClick: function($checkbox) {
		if ($checkbox.prop("checked")) {
    		$(":checkbox[name='rows']").prop("checked",true);
    		$("#actions-bar a.multi").css("visibility","visible");
    	} else {
    		$(":checkbox[name='rows']").prop("checked",false);
    		$("#actions-bar a.multi").css("visibility","hidden");
    	}
	},
	childCheckBoxClick: function($checkbox) {
		if (!$checkbox.prop("checked")) {
			//Just unselect the header checkbox cause at least one child is not selected
			$(":checkbox#rowscheck").prop("checked",false);
			//IF everything is unselected, hide multi-actions bar
			if($(":checkbox[name='rows']").filter(":checked").length === 0){
				$("#actions-bar a.multi").css("visibility","hidden");
			}
		} else {
			//We are checking a child, check if all children are selected to select header checkbox
			$("#actions-bar a.multi").css("visibility","visible");
			if($(":checkbox[name='rows']").filter(":not(:checked)").length === 0){
			  $(":checkbox#rowscheck").prop("checked",true);
			}
		}
	}
};

/*********************************************************
***************** ImgLib *********************************
**********************************************************/
Imaging.ImgLib = function() {
		
	/** Class Boxes **/
	var Boxes = function () {
		
		// Private variables
    	this.$contentTable = $("#content-table");
    	

    		// LIST THE CONTENT OF A SPECIAL BOX : workitem, mypersonal, outbox
    		// boxType : the special box type
    	this.listSpecialBox = function(boxType, fromWorkitem, selectedNodeRefParam) {
			var aaSorting = [];
			var selectedNodeRef = null;
			//TODO determine if fromWorkitem is needed
			//if (fromWorkitem && boxType == "workitem") {
			if (boxType == "workitem") {
				var $dataTable = $("table.dataTable.notempty");
				if ($dataTable.length > 0) {
					aaSorting = $dataTable.dataTable().fnSettings().aaSorting;
					if (selectedNodeRefParam) {
						selectedNodeRef = selectedNodeRefParam;
					} else {
						selectedNodeRef = $dataTable.find("tr.selected").attr("id");
					}
				}
			}
			this.$contentTable.html("<img src='/share/res/imaging/img/ajax-loader.gif' alt='Loading...' />");
			
			var thisObj = this;
			var displayContentTableLocal = function(response) {
				thisObj.displayContentTable(response, boxType, null, null, aaSorting, selectedNodeRef);
			};
			Imaging.ajax.get("../../imaging/components/boxes/" + boxType, displayContentTableLocal);
		};

		// COMMON FUNCTION TO DISPLAY THE CONTENT OF ANY BOX
		// html : the html code to render (the html table)
		// view : match the box type, allow some specific behavior
		// assignedtome : cfr listBoxContent, here only to render the button with correct label
		// showworkitems : cfr listBoxContent, here only to render the button with correct label
		// aaSortingParam : keep previous sorting order in workitem
		// selectedNodeRef : allow to select another document after any callback
    	this.displayContentTable = function(html, view, assignedtome, showworkitems, aaSortingParam, selectedNodeRef) { 
    			
			var $dataTable,
				aaSorting = aaSortingParam,
				tableColumns = [],
				shifted,
				$prevTr,
				$prevCheck,
				$selectedbox = $("#left-menu li.selected-box"),
				$tablerows,
				nbrows,
				nbactionsrendered,
				warningMessage,
				$btnAssignedToMe,
				$btnShowWorkitems,
				dblClickManager = { alreadyclicked: false, alreadyclickedTimeout: null};
			
		    $("#doc-tabs").hide(); 
		    this.$contentTable.html(html); 
		    
		    if (view == "inbox") {
		    	$btnAssignedToMe = $("#act-assignedtome");
		    	$btnShowWorkitems = $("#act-showworkitems");
		    	$btnAssignedToMe.data("assignedtome", assignedtome); //SPECIAL MULTI-ACTION "Assigned to me"
		    	$btnShowWorkitems.data("showworkitems", showworkitems); //SPECIAL MULTI-ACTION "Show workitems"
		    	
			    $("#act-assignedtome,#act-showworkitems").click(function (e) {
			    	Imaging.onClickAction.filterBoxContent($(this), $btnAssignedToMe, $btnShowWorkitems, $selectedbox);
			    	e.preventDefault();
			    });
		    }
		    
		    // SORTABLE COLUMNS
		    if (view === "outbox") {
		    	tableColumns = [
								{ "bSortable": false, aTargets: [ 0 ] },
								{ "bSortable": false, aTargets: [ 1 ] }
		                     ];
		    } else if (view === "inbox" || view === "mypersonal") {
		    	tableColumns = [
								{ "bSortable": false, aTargets: [ 0 ] },
								{ "bSortable": false, aTargets: [ 1 ] },
								{ "bSortable": false, aTargets: [ 2 ] }
		                     ];
		    } else {
		    	// Administration and workitem boxes
		    	tableColumns = [
								{ "bSortable": false, aTargets: [ 0 ] },
								{ "bSortable": false, aTargets: [ 1 ] },
		                        { "bSortable": false, aTargets: [ 2 ] },
		                        { "bSortable": false, aTargets: [ 3 ] }
		                     ];
		    }
		    
		    // DEFAULT SORTING
		    if (view === "inbox") {
		    	aaSorting = [[ 11, "desc" ]]
		    } else if (view === "workitem" && aaSorting.length === 0) {
		    	aaSorting = [[ 5, "desc" ]]
		    }
		    
		    // RENDER TABLE AS A DATATABLE
		    $dataTable = $("#content-table table").dataTable( { 
		        "bPaginate": false, 
		        "bInfo" : false, 
		        "sDom" : 't',
		        "aoColumnDefs": tableColumns,
		        "aaSorting": aaSorting
		    }); 
		    
		    // ****** MANAGE SEARCH BOX *******
		    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		    if (isChrome) {
    		    $(".boxright input").on('input', function() {
    		    	$dataTable.fnFilter($(this).val());
    		    });
		    } else {
		    	$(".boxright input").on('keyup', function() {
    		    	$dataTable.fnFilter($(this).val());
    		    });
		    }
		    
		    // *********** DECLARATIONS ***********
		    $tablerows = $('#content-table table.notempty tbody tr'),
		    	nbrows = $tablerows.size(),
		    	nbactionsrendered = 0; 
		    	
			// *********** END DECLARATIONS ***********
			
			// Update box items count
			if (nbrows > 0) {
				$selectedbox.find("span.boxitemscount").text("(" + nbrows + ")");
			} else {
				$selectedbox.find("span.boxitemscount").empty();
			}
			$("#boxinfo").text($selectedbox.text());
			
		    // INSERT ACTIONS FOR EACH DOCUMENT
		    $tablerows.each(function() { 
		        var $el=$(this), 
		            nodeRef = $el.attr("id"); 
		        Imaging.action.insertActions(nodeRef, view, $el.find(".actions div.action-menu")); 
		    }); 
		    
		    // Manage actions behavior only once, when all actions are loaded
		    $(document).unbind('ajaxComplete');
		    $(document).ajaxComplete(function( event, xhr, settings ) { 
		        if (settings.url.indexOf("renderdocactions") != -1) { 
		            nbactionsrendered += 1; 
					if (nbactionsrendered === nbrows) {
						Imaging.action.manageActionsEvents(true); 
					} 
		        } 
		    }); 
		    
		    // MANAGE MULTI ACTIONS
		    $("#actions-bar a.multi").click(function(e) {
		    	Imaging.onClickAction.multiAction($(this));
		    	e.preventDefault();
		    });
		    
		    // MANAGE TOOLTIP ON HOVER A WARNING ROW
			warningMessage = function() {
				return $(this).attr("data-warn-message");
			};
		    $('#content-table tbody tr.warning').tooltip({  items: "tr.warning", content: warningMessage });
		    
		    // MANAGE THUMBNAIL ON PREVIEW CLICK
		    $('#content-table table.notempty tbody tr td.icon img.preview').click(function(e) {
		    	
		    	e.stopPropagation();
		    	
		    	var $tableRow=$(this).parent().parent(); 
		    	
	    		var xOffset = 100,
	        		yOffset = 30;
	        	
	        	var nodeRef = $tableRow.attr("id"),
	        		docName = $tableRow.find("td.colname").text(),
	        		getData = { nodeRef: nodeRef },
	        		displayThumbnail = function(jsonResult) {
		        		var nodeId = jsonResult.docinfo.nodeRef.substring(24),
		        			imageSrc = "../../../proxy/alfresco/api/node/workspace/SpacesStore/" + nodeId + "/content/thumbnails/imgpreview?ph=true&c=queue",
		        			$image = $("<img />").attr("id","imgpreview").attr("src", imageSrc);
		        		
		        		$("<div/>").attr("id","docpreview")
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
		    
		    // MANAGE CLICK / DOUBLE CLICK ON A ROW
		    $tablerows.click(function(e) { 
		        Imaging.onClickBoxes.rowClick($(this), dblClickManager, view);
		    }); 
		    
		    // MANAGE shift key is pressed
			$(document).on('keyup keydown', function(e){ 
				shifted = e.shiftKey;
			});
			
		    // MANAGE CLICK ON HEADER CHECKBOX
		    $(":checkbox#rowscheck").click(function() {
		    	Imaging.onClickBoxes.headCheckBoxClick($(this));
		    });
			
		    // MANAGE CLICK ON A CHILD CHECKBOX
		    $(":checkbox[name='rows']").click(function(e) {
		    	e.stopPropagation();
		    	Imaging.onClickBoxes.childCheckBoxClick($(this));
		    	
				if (shifted && $(this).prop('checked')) {
					$prevCheck = $(this).parent().parent().prev().find("input[type='checkbox'][name='rows']");
					while ($prevCheck && !$prevCheck.prop('checked')) {
						$prevCheck.prop('checked', true);
						Imaging.onClickBoxes.childCheckBoxClick($prevCheck);
						$prevTr = $prevCheck.parent().parent().prev();
						if ($prevTr.attr("id")) {
							$prevCheck = $prevCheck.parent().parent().prev().find("input[type='checkbox'][name='rows']");
						} else {
							$prevCheck = undefined;
						}
					}
				}
				
		    });
		    
		    // FIRST ROW IS SELECTED IN WORK ITEMS OR THE ONE SELECTED IN THE DASHLET
		    if (view === "workitem") {
		    	if (selectedNodeRef) {
		    		$tablerows.filter("[id='" + selectedNodeRef + "']").trigger("click");
		    	} else if (Imaging.utils.getURLParameter("nodeRef") != "null") {
		    		$tablerows.filter("[id='" + Imaging.utils.getURLParameter("nodeRef") + "']").trigger("click");
		    	} else {
		    		$tablerows.filter(":first").trigger("click");
		    	}
		    } else {
		    	if (selectedNodeRef) {
		    		$tablerows.filter("[id='" + selectedNodeRef + "']").find("td").addClass("located");
		    	}
		    }
		};
	};

    /** Class TabsPanel **/  
    var TabsPanel = function () {
    	
    	var thisTabsPanel = this;
    	
        // Private variables
    	thisTabsPanel.$tabNotes = $("#tab-notes");
    	thisTabsPanel.$tabImports = $("#tab-imports");
    	thisTabsPanel.$notesCountEl = $("#notescount");
    	thisTabsPanel.$importsCountEl = $("#importscount");
    	thisTabsPanel.$notesListEl;
    	thisTabsPanel.$importsListEl;
        
        /** class methods **/
    	thisTabsPanel.initImportsTab = function(html) {
    		thisTabsPanel.$tabImports.html(html);
    		thisTabsPanel.$importsListEl = $("#imports-list");
    	};
    	thisTabsPanel.initNotesTab = function(html, nodeRef, maindocref) {
    		var refreshComments = function() {
				setTimeout(function() { Imaging.boxes.refreshImportsAndNotes(nodeRef); }, 1000);
			}
    		thisTabsPanel.$tabNotes.html(html);
    		thisTabsPanel.$notesListEl = $("#tab-notes-comments-list");
    		
    		$(".btn-displaynewcomment").click(function($event) {
    			$event.preventDefault();
    			tinymce.remove();
    			$(".viewmode").removeClass("hidden");
    			$(".editcomment").addClass("hidden");
    			$(this).addClass("hidden");
    			$("#newcomment").removeClass("hidden");
    			tinymce.init({
    			    selector: '#newcommentarea',
    			    theme: "modern",
    			    skin: 'lightgray',
    			    menubar: false,
    			    statusbar: false
    			});
    		});
    		$(".btn-cancelcomment").click(function($event) {
    			$event.preventDefault();
    			tinymce.remove();
    			$(".viewmode").removeClass("hidden");
    			$(".editcomment").addClass("hidden");
    			$(".btn-displaynewcomment").removeClass("hidden");
    			$("#newcomment").addClass("hidden");
    		});
    		$(".btn-addcomment").click(function($event) {
    			$event.preventDefault();
    			var postUrl = WS_URLS.docAddComment.replace("{nodeRef}","workspace/SpacesStore/" + maindocref.split("/")[3]),
    				saveCommentFn = function() {
    					var title = "added by " + $("#userid").text() + " on " + (new Date()).toLocaleString(),
    						content = tinymce.get("newcommentarea").getContent(),
    						newComment = {title: title, content: content};
    					tinymce.remove();
    					$("#newcomment").html("<img src='/share/res/imaging/img/ajax-loader.gif' alt='Loading...' />");
    					Imaging.ajax.postJson(postUrl, newComment, refreshComments());
    				};
    			Imaging.utils.runWithWorkitemPermission(nodeRef, saveCommentFn);
    		});
    		$(".delete-comment-link").click(function() {
    			var $closestLi = $(this).closest("li"),
    				deleteCommentFn = function() {
	    				checkYesNoDeleteCommentFn = function(val) {
	    				if (val === "Y") {
	    					tinymce.remove();
	    		    		var commentRef = $closestLi.attr("id");
	    		    		$closestLi.html("<img src='/share/res/imaging/img/ajax-loader.gif' alt='Loading...' />");
	    		    		var deleteUrl = WS_URLS.docEditRemoveComment.replace("{nodeRef}","workspace/SpacesStore/" + commentRef.split("/")[3]);
	    		    		Imaging.ajax.ajaxDelete(deleteUrl, null, refreshComments());
	    				}
	    			};
	    			Imaging.utils.yesnoBox($closestLi.find(".editcomment h2").text(), "Are you sure to delete this comment?", checkYesNoDeleteCommentFn);
    			};
    			Imaging.utils.runWithWorkitemPermission(nodeRef, deleteCommentFn);
    		});
    		$(".edit-comment-link").click(function() {
    			var $closestLi = $(this).closest("li"),
					commentRef = $closestLi.attr("id"),
					commentName = commentRef.split("/")[3];
    				editCommentFn = function() {
		    			tinymce.remove();
		    			$(".viewmode").removeClass("hidden");
		    			$(".editcomment").addClass("hidden");
		    			$(".btn-displaynewcomment").removeClass("hidden");
		    			$("#newcomment").addClass("hidden");
		    			$closestLi.find(".viewmode").addClass("hidden");
		    			$closestLi.find(".editcomment").removeClass("hidden");
		    			tinymce.init({
		    			    selector: '#editcommentarea-' + commentName,
		    			    theme: "modern",
		    			    skin: 'lightgray',
		    			    menubar: false,
		    			    statusbar: false
		    			});
    				};
    			Imaging.utils.runWithWorkitemPermission(nodeRef, editCommentFn);
    		});
    		$(".btn-savecomment").click(function($event) {
    			$event.preventDefault();
    			var $closestLi = $(this).closest("li"),
    				commentRef = $closestLi.attr("id"),
    				commentName = commentRef.split("/")[3],
    				title = 'updated by ' + $("#userid").text() + " on " + (new Date()).toLocaleString(),
    				content = tinymce.get("editcommentarea-" + commentName).getContent(),
    				updateComment = {title: title, content: content};
    			
    			$closestLi.find(".editcomment").html("<img src='/share/res/imaging/img/ajax-loader.gif' alt='Loading...' />");
    			tinymce.remove();
    			var putUrl = WS_URLS.docEditRemoveComment.replace("{nodeRef}","workspace/SpacesStore/" + commentName);
    			Imaging.ajax.putJson(putUrl, updateComment, refreshComments());
    		});
    	};
    	thisTabsPanel.updateCommentsCount = function () {
        	//Display comments count
			var notescount = thisTabsPanel.$notesListEl.find("li").length;
			if (notescount > 0) {
				thisTabsPanel.$notesCountEl.html("(" + notescount + ")");
			} else {
				thisTabsPanel.$notesCountEl.empty();
			}
        };
        thisTabsPanel.updateImportsCount = function () {
        	//Display import count
        	var importscount = thisTabsPanel.$importsListEl.find("li").length;
			if (importscount > 0) {
				thisTabsPanel.$importsCountEl.html("(" + importscount + ")");
			} else {
				thisTabsPanel.$importsCountEl.empty();
			}
        };
        thisTabsPanel.bindImportsEvents = function (nodeRef) {
            	
        	// MANAGE CLICK ON OPEN ICON
        	thisTabsPanel.$importsListEl.find("a[id^='open-']").click(function(e) {
				e.preventDefault();
				Imaging.onClickAction.openImport($(this));
			});
			
			// MANAGE CLICK ON EDIT ONLINE
        	thisTabsPanel.$importsListEl.find("a[id^='edit-']").click(function(e) {
				e.preventDefault();
				Imaging.onClickAction.editImport($(this), nodeRef);
			});
			
			// MANAGE CLICK ON VIEWER ICON
        	thisTabsPanel.$importsListEl.find("a[id^='view-']").click(function(e) {
				e.preventDefault();
				Imaging.onClickAction.viewerForImport($(this));
			});
			
			// MANAGE CLICK ON DELETE IMPORT
        	thisTabsPanel.$importsListEl.find("a[id^='del-']").click(function(e) {
				e.preventDefault();
				Imaging.onClickAction.deleteImport($(this), nodeRef);
			});
        };
        thisTabsPanel.refresh = function(getData) {
        	var thisObj = this;
        	var displayImportsFn = function(html) {
        		thisObj.initImportsTab(html);
        		thisObj.updateImportsCount();
        		thisObj.bindImportsEvents(getData.nodeRef);
        	};
        	var listDocCommentsFn = function(jsonResponse) {
        		var maindocref = jsonResponse.docinfo.nodeRef,
        			displayCommentsFn = function(html, docRef, maindocref) {
        				thisObj.initNotesTab(html, docRef, maindocref);
        				thisObj.updateCommentsCount();
        			},
        			getDataComments = { docRef:getData.nodeRef, nodeRef: maindocref, activityType: "document", htmlid: "tab-notes" }; 
        		
        		Imaging.ajax.get(WS_URLS.docListComments, getDataComments, function(jsonResult) { displayCommentsFn(jsonResult, getData.nodeRef, maindocref); });
        	};
        	// IMPORTS
        	Imaging.ajax.get(WS_URLS.docListImports, getData, displayImportsFn);
        	// NOTES (COMMENTS)
        	Imaging.ajax.getJson(WS_URLS.docMainPDFRef, getData, listDocCommentsFn);
        };
    };
    
    return {
    	TabsPanel: new TabsPanel(),
    	Boxes: new Boxes()
    };
};

/********************************************************************
 *********************** CALLBACKS **********************************
 ********************************************************************/
Imaging.callbackMgr = function() {
	
	var mgr = {};
	
	var callbacks = {
		/**
		 * Callback function for toworkitems action.
		 * Return to "page-boxes", displaying default "my work items" box or open the viewer.
		 */
		toworkitems: function(nodeRef) {
			
			var manageAutoviewFn = function(jsonResponse, nodeRef) {
					Imaging.utils.reloadWorkitemPage(nodeRef);
		    		if (jsonResponse.prefValue === "true") {
		    			Imaging.utils.openViewer(nodeRef);
		    		}
		    	},
		    	onSuccessFn = function() {
		    		Imaging.utils.getUserPref("autoview", function(jsonResponse) { manageAutoviewFn(jsonResponse, nodeRef); } );
		    	};
			
		    Imaging.action.runWebscriptAction("toworkitems", false, nodeRef, onSuccessFn);
	    	
		},
		/**
		 * Callback function for release action.
		 * Refresh page by clicking on the selected box.
		 */
		release: function(nodeRef) {
			
			
			var executeRelease = function() {
				var onSuccessFn = function() {
					Imaging.utils.reloadWorkitemPage();
				}
				Imaging.action.runWebscriptAction("release", true, nodeRef, onSuccessFn);
			};
			
			var checkYesNoSaveAnnotFn = function(val) {
				if (val === "Y") {
					ViewONE.saveAnnotations();
					setTimeout(function() {executeRelease();}, 500);
				} else {
					executeRelease();
				}
			};
			
			//if (Imaging.utils.getURLPage() === "page-document" && typeof ViewONE !== "undefined" && ViewONE.isAnnotationsUpdated()) {
			//	Imaging.utils.yesnoBox("Save annotations", "Do you want to save annotations ?", checkYesNoSaveAnnotFn);
			//} else {
				executeRelease();
			//}
			
		},
		/**
		 * Callback function for adminrelease action.
		 */
		adminrelease: function(nodeRef) {
			
			var onSuccessFn = function() {
				Imaging.utils.reloadAdminPage();
			}
			Imaging.action.runWebscriptAction("adminrelease", false, nodeRef, onSuccessFn);
			
		},
		/**
		 * Callback function for sendtoworkflow action.
		 */
		sendtoworkflow: function(nodeRef) {
			
			var onSuccessFn = function() {
				Imaging.utils.reloadWorkitemPage();
			}
			Imaging.action.runWebscriptAction("sendtoworkflow", false, nodeRef, onSuccessFn);
			
		},
		/**
		 * Callback function for close action.
		 * Close the viewer window.
		 */
		close: function() {
			
			var checkYesNoSaveAnnotFn = function(val) {
				if (val === "Y") {
					ViewONE.saveAnnotations();
					setTimeout(function() {Imaging.utils.reloadWorkitemPage();}, 500);
				} else {
					Imaging.utils.reloadWorkitemPage();
				}
			};
			
			if (typeof ViewONE !== "undefined") { // Viewer applet is not crashed
				//if (Imaging.utils.getURLPage() === "page-document" && ViewONE.isAnnotationsUpdated()) {
				//	Imaging.utils.yesnoBox("Save annotations", "Do you want to save annotations ?", checkYesNoSaveAnnotFn);
				//} else {
					Imaging.utils.reloadWorkitemPage();
				//}
			} else {
				Imaging.utils.reloadWorkitemPage();
			}
		},
		/**
		 * Send to default callback.
		 */
		sendtodefault: function(nodeRef) {
			
			var onSuccessFn = function() {
					Imaging.utils.reloadWorkitemPage();
				},
	    		checkYesNoSaveAnnotFn = function(val) {
					if (val === "Y") {
						ViewONE.saveAnnotations();
					}
					Imaging.action.runWebscriptAction("sendtodefault", true, nodeRef, onSuccessFn);
				};
			
			if (typeof ViewONE !== "undefined") { // Viewer applet is not crashed
				//if (Imaging.utils.getURLPage() === "page-document" && ViewONE.isAnnotationsUpdated()) {
				//	Imaging.utils.yesnoBox("Save annotations", "Do you want to save annotations ?", checkYesNoSaveAnnotFn);
				//} else {
					Imaging.action.runWebscriptAction("sendtodefault", true, nodeRef, onSuccessFn);
				//}
			} else {
				Imaging.action.runWebscriptAction("sendtodefault", true, nodeRef, onSuccessFn);
			}
		},
		/**
		 * Link callback.
		 */
		link: function(nodeRef) {
			var confirmActionFn = function(jsonResult) {
					if (jsonResult.actionstatus !== "OK") {
						Imaging.utils.errorBox("Action failure", "An error occured during link action !");
					}
				},
				checkLinkStatusFn = function(jsonResult) {
					
					if (jsonResult.actionstatus === "OK") {
						Imaging.ajax.postJsonDisable(WS_URLS.docSave, {nodeRef: nodeRef, "fds:docLinked": true}, confirmActionFn);
					} else {
						Imaging.utils.errorBox("Action failure", jsonResult.errormessage);
					}
				},
				linkImageFn = function(val, context) {
					$(".web-preview").css("visibility","visible");
					if (val === "Y") {
						Imaging.ajax.postJsonDisable(WS_URLS.pbLinkImage, {nodeRef: nodeRef, context: context}, checkLinkStatusFn);
					}
				},
				addTableRowFn = function(label, value) {
					if (value != null) {
						return "<tr><td>" + label + " :</td><td>" + value + "</td></tr>";
					} else {
						return "";
					}
				},
				isLinkableFn = function(jsonResult, context) {
					if (jsonResult.islinkable === "yes") {
						var confirmMessage = "<p>Please confirm you want to link the current document with the following context :</p><table>";
						confirmMessage += addTableRowFn("Dossier", context.refdossier);
						confirmMessage += addTableRowFn("Employer", context.employer);
						confirmMessage += addTableRowFn("Employee", context.worker);
						confirmMessage += addTableRowFn("Person", context.person);
						confirmMessage += addTableRowFn("Keyword1", context.keyword1);
						confirmMessage += addTableRowFn("Keyword2", context.keyword2);
						confirmMessage += "</table>";
						
						Imaging.utils.yesnoBox("Confirm link action ?", confirmMessage, function(val){linkImageFn(val, context);});
						
					} else {
						Imaging.utils.errorBox("Action failure", "This document type is not linkable with this context !");
					}
				},
				selectPBContextFn = function(linkContexts) {
					var formHtmlDialog = "",
						context,
						getData,
						contextIndex = 0,
						closeDialogFn = function() {
							$("#context-dialog").remove();
							$(".web-preview").css("visibility","visible");
						},
						selectContext = function() {
							context = linkContexts.contextlist[contextIndex];
							getData = {nodeRef: nodeRef, refscreen: context.refscreen, specialjp: context.specialjp, refgajur: context.refgajur};
							Imaging.ajax.getJson(WS_URLS.pbIsLinkable, getData, function(jsonResult) { isLinkableFn(jsonResult, context) } );
						};
						
					if (linkContexts.contextlist.length == 0) {
						Imaging.utils.errorBox("Action failure", "No valid PB context was found !");
					} else if (linkContexts.contextlist.length == 1) {
						selectContext();
					} else { //More than one context
						
						formHtmlDialog = "<div id='context-dialog'><p>Multiple Client/Server sessions were found, please select the session id you want to use ...</p><form><ul>";
						for (var i = 0; i < linkContexts.contextlist.length; i++) {
							formHtmlDialog += "<li><input type='radio' name='context' value='"  + i + "' /> Id " + linkContexts.contextlist[i].sessionid + "</li>"; 
						}
						formHtmlDialog += "</ul></form></div>";
						$(formHtmlDialog).appendTo("body");
						
						$("#context-dialog input:radio[name=context]").click(function() {
							contextIndex = $(this).val();
							$(".ui-dialog-buttonset button:first").css("display", "inline-block");
						});
						
						// Show dialog to allow the user to select the session id.
						$(".web-preview").css("visibility","hidden");
						$("#context-dialog").dialog( {
							title: "Multiple sessions found",
							autoOpen: true,
						    height: 300,
						    width: 350,
						    modal: true,
						    dialogClass:'choose-context-dialog',
						    buttons: {
						    	"Submit": function() {
						    		closeDialogFn();
						    		selectContext();
						    	},
						    	Cancel: function() {
						    		$("#context-dialog").dialog( "close" );
						    	}
						    },
						    close: closeDialogFn
						});
						
						$(".ui-dialog-buttonset button:first").css("display", "none");
					}
					
				};
			
			Imaging.ajax.getJsonDisable(WS_URLS.pbReadContext, {}, selectPBContextFn);
		},
		/**
		 * Display the import dialog.
		 */
		addimports: function(nodeRef) {
			
			var getData = {nodeRef: nodeRef},
				selectRowFn = function() {
					$("tr[id='" + nodeRef + "']").trigger("click");
				},
				manageImportActionFn = function(jsonData) {
					
					if (jsonData.isinmyworkitem === "yes") {
						$("#uploadbox table tbody").empty();
						
						if (Imaging.utils.getURLPage() === "page-document") {
							$("#uploadbox").showImagingDialog({
								onclosecallback: function() { Imaging.boxes.refreshImportsAndNotes(nodeRef); } 
							});
						} else {
							$("#uploadbox").showImagingDialog({
								onclosecallback: selectRowFn 
							});
						}
						
						// DropZone Initialisation
						$("#dropzoneUpload input").val(nodeRef);
						
					} else {
						Imaging.utils.errorBox("Action error", "The document is no more in your workitem !");
					}
				};
				
			Imaging.ajax.getJson(WS_URLS.isInMyWI, getData, manageImportActionFn);
		},
		/**
		 * Display the index form dialog.
		 */
		editmetadata: function(nodeRef) {
			
			var saveCallbackFn = function(nodeRef, button) {
					if (Imaging.utils.getURLPage() === "page-document") {
						$(".closeform").trigger("click");
					} else {
						$(".closedialog").trigger("click");
						if (button === "savesend") {
							Imaging.action.runWebscriptAction("sendtodefault", true, nodeRef, Imaging.utils.reloadWorkitemPage);
						} else {
							Imaging.utils.reloadWorkitemPage();
						}
					}
				},
				$mydialog = $('<div id="indexformdialog" class="modaldialog"><div id="editmetadata" class="actiondialoglarge"><div class="closedialog"></div></div></div>').appendTo("body"),
				getData,
				showIndexFormFn = function(html) {
					if (Imaging.utils.getURLPage() === "page-document") {
						
						$(".web-preview").css("width","74%");
						$("#indexformpanel").html(html);
						$("#indexformpanel").show();
						
						var $form = $("#indexFormID").watchChanges();
						
						$("#indexformpanel select").chosen({ 
							width: "100%",
							allow_single_deselect: true
						}).change(function() {
							//Manage dirty status 
							if ($(this).data("basevalue") !== $(this).val()) {
								$(this).next(".chosen-container").addClass("dirty");
							} else {
								$(this).next(".chosen-container").removeClass("dirty");
							}
						});
						//Manage dirty status 
						$("#indexformpanel input[type='text']").on('input', function() {
							if ($(this).data("basevalue") !== $(this).val()) {
								$(this).parent().addClass("dirty");
							} else {
								$(this).parent().removeClass("dirty");
							}
						});
						$("#indexformpanel input[type='checkbox']").on('click', function() {
							if ($(this).data("basevalue") !== $(this).prop("checked")) {
								$(this).parent().addClass("dirty");
							} else {
								$(this).parent().removeClass("dirty");
							}
						});
					} else {
						$("#editmetadata").append(html);
						$("#editmetadata select").chosen({ 
							width: "100%",
							allow_single_deselect: true
						});
					}
					
					
					//Manage enable/disable person selection
					Imaging.utils.managePersonSelection();
					$("select[name='fds:workBox']").change(function() {
						Imaging.utils.managePersonSelection();
					});
					
					$("select[name='fds:workAssignee']").change(function() {
						if ($("select[name='fds:workBox']").val() === "MY PERSONAL") {
							if ($(this).val() !== "") {
								$("#indexFormID input#submit").prop("disabled", false);
								$("#indexFormID input#savesend").prop("disabled", false);
							} else {
								$("#indexFormID input#submit").prop("disabled", true);
								$("#indexFormID input#savesend").prop("disabled", true);
							}
						}
					});
					
					$("#indexFormID input[type=submit]").click(function() {
					    $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
					    $(this).attr("clicked", "true");
					});
					
					$("#indexFormID").submit(function(e) {
						e.preventDefault();
						var $form = $(this),
							jsonData = Imaging.form.getFieldsAsObject($form),
							button = $("input[type=submit][clicked=true]").attr("name");
					
						Imaging.ajax.postJson(WS_URLS.docSave, 
								jsonData, 
								function() { saveCallbackFn(nodeRef, button); }
						);
				    
					});
		        
					if (Imaging.utils.getURLPage() === "page-document") {
						$(".closeform").click(function(e) {
							e.preventDefault();
							$("#indexformpanel").hide();
							$(".web-preview").css("width","100%");
						});
					} else {
						$mydialog.showImagingDialog({onclose: "remove"});
					}
				};
			
			if (Imaging.utils.getURLPage() === "page-document") {
				getData =  { nodeRef: nodeRef, formtype: "inline" };
			} else {
				getData =  { nodeRef: nodeRef, formtype: "dialog" };
			}
			Imaging.ajax.get(WS_URLS.indexForm, getData, showIndexFormFn);
		},
		/**
		 * Multi indexform.
		 */
		multi_indexform: function() {
			
			// *********** VARIABLES ****************
			var checkSendToDefaultResultFn = function(jsonResult) { // Check the multi sendtodefault execution status
	    	    	if (jsonResult.actionstatus === "OK") {
	    	    		Imaging.utils.reloadWorkitemPage();
	    	    	} else {
	    	    		Imaging.utils.errorBox("Action failed", jsonResult.errormessage);
	    	    	}
	    	    },
	    	    autoSendToDefaultFn = function(nodeRefs) {
					
					var getData = { noderefs: nodeRefs, action: "sendtodefault", method: "POST" };
					
					Imaging.ajax.getJsonDisable(WS_URLS.multiAction, getData, checkSendToDefaultResultFn );
				},
				checkSaveActionResultFn = function(jsonResult, nodeRefs) { // Check the multi save execution status
	    	    	if (jsonResult.actionstatus === "OK") {
	    	    		$("#btnCancel").trigger("click"); // Close dialog
	    	    		autoSendToDefaultFn(nodeRefs);
	    	    	} else {
	    	    		Imaging.utils.errorBox("Action failed", jsonResult.errormessage);
	    	    	}
	    	    },
				showIndexFormFn = function(html) { // FUNCTION DISPLAYING THE INDEX FORM
					var $mydialog = $('<div id="indexformdialog" class="modaldialog"><div id="editmetadata" class="actiondialog"><div class="closedialog"></div></div></div>').appendTo("body");
					
					$("#editmetadata").append(html);
					
					$("#editmetadata select").chosen({ 
						width: "100%",
						allow_single_deselect: true
					});
					
					//Manage enable/disable person selection
					Imaging.utils.managePersonSelection();
					$("select[name='fds:workBox']").change(function() {
						Imaging.utils.managePersonSelection();
					});
					
			        $("#indexFormMultiID").submit(function(e) {
				        e.preventDefault();
			
						var getData = Imaging.form.getFieldsAsObject($(this)),
							nodeRefs = [];
						
				        $(":checkbox[name='rows']:checked").each(function() {
				        	nodeRefs.push($(this).val());
				        });
				        
				        getData["noderefs"] = nodeRefs;
				        getData["action"] = "savedocument";
				        getData["method"] = "POST";
				        
				        Imaging.ajax.get(WS_URLS.multiAction, getData, function(jsonResult) { checkSaveActionResultFn(jsonResult, nodeRefs); } );
				        
			        });
					
					$mydialog.showImagingDialog({onclose: "remove"});

				},
				getIndexFormFn = function(jsonData) { // FUNCTION TO CHECK IF INDEX FORM CAN BE DISPLAYED
					if (jsonData.hasaspect === "yes") {
						// Generate form
						Imaging.ajax.get(WS_URLS.indexFormMulti, showIndexFormFn);
					} else {
						Imaging.utils.errorBox("Selection error", "One ore more selected documents are not in the workflow !");
					}
				},
				getData = {},
				nodeRefs = [];
			// *********** END VARIABLES ****************
				
		    $(":checkbox[name='rows']:checked").each(function() {
		    	nodeRefs.push($(this).val());
		    });
		    getData["nodeRef"] = nodeRefs;
		    
		    // Need to have workflow aspect
			Imaging.ajax.getJson(WS_URLS.hasWfAspect, getData, getIndexFormFn);
		},
		/**
		 * Display the send dialog.
		 */
		send: function(nodeRef) {
			var getData = {	nodeRef: nodeRef  },
			    checkActionStatusFn = function(jsonResp) {
					if (jsonResp.actionstatus === "OK") {
						Imaging.utils.reloadWorkitemPage();
					} else if (jsonResp.actionstatus === "NOK"){
						Imaging.utils.errorBox("Action failed", jsonResp.errormessage);
					}
				},
				showSendFormFn = function(html) {
			    	//Show the dialog to select the assignee
			    	var $mydialog = $('<div id="senddialog" class="modaldialog"><div id="sendpanel" class="actiondialog"><div class="closedialog"></div></div></div>')
			    		.appendTo("body");
			    	
			    	$("#sendpanel").append(html);
			    	
					$("select#selectuser,select#priority").chosen({
						width: "100%",
						allow_single_deselect: true
					});
					
					//Manage enable/disable send button
					Imaging.utils.manageSendPersonSelection();
					$("select#selectuser").change(function() {
						Imaging.utils.manageSendPersonSelection();
					});
					
			        $("#sendform").submit(function(e) {
				        e.preventDefault();
						var $form = $( this ),
					    	assignee = $form.find("#selectuser").val(),
					    	priority = $form.find("#priority").val()
					    	url = $form.attr("action"),
					    	jsonData = { nodeRef: nodeRef, assignee: assignee, priority: priority };
						
						if (assignee !== "") {
							Imaging.ajax.postJson(url, jsonData, checkActionStatusFn);
						}
			    		
			        });
			        
			        $mydialog.showImagingDialog({onclose: "remove"});
					
				},
				
				manageSendActionFn = function(jsonResp) {
					var hasaspect = jsonResp.hasaspect,
						isinmypers = jsonResp.isinmypers;
					
					if (hasaspect === "yes") {
				    	if (isinmypers === "yes") {
				    		// The document is my personal after the user send the RESPONSE or automatic EXPIRATION
				    		Imaging.ajax.get(WS_URLS.sendForm, getData, showSendFormFn);
				        }
					} else {
						// The document is not yet in a my personal workflow
						Imaging.ajax.get(WS_URLS.sendForm, getData, showSendFormFn);
					}
				},
				
				runActionFn = function() { 
					Imaging.ajax.getJson(WS_URLS.hasMyPersonalAspect, getData, manageSendActionFn);
				},
				
				checkYesNoSaveAnnotFn = function(val) {
					if (val === "Y") {
						ViewONE.saveAnnotations();
					}
					Imaging.utils.runWithWorkitemPermission(nodeRef, runActionFn);
				};

			if (typeof ViewONE !== "undefined") { // Viewer applet is not crashed
				//if (Imaging.utils.getURLPage() === "page-document" && ViewONE.isAnnotationsUpdated()) {
				//	$(".web-preview").css("visibility","hidden"); 
				//	Imaging.utils.yesnoBox("Save annotations", "Do you want to save annotations ?", checkYesNoSaveAnnotFn);
				//} else {
					Imaging.utils.runWithWorkitemPermission(nodeRef, runActionFn);
				//}
			} else {
				Imaging.utils.runWithWorkitemPermission(nodeRef, runActionFn);
			}
		},
		/**
		 * Multi release.
		 */
		multi_release: function() {
			Imaging.utils.reloadWorkitemPage();
		},
		/**
		 * Multi adminrelease.
		 */
		multi_adminrelease: function() {
			Imaging.utils.reloadAdminPage();
		},
		/**
		 * Multi send to default.
		 */
		multi_sendtodefault: function() {
			Imaging.utils.reloadWorkitemPage();
		},
		/**
		 * Multi to work items.
		 */
		multi_toworkitems: function(firstNodeRef) {
			var manageAutoviewFn = function(jsonResponse, nodeRef) {
				if (jsonResponse.prefValue === "true") {
					Imaging.utils.reloadWorkitemPage(nodeRef);
					Imaging.utils.openViewer(nodeRef);
				} else {
					Imaging.utils.reloadWorkitemPage(nodeRef);
				}
			}
			Imaging.utils.getUserPref("autoview", function(jsonResponse) { manageAutoviewFn(jsonResponse, firstNodeRef); } );
		}
	}
    mgr.executeCallback = function(actionName, nodeRef) {
		if (callbacks.hasOwnProperty(actionName)) {
			callbacks[actionName](nodeRef);
		} else {
			console.log("Callback manager fail to find callback method !");
		}
	};
	
    return mgr;
};

//return Imaging;
	
//});