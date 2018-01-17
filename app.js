const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//init express app
const app = express();

//set up template engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

//serving static files
app.use(express.static(__dirname + '/public'));


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//connecting to mongodb
const MongoClient = require('mongodb').MongoClient;
const mongoURL= 'mongodb://localhost:27017/todolist';
const objectId = require('mongodb').ObjectId;

MongoClient.connect(mongoURL, function(err, db){
	if(err){
		console.log(err);
	}
	else {
		console.log("Connected successfully");
	}
	todos = db.collection('todos');
});

//routes
app.get('/', function(req,res){
	
	todos.find({}).toArray(function(err, docs){
		if(err){
			console.log(err);
		}
		res.render('index', {docs: docs});
	});	
});

app.get('/todos/:id', function(req,res){
	
	var id = objectId(req.params.id);
	
	todos.findOne({_id: id}, function(err, doc){
		if(err){
			console.log(err);
		}
		res.render('show', {doc: doc});
	});	
});

app.post('/todos/add', function(req,res){
	
	todos.insert({title: req.body.title, description: req.body.description}, function(err, result){
		if (err){
			console.log(err);
		}
		res.redirect('/');
	})
	
	
});

app.get('/todos/edit/:id', function(req,res){
	
	var id = objectId(req.params.id);
	todos.findOne({_id: id}, function(err, doc){
		if(err){
			console.log(err);
		}
		res.render('edit', {doc: doc});
	});
	
	
});

app.post('/todos/update/:id', function(req,res){
	
	var id = objectId(req.params.id);
	
	todos.updateOne({_id: id}, {$set: {title: req.body.title, description: req.body.description}}, function(err, result){
		if(err){
			console.log(err);
		}
		else{
		res.redirect('/');
		}
	})
	
	
});

app.get('/todos/delete/:id', function(req,res){
	
	var id = objectId(req.params.id);
	
	todos.deleteOne({_id: id}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	})
	
	
});


//running app
app.listen(3000,function(){
	console.log("Running at http://localhost:3000");
});

