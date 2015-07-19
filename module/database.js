//indexedDB封装
APP.database = (function () {

	'use strict';

	var IDB = {
		name:"APP",
		version:1,
		db:null
	};

	function runQuery(query, data, successCallback) {


	}
	//
	function open(successCallback) {
		var version = version || 1;
		var request = window.indexedDB.open(IDB.name);

		request.onerrror = function(e) {
			console.log(e.currentTarget.error.message);
		};

		request.onsuccess = function(e) {
			IDB.db = e.target.result;
			console.log(IDB.db.version);
			IDB.db.onerrror = function(event){
				alert("Database error:" + evernt.target.errorCode);
				console.dir(event.target);
			};
			if(IDB.db.objectStoreNames.contains(IDB.name)){
				console.log("contains table" + IDB.name);
				var transaction = IDB.db.transaction([IDB.name],"readwrite");
				transaction.oncomplete = function(event){
					console.log("All done!");
				};
				transaction.onerrror = function (event) {
					console.dir(event);
				};
				runQuery("",[],successCallback);
			}else {
				console.log("Not found "+IDB.name+".objectStoreNames");
			}
		};

		request.onupgradeneeded = function(e) {
			console.log("running onupgradeneeded");
			IDB.db = e.target.result;
			console.log("DB version changed to"+version);
			if(!IDB.db.objectStoreNames.contains(IDB.name)){
				console.log("I need to create the objectStore");
				var objectStore = IDB.db.createObjectStore(IDB.name,{keyPath:'id', autoIncrement: true});
				objectStore.createIndex("Title", "Title", { unique: false});
			}
		};
	}
}());

