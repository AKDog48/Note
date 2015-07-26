APP.notesController = (function (){
	"use strict";

	function showTagList(successCallback){
		APP.note.selectTags(function (data){
			$("#tags").html(APP.templates.tagList(data));
		});
	}

	function showTitleList(tagName, successCallback){
		APP.note.selectTitles(tagName, function (data){
			$("#titles").html(APP.templates.titleList(data));
		});
	}

	function showContents(key, successCallback){
		// console.log("'"+key+"'");
		APP.note.selectContents(key,function (data,key){
			var contents = markdown.toHTML(data.Contents);
			// console.log(contents,data);
			$("#contents").html(APP.templates.contents(data,contents,key));
			// console.log(key,APP.templates.contents(data));
		});
	}

	function newNote(successCallback){
		$("#titles").html(APP.templates.edit());
		$("#contents").html(APP.templates.markdown());
		$("#newContents").bind('input propertychange',function(){
			$("#markdownview").html(markdown.toHTML(this.value));
		});
	}

	function saveNote(key){
		var title = $("#newTitle").val();
		var tags = $("#newTags").val();
		var contents = $("#newContents").val();
		if(!title){
			alert("标题不合法");
		}else if(!tags){
			alert("标签不合法");
		}else {
			var tagArr = tags.split(",");
			var notes = {
				Title: title, Tags:tagArr, Contents: contents, PublishTime: new Date().toLocaleString()
			};
			//console.log(notes);
			if(key){
				alert("确认保存编辑？");
				APP.note.addNote(notes,function(){
					// console.log(notes);
						APP.note.deleteNote(key,function(){
							alert("保存成功！");
						});
				});
			}else{
				APP.note.addNote(notes,function(){
					alert("保存成功！");
				});
			}
			
		}
	}

	function editNote(key){
		APP.note.selectContents(key,function(data){
			var contents = markdown.toHTML(data.Contents);

			$("#titles").html(APP.templates.edit(data,contents,key));
			$("#contents").html(APP.templates.markdown(contents));
			$("#newContents").bind('input propertychange',function(){
				$("#markdownview").html(markdown.toHTML(this.value));
			});
		});

	}
	function deleteNote(key){
		APP.note.deleteNote(key,function(){
				alert("删除成功");
		});
	}
	return {
		showContents: showContents,
		showTitleList: showTitleList,
		showTagList: showTagList,
		newNote: newNote, 
		saveNote: saveNote,
		editNote: editNote,
		deleteNote: deleteNote
	};
}());
