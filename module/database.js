//indexedDB封装
APP.database = (function () {

	'use strict';

	var IDB = {
		name:"APP",
		storeName: "notes",
		version:1,
		db:null
	};
	var notesData = [
		{Title:"使用手册", Tags:["关于"], Contents:"使用IndexedDB存储的基于markdown语法的知识库。我们就是**AKDog48 Crew!** 致谢：[百度IFE](https://github.com/baidu-ife)", PublishTime: new Date().toLocaleString()}
	];

	function runQuery(query, data, successCallback) {

		var tx = IDB.db.transaction([IDB.storeName],"readwrite");
		var store = tx.objectStore(IDB.storeName);

		var queryGet = function (data,successCallback){
			var notes = [];

			store.openCursor().onsuccess = function(e){
				var cursor = e.target.result;
				var note = {key : "",value : null};
				if(cursor){
					note.key = cursor.key;
					note.value = cursor.value;
					notes.push(note);
					// console.log(cursor.key,cursor.value);
					cursor.continue();
				}
				else{
					// console.log(note,notes);
					successCallback(notes);
				};

			}
		}

		var queryIndex = function (data,successCallback){
			store.openCursor().onsuccess = function(e){
				var cursor = e.target.result;
				if(cursor){
					// console.log(cursor.key,cursor.value);
					if(cursor.key == data){
						// console.log(cursor.value);
						successCallback(cursor.value,cursor.key);
					}
					cursor.continue();
				}
			}
		}

		var queryAdd = function (data,successCallback){
			if(!IDB.db){
				console.error("queryAdd: the db is not open");
				return;
			}
			var req = store.add(data);
			req.onsuccess = function (e){
				successCallback();
			};
			req.onerrror = function(){
				console.error("add error", this.error);
			}
		};

		var queryDelete = function (data,successCallback){
			var key = parseInt(data);
			var req = store.delete(key);
			req.onsuccess = function(e){
				successCallback();
			};
		};

		switch(query)
		{
			case "queryIndex":
				return queryIndex(data,successCallback);
				break;
			case "queryGet":
				return queryGet(data,successCallback);
				break;
			case "queryAdd":
				return queryAdd(data,successCallback);
				break;
			case "queryDelete":
				return queryDelete(data,successCallback);
				break;
			default:
				console.error(query+" is not undefiend");
		}
		
	}
	//
	function open(successCallback) {
		var version = version || 1;
		var request = window.indexedDB.open(IDB.name, IDB.version);

		request.onblocked = function(e){
			alert("Please close all other tabs with this site open!");
		};

		request.onerrror = function(e) {
			console.error("open:", e.target.errorCode);
		};

		request.onsuccess = function(e) {
			IDB.db = e.target.result;
			IDB.db.onerrror = function(event){
				alert("Database error:" + evernt.target.errorCode);
				console.dir(event.target);
			};
			if(IDB.db.objectStoreNames.contains(IDB.storeName)){
				//对表的读写权限
				var transaction = IDB.db.transaction([IDB.storeName],"readwrite");
				transaction.oncomplete = function(event){
					console.log("All done!");
				};
				transaction.onerrror = function (event) {
					console.dir(event);
				};
			}else {
				console.log("Not found "+IDB.name+".objectStoreNames");
			}
			//runQuery("queryGet",[],successCallback);
			successCallback();
		};

		request.onupgradeneeded = function(e) {
			console.log("running onupgradeneeded");
			IDB.db = e.target.result;
			console.log("DB version changed to"+version);
			if(!IDB.db.objectStoreNames.contains(IDB.storeName)){
				console.log("I need to create the objectStore");

				//创建一个对象存储空间来持有有关文章的信息
				var objectStore = IDB.db.createObjectStore(IDB.storeName,{autoIncrement: true});

				//创建一个索引通过Title搜索文章
				//Title不能重复
				objectStore.createIndex("titleIndex", "Title", {unique:true});

				objectStore.createIndex("tagsIndex", "Tags", {unique:false});

				//初始化一条记录
				for(var i in notesData){
					objectStore.add(notesData[i]);
				}
			}
		};

	}

	return {
		open: open,
		runQuery: runQuery
	};
}());

