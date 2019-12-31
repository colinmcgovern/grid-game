var app = require('express')();
var express = require('express'); 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

var GRID_SIZE = 64; 
var COLORS = ["black","white","red","orange","yellow","green","blue","indigo","violet"];

//Creating the Grid Array 
var grid = new Array(GRID_SIZE);

for (var i = 0; i < GRID_SIZE; i++) {
	grid[i] = new Array(GRID_SIZE);
}

for(var i = 0; i < GRID_SIZE; i++){
	for(var j = 0; j < GRID_SIZE; j++){
		grid[i][j] = 1;
	}
}

app.use("/grid-game-1.1", express.static(__dirname + '/'));

app.get('/grid-game-1.1', function(req, res){
  res.sendFile(__dirname + '/');
});

io.on('connection', function(socket){
	
	//Data given to clients on connect 
	io.emit('GRID_SIZE', GRID_SIZE);
	io.emit('COLORS', COLORS); 
	io.emit('grid', grid); 

	socket.on('disconnect', function() {
		console.log("user disconnected");
	});

	socket.on('fill_square', function(msg){
		grid[msg[0][0]][msg[0][1]] = msg[1][0];
		io.emit('grid', grid);
	});
	
	socket.on('send_GRID_SIZE', function(msg){
		io.emit('GRID_SIZE', GRID_SIZE);
		io.emit('grid', grid); 
	});
	
	socket.on('send_COLORS', function(msg){
		io.emit('COLORS', GRID_SIZE);
		io.emit('grid', grid); 
	});
	
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

//Daily Saving
//TODO figure out how to daily save
// import schedule from 'node-schedule';
// schedule.scheduleJob('0 0 * * *', () => { console.log("test"); }) ;

