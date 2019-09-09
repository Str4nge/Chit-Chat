const mongo = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/chatdb";

mongo.connect(url,function(err,db){
	if (err){
		throw err;
	}
	console.log("Db Connected");
	db.db("chatdb").createCollection("chats",function(err,res){
		
		const chats = db.db('chatdb').collection('chats');
		if(err){
			throw err;
		}
		console.log("collection created");
		chats.find(function(err,res){
			console.log(res);
		});
	});
});