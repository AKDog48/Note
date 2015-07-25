//增删查改

APP.note = (function () {
	'use strict';
	function addNote(id, successCallback){

	}

	function deleteNote(id, successCallback) {
		APP.database.runQuery();
	}

	function insertNotes(){
		
	}

	function selectTags(successCallback){
		APP.database.runQuery("queryGet", [], successCallback);
	}

	function selectTitles(tag, successCallback){
		console.log(tag);
		APP.database.runQuery("queryGet", [], function(e){
			var notes = [];
			for (var i = 0; i < e.length; i++) {
				console.log(i);
				for(var j = 0; j < e[i].value.Tags.length; j++){
					if (e[i].value.Tags[j] == tag){
						notes.push(e[i]);
						console.log(e[i]);
					}
				}
			}
			successCallback(notes);
		});
	}

	function selectContents(key, successCallback){
		APP.database.runQuery("queryIndex", key, successCallback);
	}

	return {
		addNote: addNote,
		deleteNote: deleteNote,
		insertNotes: insertNotes,
		selectTags: selectTags,
		selectContents: selectContents,
		selectTitles: selectTitles
	}
}());
