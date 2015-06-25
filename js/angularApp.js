var user = {name:"",image:"user-pictures/user-placeholder.png",surname:"",matricola:"",datanascita:"",lists:{mails:[],tels:[],addrs:[]}};
var suser;
angular.module('rubrica', [])
.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|callto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
])
.controller('ListsController', function($scope, $http) {
	var lists = this;
	http=$http;
	lists.mails = function(){
		return user.lists.mails;
	};
	lists.tels = function(){
		return user.lists.tels;
	};
	lists.addrs = function(){
		return user.lists.addrs;
	};
	lists.addMail = function() {
		user.lists.mails.push({text:lists.mailAddr, remove:false});
		lists.mail = '';
	};
	lists.removeAllMails = function() {
		var oldMails = user.lists.mails;
		user.lists.mails = [];
		angular.forEach(oldMails, function(mail) {
			if (!mail.remove) user.lists.mails.push(mail);
		});
	};
	lists.openMap = function(a){
		mapBox(a);
	};
	lists.addAddr = function() {
		user.lists.addrs.push({text:lists.addr, remove:false});
		lists.addr = '';
	};
	lists.removeAllAddrs = function() {
		var oldAddrs = user.lists.addrs;
		user.lists.addrs = [];
		angular.forEach(oldAddrs, function(addr) {
			if (!addr.remove) user.lists.addrs.push(addr);
		});
	};
	lists.addTel = function() {
		user.lists.tels.push({text:lists.tel, remove:false});
		lists.tel = '';
	};
	lists.removeAllTels = function() {
		var oldTels = user.lists.tels;
		user.lists.tels = [];
		angular.forEach(oldTels, function(tel) {
			if (!tel.remove) user.lists.tels.push(tel);
		});
	};
	//
})
.controller("UserController", function($scope, $http) {
	var cuser = this;
	cuser.data = function(){
		return user;
	};
	cuser.current= function(){ 
		return suser;
	}
})
.controller("ContactsController", function($scope, $http) {
	var cuser = this;
	cuser.searchbox = "";
	$http.post('/load')
	.success(function(data, status, headers, config) {
		data.forEach(function(o){
			o.isSelected = false;
			o.isNotNew = true;
		});
		cuser.contacts=data;
	})
	.error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
	});
	cuser.select = function(o){
		for (i=0;i<cuser.contacts.length;i++)
			cuser.contacts[i].isSelected=false;
		o.isSelected=true;
		suser=o;
		if(o.isNotNew){
			$http.post('/select', {matr:o.matricola})
			.success(function(data, status, headers, config) {
				var lists = data.lists;
				data.lists={};	
				user=data;
				user.lists.mails = lists.mails.map(function(o){ return {text:o,remove:false}});
				user.lists.addrs = lists.addrs.map(function(o){ return {text:o,remove:false}});
				user.lists.tels = lists.tels.map(function(o){ return {text:o,remove:false}});
			})
			.error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		} else 
			user= {name:"",surname:"",matricola:"",datanascita:"",lists:{mails:[],tels:[],addrs:[]}};
	};
	cuser.remove = function(o){
		for (i=0;i<cuser.contacts.length;i++){
			if(cuser.contacts[i].matricola==o)
			{
				var inn= cuser.contacts[i];
				$http.post('/remove', {matr:o})
				.success(function(data, status, headers, config) {
					if ((inn.isNotNew && data.isRemoved)||!inn.isNotNew)
					{
						cuser.contacts=cuser.contacts.filter(function(jj){
							if(jj.matricola!=o)
								return jj;
						});
						cuser.contacts.forEach(function(ll)  {
							ll.isSelected=false;
						});
						user={name:"",image:"user-pictures/user-placeholder.png",surname:"",matricola:"",datanascita:"",lists:{mails:[],tels:[],addrs:[]}};
					} 
					msgBox("Rubrica - information", data.text);				
				})
				.error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				});
			}
		}
	};
	cuser.search = function(o){
		var keys = cuser.searchbox.split(" ");
		if (keys.length>2){
			msgBox("Rubrica - warning!", "Non è possibile inserire più di due campi di ricerca!");
		}else{
			$http.post('/search',{query:keys})
			.success(function(data, status, headers, config) {
				data.forEach(function(o){
					o.isSelected = false;
					o.isNotNew = true;
				});
				cuser.contacts=data;
			})
			.error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}
	};
	cuser.add = function(){
		if (cuser.contacts.filter(function(o){
			if(o.isNotNew==false)
				return o;
			}).length==0){
				for (i=0;i<cuser.contacts.length;i++)
					cuser.contacts[i].isSelected=false;
				cuser.contacts.push({matricola:"", name:"", surname:"", isSelected:true,isNotNew:false});
				suser=cuser.contacts[cuser.contacts.length-1];
				user={name:"",image:"user-pictures/user-placeholder.png",surname:"",matricola:"",datanascita:"",lists:{mails:[],tels:[],addrs:[]}};
			}
		else
			msgBox("Rubrica - warning!", "E' possibile inserire solo un contatto per volta");
	};
	cuser.save = function(){
		var u = {name:user.name,
				 surname:user.surname,
				 matricola:user.matricola,
				 datanascita:user.datanascita,
				 image:user.image,
				 lists:{}};
		u.lists.mails = user.lists.mails.map(function(o){ return o.text});
		u.lists.addrs = user.lists.addrs.map(function(o){ return o.text});
		u.lists.tels = user.lists.tels.map(function(o){ return o.text});
		$http.post('/save',u)
		.success(function(data, status, headers, config) {
			msgBox("Rubrica - information", data);
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
		for (i=0;i<cuser.contacts.length;i++)
			if(cuser.contacts[i].isSelected==true)
				cuser.contacts[i].isNotNew=true;
	};	
});

function saveOutsideController(){
	angular.element(document.getElementById('ContactsController')).scope().conts.save();
}
function removeOutsideController(){
	angular.element(document.getElementById('ContactsController')).scope().conts.remove(user.matricola);
}
function msgBox(head, message){
	$("#msg-box h4").text(head);
    $("#msg-box p").text(message);
    $("#msg-box").modal();
}
function mapBox(head){
	$("#map-box h4").text(head);
    $("#map-box").modal();
    $("#map-box").customAddr=head;
}
function SetMap(addr){
	GMaps.geocode({
		address: addr.trim(),
		callback: function(results, status){	
			if(status=='OK'){
				$("#map").height("50%");
				$("#map-box h4").text(results[0].formatted_address);
				map = new GMaps({
					div: '#map',
					lat: -12.043333,
					lng: -77.028333,
					zoom: 17
				});
				var latlng = results[0].geometry.location;
				map.setCenter(latlng.lat(), latlng.lng());
				map.addMarker({
					lat: latlng.lat(),
					lng: latlng.lng()
				});
			} else{
				$("#map").height("50px");
				$("#map").html("Non è stato possibile trovare l'indirizzo <i>" + addr.trim() + "</i> sulla mappa.");
			}
		}
	});
}


