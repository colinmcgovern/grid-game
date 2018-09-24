var socket = io();

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var paint_color = 0; //black as default

//Pixel Canvas 
var canvas = document.getElementById('myCanvas');
var width = canvas.width;
var height = canvas.height;

var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");


//Toolbar Canvas 
var canvas2 = document.getElementById('toolbar');
var width2 = canvas2.width;
var height2 = canvas2.height;

var c2 = document.getElementById("toolbar");
var ctx2 = c2.getContext("2d");


//Getting Data From Server 

var GRID_SIZE;

socket.on('GRID_SIZE', function (data) {
    GRID_SIZE = data; 
});

var COLORS; 

socket.on('COLORS', function (data) {
    COLORS = data; 
    
    //Toolbar doesn't load until COLORS is received 
    for(var i = 0; i < COLORS.length; i++){
        
        ctx2.beginPath();
        ctx2.rect(0 , i*width2, width2, width2);
        ctx2.fillStyle = COLORS[i];
        ctx2.fill();  
        
        if(paint_color==i){
            var img = document.getElementById('brush');
            ctx2.drawImage(img, 0, i*width2);
        }
        
    }
    
});
   
   
//Getting Grid from Server 
socket.on('grid', function (data) {

    //Preventing Grid From Being Drawn Without Getting the Constants First 
    if (GRID_SIZE === null){
        socket.emit('send_GRID_SIZE',"Please send the GRID_SIZE!");
    }
    
    else if (COLORS === null){
        socket.emit('send_COLORS',"Please send the COLORS!");
    }
    
    else{
            
        //Filling Squares 
        for(var i = 0; i < GRID_SIZE; i++){
            
            for(var j = 0; j < GRID_SIZE; j++){
                
                ctx.beginPath();
                ctx.fillStyle = COLORS[data[i][j]];
                ctx.fillRect(
                    i * (width/GRID_SIZE),
                    j * (height/GRID_SIZE),
                    (width/GRID_SIZE),
                    (height/GRID_SIZE));
                ctx.stroke(); 
    
            }
        }
            
        //Drawing Grid 
        for(var i = 0; i < GRID_SIZE; i++){
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.globalAlpha=0.75;
            ctx.moveTo(i*(width/GRID_SIZE),0);
            ctx.lineTo(i*(width/GRID_SIZE),height);
            ctx.stroke();
            ctx.globalAlpha=1;
        }
        
        for(var i = 0; i < GRID_SIZE; i++){
            ctx.beginPath();
            ctx.globalAlpha=0.75;
            ctx.fillStyle = "black";
            ctx.moveTo(0,i*(height/GRID_SIZE));
            ctx.lineTo(width,i*(height/GRID_SIZE));
            ctx.stroke();
            ctx.globalAlpha=1;
        }
        
    }

});

//Drawing Square If Mouse Down 
canvas.addEventListener('mousedown', function(evt) {
    
        var pos = getMousePos(canvas, evt);
        socket.emit('fill_square',[[Math.floor(pos.x/(width/GRID_SIZE)),Math.floor(pos.y/(height/GRID_SIZE))],[paint_color]]); 

} , false);

//Toolbar Clicks
canvas2.addEventListener('click', function(evt) {
    
    var pos = getMousePos(canvas2, evt);
    
    //Changing Color Selection
    if(Math.floor(pos.y/width2) < COLORS.length){
        paint_color = Math.floor(pos.y/width2);
    }

    for(var i = 0; i < COLORS.length; i++){
        ctx2.beginPath();
        ctx2.rect(0 , i*width2, width2, width2);
        ctx2.fillStyle = COLORS[i];
        ctx2.fill();  
        
        if(paint_color==i){
            var img = document.getElementById('brush');
            ctx2.drawImage(img, 0, i*width2);
        }
    }
} , false);

        





    

