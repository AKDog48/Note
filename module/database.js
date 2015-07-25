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
		{Title:"使用手册", Tags:["关于"], Contents:"使用IndexDB存储的基于markdown语法的知识库", PublishTime: new Date().toLocaleString()}
	];

	function runQuery(query, data, successCallback) {

		var tx = IDB.db.transaction(IDB.storeName,'readwrite');
		var store = tx.objectStore(IDB.storeName);

		var queryGet = function (data,successCallback){
			var notes = [];
			store.openCursor().onsuccess = function(e){
				var cursor = e.target.result;
				if(cursor){
					console.log(cursor);
					notes.push(cursor);
					cursor.continue();
				}else{
					successCallback(notes);
				}
			}
		}

		var queryIndex = function (data,successCallback){
			store.openCursor().onsuccess = function(e){
				var cursor = e.target.result;
				if(cursor){
					if(cursor.key == data){
						successCallback(cursor.value);
					}
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
				console.debug("Insertion in DB successful");
				successCallback;
			};
			req.onerrror = function(){
				console.error("add error", this.error);
			}
		};

		var queryDelete = function (data,successCallback){
			store.delete(data);
			request.onsuccess = function(e){
				successCallback;
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
			console.log(IDB.db.version);
			IDB.db.onerrror = function(event){
				alert("Database error:" + evernt.target.errorCode);
				console.dir(event.target);
			};
			if(IDB.db.objectStoreNames.contains(IDB.storeName)){
				console.log("contains table" + IDB.name);
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
			runQuery("queryGet",[],successCallback);

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
				//Title可能重复，不能用unique索引
				objectStore.createIndex("titleIndex", "Title", {unique:false});

				objectStore.createIndex("tagsIndex", "Tags", {unique:false});

				//创建一个索引通过PublishTime搜索文章
				//两篇文章发表时间不会一样，因此使用unique索引
				objectStore.createIndex("PublishTime", "PublishTime", {unique:true});

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

