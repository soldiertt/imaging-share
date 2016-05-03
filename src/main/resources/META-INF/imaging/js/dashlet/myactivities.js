/**
 * Alfresco.Myactvities
 *
 */
(function()
{
  /**
   * YUI Library aliases
   */
  var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

  /**
   * Alfresco Slingshot aliases
   */
  var $html = Alfresco.util.encodeHTML;

  Alfresco.Myactivities = function(htmlId)
  {
    this.name = "Alfresco.Myactivities";
    this.id = htmlId;
    this.configDialog = null;

    /**
     * Register this component
     */
    Alfresco.util.ComponentManager.register(this);

    /**
     * Load YUI Components
     */
    Alfresco.util.YUILoaderHelper.require([],this.onComponentsLoaded,this);

    return this;
  };

  YAHOO.extend(Alfresco.Myactivities, Alfresco.component.Base,
  {
    /**
     * Object container for initialization options
     *
     * @property options
     * @type object
     */
    options:
    {
      /**
       * The component id
       *
       * @property componentId
       * @type string
       * @default ""
       */
      componentId: "",

      /**
       * The configurable bylettertypeStr to display
       *
       * @property bylettertypeStr
       * @type string
       * @default ""
       */
      bylettertypeStr: "",
      
      /**
       * The configurable usernameStr to display
       *
       * @property usernameStr
       * @type string
       * @default ""
       */
      usernameStr: "",
      
      /**
       * The configurable dateRangeStart to display
       *
       * @property dateRangeStartStr
       * @type string
       * @default ""
       */
      dateRangeStartStr: "",
      
      /**
       * The configurable dateRangeEnd to display
       *
       * @property dateRangeEndStr
       * @type string
       * @default ""
       */
      dateRangeEndStr: ""

    },

    /**
     * Fired by YUI when parent element is available for scripting.
     * Component initialisation, including instantiation of YUI widgets
     * and event listener binding.
     *
     * @method onReady
     */
    onReady: function A_onReady()
    {
      var configFeedLink = Dom.get(this.id + "-configMyactivities-link");
      if (configFeedLink)
      {
        Event.addListener(configFeedLink,"click",this.onConfigMyactivitiesClick,this,true);
      }
    },

    /**
     * Called when the user clicks the config Myactivities link.
     * Will open an Myactivities config dialog
     *
     * @method onConfigMyactivitiesClick
     * @param e The click event
     */
    onConfigMyactivitiesClick: function A_onConfigMyactivitiesClick(e)
    {
      var actionUrl = Alfresco.constants.URL_SERVICECONTEXT +
       "imaging/dashlet/myactivities/config/" + encodeURIComponent(this.options.componentId);

      if (!this.configDialog)
      {
        this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions({
          width: "30em",
          templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "imaging/dashlet/myactivities/config",
          actionUrl: actionUrl,
          doBeforeDialogShow:
          {
        	  fn: function Myactivities_doBeforeDialogShow_callback(response)
        	  {
        		  //init
        	  }
          },
          onSuccess:
          {
            fn: function Myactivities_onConfigFeed_callback(response)
            {
              
              var myactivities = response.json;

              // Save values for new config dialog openings
              this.options.bylettertypeStr = (myactivities && myactivities.bylettertype) ? myactivities.bylettertype : this.options.bylettertypeStr;
              this.options.usernameStr = (myactivities && myactivities.username) ? myactivities.username : this.options.usernameStr;
              this.options.dateRangeStartStr = (myactivities && myactivities.dateRangeStart) ? myactivities.dateRangeStart : this.options.dateRangeStartStr;
              this.options.dateRangeEndStr = (myactivities && myactivities.dateRangeEnd) ? myactivities.dateRangeEnd : this.options.dateRangeEndStr;
              
              var myActivities = this;
              
              require(["jquery", "jquerydatatable"], function($, jqDatatables) {

	              // Update dashlet body with new values
	              $("#dateRangeStart").html(myActivities.options.dateRangeStartStr);
	              $("#dateRangeEnd").html(myActivities.options.dateRangeEndStr);
	              $("#forUser").html(myActivities.options.usernameStr);
	              
	              var $actTableNormal = $("#myactivitiestable_normal");
	              var $actTableLettertype = $("#myactivitiestable_lettertype");
	              var actualBylettertype = myActivities.options.bylettertypeStr;
	              if (actualBylettertype === "true") {
	            	  var oTable = $actTableLettertype.dataTable();
	            	  $actTableLettertype.removeClass("hidden");
	            	  $actTableNormal.addClass("hidden");
	              } else {
	            	  var oTable = $actTableNormal.dataTable();
	            	  $actTableNormal.removeClass("hidden");
	            	  $actTableLettertype.addClass("hidden");
	              }
	              
	              oTable.fnClearTable();
	              $.each(myactivities.documents, function(index, entry) {
	            	  if (actualBylettertype === "true") {
	            		  oTable.fnAddData([entry.doctype, entry.lettertype, entry.count]);
	            	  } else {
	            		  oTable.fnAddData([entry.doctype, entry.count]);
	            	  }
	              });
              });
            },
            scope: this
          },
          doSetupFormsValidation:
          {
            fn: function Myactivities_doSetupForm_callback(form)
            {
              form.addValidation(this.configDialog.id + "-dateRangeStart",
            		  Alfresco.forms.validation.mandatory, null, "keyup");
              form.addValidation(this.configDialog.id + "-dateRangeStart",
                      Alfresco.forms.validation.regexMatch, {pattern: /^(0[1-9]|[1-9]|[12][0-9]|3[01])[-/](0[1-9]|[1-9]|1[012])[-/](19|20)\d\d$/}, "keyup");
              form.addValidation(this.configDialog.id + "-dateRangeEnd",
                      Alfresco.forms.validation.mandatory, null, "keyup");
              form.addValidation(this.configDialog.id + "-dateRangeEnd",
                      Alfresco.forms.validation.regexMatch, {pattern: /^(0[1-9]|[1-9]|[12][0-9]|3[01])[-/](0[1-9]|[1-9]|1[012])[-/](19|20)\d\d$/}, "keyup");
              form.setShowSubmitStateDynamically(true, false);

              //Dom.get(this.configDialog.id + "-username").value = this.options.usernameStr;
              var usernameStr = this.options.usernameStr
              $("#" + this.configDialog.id + "-bylettertype option").filter(function() {
            	  return $(this).text() == usernameStr; 
              }).prop('selected', true);
              //Dom.get(this.configDialog.id + "-bylettertype").value = this.options.bylettertypeStr;
              if (this.options.bylettertypeStr === "true") {
            	  $("#" + this.configDialog.id + "-bylettertype").prop("checked", true);
              }
              Dom.get(this.configDialog.id + "-dateRangeStart").value = this.options.dateRangeStartStr;
              Dom.get(this.configDialog.id + "-dateRangeEnd").value = this.options.dateRangeEndStr;
            },
            scope: this
          }
        });
      } else {
        this.configDialog.setOptions({
          actionUrl: actionUrl
        });
      }
      this.configDialog.show();
    }
  });
})();