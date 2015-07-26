APP.applicationController = (function () {
	'use strict';

	function offlineWarning() {
		alert("This feature is only available online.");
	}

	function pageNotFound(){
		alert("That page you were looking for cannot be found.");
	}

	function showHome(){

		APP.notesController.showTagList();

		APP.notesController.showTitleList("关于");

		APP.notesController.showContents("1");

		// $("#refreshButton").click(function(){
		// 	if (navigator & navigator.onLine === false){
		// 		offlineWarning();
		// 	} else {
		// 		APP.articlesController.synchronizeWithServer(offlineWarning);
		// 	}
		// });
	}

	function showNote(tagName,key){
		// console.log("'"+tagName+"'","'"+key+"'",key != false);
		if(key != false){
			// console.log("show Contents");
			$("#contents").html(APP.templates.noteLoading());
			APP.notesController.showTagList();
			APP.notesController.showContents(key);
			// console.log("showContents done");
		}else{
			$("#titles").html(APP.templates.noteLoading());
			if(tagName == "new"){
				// console.log("show new");
				APP.notesController.showTagList();
				APP.notesController.newNote();
			}else{
				// console.log("show title");
				APP.notesController.showTagList();
				APP.notesController.showTitleList(tagName);
			}
		}
	}

	function route(){
		var page = window.location.hash;
		var tag = "", key = "";

		if (page){
			for(var i = 1; i < page.length; i++){
				if (page.charCodeAt(i) < 48 || page.charCodeAt(i) > 57) {
					tag = tag + page.charAt(i);
				} else {
					key = key + page.charAt(i);
				};
			}
			showNote(tag,key);
		} else {
			showHome();
		}
	}

	function start() {
		$('body').innerText = "Start!";
		APP.database.open(function(){
				//console.log("database callback success")
				$(window).bind("hashchange",route);
				$("body").html(APP.templates.application());

				route();
			});
	}

	return {
		start: start
	};
}());
