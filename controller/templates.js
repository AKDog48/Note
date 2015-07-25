APP.templates = (function (){
	'use strict';


	function application(){
		return "<div id='window'><div id='tags'></div><div id='titles'></div><div id='contents'></div>"
	}



	function tagList(data){
		var i, l, output = " ";
		var tags = [];
		var hash = {};

		if (!data.length) {
			return "<p><i>No notes have been found, maybe you should <b>create a note</b></i></p>";
		}

		for (i = 0; i < data.length; i = i + 1){
			for (l = 0; l < data[i].value.Tags.length; l = l + 1){
				tags.push(data[i].value.Tags[l]);
			}
		}

		for (var o = 0; o < tags.length; o = o +1){
			hash[tags[o]] = (hash[tags[o]] || 0) + 1;
		}

		for (var j in hash){
			output = output + '<li><h2><a href="#'+ j +'">' + j + '(' + hash[j] + ')' + '</a></h2></li>';
		}
		return '<dl><dt>记事本</dt>' + output + '<dt><a href="#new">新建笔记</a></dt></dl>';
	}

	function titleList(notes){
		var i, l, output = " ";
		console.log(notes);
		if(!notes.length) {
			return "<p><i>No notes have been found, maybe you should <b>create a note</b></i></p>";
		}

		for (i = 0; i < notes.length; i++){
			output = output + '<li><h3><a href="#' + notes[i].key + '">'+ notes[i].value.Title +'</a></h2></li>';
		}

		return "<dl><dt>笔记</dt>" + output + "</dl>";
	}

	function contents(note) {
		if(!note) { 
			window.location = "#error";
		}
		return "<h3>标题: "+ note.Title + "</h3>" + "<h4><strong>标签: </strong>" + note.Tags.join(",") + "</h4><h4><strong>发表时间: </strong>"+ note.PublishTime+"</h4><br/><p>"+ note.Contents +"</p>"
	}

	function noteLoading() {
    return 'Please wait&hellip;';
  }

	return {
		application: application,
		tagList: tagList,
		contents: contents,
		titleList: titleList,
		noteLoading: noteLoading
	};	
}());
