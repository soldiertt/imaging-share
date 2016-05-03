<#assign el=args.htmlid?js_string>
	   
<div id="${el}-body" class="comments-list">
	
	<#if (isReadOnly!false)?string == "false">
	<div class="comments-list-actions">
		<div>
	    	<div id="${el}-actions">
	          <button class="btn-displaynewcomment btn btn-default">Add comment</button>
	       	</div>
	    </div>
	    <div id="newcomment" class="hidden">
	    	<form>
    			<textarea id="newcommentarea"></textarea>
    			<button class="btn-addcomment btn btn-default">Submit</button>
    			<button class="btn-cancelcomment btn btn-default">Cancel</button>
  			</form>
	    </div>
	</div>
	</#if>
	
	<h1>Comments</h1>
	<#if comments?has_content>
	<ul id="tab-notes-comments-list">
		<#list comments as comment>
		<li id="${comment.nodeRef}">
			<div class="viewmode">
				<h2>${comment.title}	
				<span class="right-actions">
					<#if comment.permissions.delete><span class="glyphicon glyphicon-trash delete-comment-link" title="Delete"></span></#if>
					<#if comment.permissions.edit><span class="glyphicon glyphicon-pencil edit-comment-link" title="Edit"></span></#if>
				</span>
				</h2>
				<div class="comment-content">${comment.content}</div>
			</div>
			<div class="editcomment hidden">
				<h2>${comment.title}</h2>
		    	<div class="comment-content">
	    			<textarea id="editcommentarea-${comment.name}">${comment.content}</textarea>
	    			<button class="btn-savecomment btn btn-default">Save comment</button>
					<button class="btn-cancelcomment btn btn-default">Cancel</button>
	  			</div>
			</div>
		</li>
		</#list>
	</ul>
	</#if>
	<#if !comments?has_content>
		No comment
	</#if>
	
	<#if (isReadOnly!false)?string == "false">
		<div class="comments-list-actions">
	    	<div class="left">
	    	</div>
	    	<div class="right">
	   	   		<div id="${el}-paginator-bottom"></div>
	    	</div>
	    	<div class="clear"></div>
	   </div>
	</#if>
</div>
