require('string.prototype.startswith');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var path= require('path');
var app = express();
//app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');

/*data initialization*/
var users=[];
for(i=1;i<21;i++){
	users.push({
			name:"Nome_" + i,
			surname:"Cognome_" + i,
			matricola:"O46/00000" + i,
			datanascita:"Data " + i,
			image:"user-pictures/user-placeholder.png", 
			lists:{
					mails:["user_"+i+"@server.com"],
					tels:["tel - user_"+i],
					addrs:["indirizzo-user_"+i]
					}
			});			
}


// parse application/json
app.use(bodyParser.json());                        
app.use(express.static('./'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse multipart/form-data
//app.use(multer({ dest: './uploads' }));

var upload = multer({ dest: './uploads' });
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "\\address-book.html");
	res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(img);

});
app.get('/address-book', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "\\address-book.html");
	res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(img);

});

app.post('/select', function(req, res){
	console.log("select: " + JSON.stringify(req.body));
	var u = users.filter(function(o){
		if(o.matricola==req.body.matr)
			return o;
		});
	if (u.length>0)
		res.send(u[0]);
	else
		res.send({});
});

app.post('/load', function(req, res){
	console.log("load: " + JSON.stringify(req.body));
	res.send(users);
});

app.post('/save', function(req, res){
	console.log("save: " + JSON.stringify(req.body));
	var u = users.filter(function(o){ if (o.matricola==req.body.matricola) return o});
	if (u.length>0){
		users[users.indexOf(u[0])]=req.body;
		res.send({save:"upd"});
	} else{
		users.push(req.body);
		res.send({save:"ins"});
	}
});

app.post('/remove', function(req, res){
	console.log("remove: " + JSON.stringify(req.body));
	var u = users.filter(function(o){ if (o.matricola==req.body.matr) return o});
	if (u.length>0){
		users.splice(users.indexOf(u[0]),1)
		res.send({isRemoved:true, remUser:u[0]});
	} else{
		res.send({isRemoved:false});
	}
});

app.post('/search', function(req, res){
	console.log("search: " + JSON.stringify(req.body));
	var q = req.body.query;
	var ps = [];
	if (q.length==2){
		for (i=0; i<users.length;i++){
			if((users[i].name.toLowerCase().startsWith(q[0]) && 
				users[i].surname.toLowerCase().startsWith(q[1]))||
				(users[i].name.toLowerCase().startsWith(q[1]) && 
				users[i].surname.toLowerCase().startsWith(q[0]))) {
					ps.push(users[i]);
			}
		}
	}
	if (q.length==1){
		for (i=0; i<users.length;i++){
			if(users[i].name.toLowerCase().startsWith(q[0])||
			users[i].surname.toLowerCase().startsWith(q[0])) {
				ps.push(users[i]);
			}
		}
	}
	res.send(ps);
});

app.post('/upload', function(req, res) {
	console.log("upload: " + JSON.stringify(req.files));
	fs.readFile(req.files.image.path, function (err, data) {
		var imageName = req.files.image.name
		if(!imageName){
			console.log("There was an error")
			res.redirect("/");
			res.end();
		} else {
		var newPath = __dirname + "/user-pictures/" + imageName;
		//var thumbPath = __dirname + "/uploads/thumbs/" + imageName;
		fs.writeFile(newPath, data, function (err,data) {});
 	    res.end("/user-pictures/" + imageName);
		}
	});
});
app.get('/export/:name.json', function(req, res){
	console.log("export: " + JSON.stringify(req.query));
	if (typeof req.query.matr != "undefined") {
		if (req.query.matr!=""){
			var u = users.filter(function(o){
				if(o.matricola==req.query.matr)
					return o;
				});
			res.writeHead(200, {'Content-Type': 'application/octet-stream' });
			res.end(JSON.stringify(u, null, "\t"));
		}else {
			res.writeHead(200, {'Content-Type': 'application/octet-stream' });
			res.end(JSON.stringify(users, null, "\t"));
		}
	}
});
app.post('/import', function(req, res) {
	console.log("import: " + JSON.stringify(req.files));
	fs.readFile(req.files.imp.path, function (err, data) {
		var impName = req.files.imp.name
		if(!impName){
			console.log("There was an error")
			res.redirect("/");
			res.end();
		} else {
		var newPath = __dirname + "/" + impName;
		//var thumbPath = __dirname + "/uploads/thumbs/" + imageName;
		try {
			fs.writeFile(newPath, data, function (err,data) {
				var obj = JSON.parse(fs.readFileSync(newPath, 'utf8'));
				try {
					obj.forEach(function(o){
						var us = users.filter(function(j){
							if(j.matricola==o.matricola){
								return j;
							}
						});
						if(us.length>0){
							users[users.indexOf(us[0])]=o;
						}else{
							users.push(o);
						}
					});
				}
				catch(err){};
				fs.unlink(newPath, function (err) {});
			});
		} catch(err){}
 	    res.end("/user-pictures/" + impName);
		}
	});
});

app.listen(3000);
