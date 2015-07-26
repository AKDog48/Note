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
			return '<a href="">刷新</a><dl><dt>记事本</dt><dt><a href="#new">新建笔记</a></dt></dl><p><i>No notes have been found, maybe you should <b>create a note</b></i></p>';
		}

		for (i = 0; i < data.length; i = i + 1){
			for (l = 0; l < data[i].value.Tags.length; l = l + 1){
				tags.push(data[i].value.Tags[l]);
			}
		}

		for (var o = 0; o < tags.length; o = o + 1){
			hash[tags[o]] = (hash[tags[o]] || 0) + 1;
		}

		for (var j in hash){
			output = output + '<dd><h2><a href="#'+ j +'">' + j + '(' + hash[j] + ')' + '</a></h2></dd>';
		}
		return '<a href="">刷新</a><dl><dt>记事本</dt>' + output + '<dt><a href="#new">新建笔记</a></dt></dl>';
	}

	function titleList(notes){
		var i, l, output = " ";
		if(!notes.length) {
			return "<p><i>No notes have been found, maybe you should <b>create a note</b></i></p>";
		}

		for (i = 0; i < notes.length; i++){
			if (notes[i].key == 1){
				output = output + '<dd><h3><a href="#' + notes[i].key + '">'+ notes[i].value.Title +'</a></h2></dd>';

			}else{
				output = output + '<dd><h3><a href="#' + notes[i].key + '">'+ notes[i].value.Title +'</a></h2> <button class="deleteA" onclick="APP.notesController.deleteNote('+notes[i].key+');">删除</button><button class="editA" onclick="APP.notesController.editNote('+notes[i].key+');">编辑</button></dd>';
			}
		}

		return "<dl><dt>笔记</dt>" + output + "</dl>";
	}

	function contents(note,contents) {
		if(!note) { 
			window.location = "#error";
		}
		// var markdownContent = markdown.toHTML(note.Contents);
		// console.log(markdown.toHTML("!!"));
		return "<h3>标题: "+ note.Title + "</h3>" + "<h4><strong>标签: </strong>" + note.Tags.join(",") + "</h4><h4><strong>发表时间: </strong>"+ note.PublishTime+"</h4><br/>"+ contents 
	}

	function noteLoading() {
    return 'Please wait&hellip;';
  }

  function edit(note,contents,key){
  	if(!note){
  		return '<h3>标题： <input id="newTitle" type="text"></h3><h3>标签：<input id="newTags"type="text" placeholder="多个标签请用,隔开，例如：tag1,tag2"></h3><h3>内容：</h3><textarea  id="newContents"></textarea></br><button id="newNote" onclick="APP.notesController.saveNote()">提交</button>';
  	}

		return '<h3>标题： <input id="newTitle" type="text" value='+note.Title+'></h3><h3>标签：<input id="newTags"type="text" value='+note.Tags.join(",")+'></h3><h3>内容：</h3><textarea  id="newContents">'+note.Contents+'</textarea></br><button id="newNote" onclick="APP.notesController.saveNote('+key+')">提交</button>';
  }

  function markdown(contents){
  	if(!contents){
	  	return '<div id="markdownview"></div>';
  	}else{
  		return '<div id="markdownview">'+contents+'</div>';
  	}
  }

	return {
		application: application,
		tagList: tagList,
		contents: contents,
		titleList: titleList,
		noteLoading: noteLoading,
		edit: edit,
		markdown: markdown
	};	
}());
