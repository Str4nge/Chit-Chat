const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(4400).sockets;

mongo.connect('mongodb://127.0.0.1/chatdb',function(err,db){
    if (err){
        throw err;
    }
    console.log(">> Mongo DB connected");
      db.db('chatdb').createCollection('chats',function (err,res) {
                if (err){
                    throw err;
                }
                console.log("collection created.");
        });

    client.on('connection',function(socket){

      const chats = db.db('chatdb').collection('chats');

        sendStatus = function(s){
            socket.emit('status',s);
        }

        chats.find().limit(100).sort({_id:1}).toArray(function(err,res){
            if(err){
                throw err;
            }

            socket.emit('output',res);
        });

        socket.on('input',function(data){
            let name = data.name;
            let msg = data.message;

            if (name == "" || msg == ""){
                sendStatus("Enter name and message");
            }

            else{
                chats.insert({name: name, message: msg},function(){
                    client.emit('output',[data]);
            
                    sendStatus({
                        msg :"Message sent",
                        clear : true
                    });
                });
            }
        });

        socket.on('clear',function(data){

            chats.remove({},function(){
                socket.emit('cleared');
            });
        });
        
    });
});
