(function(){
    var element = function(id){
        return document.getElementById(id);
    }
    
    var msg = element('msg');
    var txtar = element('txtar');
    var usrnm = element('usrnm');
    var clr = element('clr');
    var status = element('stat');
    
    var statDefault = status.textContent;

    var setStatus = function(s){
        stat.textContent = s;
        if(s !== statDefault){
            var delay = setTimeout(function(){
                setStatus(statDefault);
            }, 4000);
        }
    }

    var socket = io.connect('http://127.0.0.1:4400');

    if(socket !== undefined){
        console.log("Connected to Socket");
        socket.on('output',(data)=>{
            // console.log(data);
            if(data.length){
                for(var x = 0; x<data.length; x++){
                    var message = document.createElement('div');
                    message.setAttribute('class','chat-message');
                    message.textContent = data[x].name+": "+data[x].message;
                    msg.appendChild(message);
                    msg.insertBefore(message,msg.firstChild);
                }
            }
        });

    txtar.addEventListener('keydown',(event)=>{
        if (event.which === 13 && event.shiftKey == false){
            socket.emit('input',{
                name:usrnm.value,
                message:txtar.value
            });

            txtar.value = "";

        event.preventDefault();
        }
    });

    socket.on('status',(data)=>{
        setStatus((typeof(data) === 'object')? data.msg : data);
        
        if(data.clear){
            txtar.value = "";
        }

    }); 

    clr.addEventListener('click',()=>{
        socket.emit('clear');
    });

    socket.on('cleared',()=>{
        msg.textContent = "";
    });

    }
    

})();