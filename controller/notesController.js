APP.notesController = (function (){
	"use strict";

	function showTagList(successCallback){
		APP.note.selectTags(function (data){
			$("#tags").html(APP.templates.tagList(data));
		})
	}

	function showTitleList(tagName, successCallback){
		console.log(tagName);
		APP.note.selectTitles(tagName, function (notes){
			$("#titles").html(APP.templates.titleList(notes));
		})
	}

	function showContents(key, successCallback){
		APP.note.selectContents(key, function (notes){
			$("#contents").html(APP.templates.contents(notes));
		})
	}

	return {
		showContents: showContents,
		showTitleList: showTitleList,
		showTagList: showTagList
	};
}());
