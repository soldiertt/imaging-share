$(function() {
	
	$("#pref-form form").submit(function(e) {
	  
		e.preventDefault();
		var $form = $(this),
			url = $form.attr("action"),
			postData = Imaging.form.getFieldsAsObject($form),
			checkActionStatusFn = function(jsonResp) {
				if (jsonResp.actionstatus === "OK") {
					Imaging.utils.infoBox("Preferences saved", "Your preferences were saved successfully !");
				} else if (jsonResp.actionstatus === "NOK") {
					Imaging.utils.errorBox("Preferences not saved", jsonResp.errormessage);
				}
			};

		//Manage checkboxes separately
		if ($form.find(":checkbox").filter("[name='autoview']").prop("checked")) {
			postData.autoview = "true";
		} else {
			postData.autoview = "false";
		}
		if ($form.find(":checkbox").filter("[name='autoform']").prop("checked")) {
			postData.autoform = "true";
		} else {
			postData.autoform = "false";
		}
		if ($form.find(":checkbox").filter("[name='annotationautosave']").prop("checked")) {
			postData.annotationautosave = "true";
		} else {
			postData.annotationautosave = "false";
		}
		
		Imaging.ajax.postJson(url, postData, checkActionStatusFn);
		
	});
  
});

