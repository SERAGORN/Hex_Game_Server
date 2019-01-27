var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

http.listen(3010, function () {
    console.log('listening on *:3000');
});

var users = []
var start = false
var rooms = []
var message_room = []
var current_room
    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on('create_room', function (msg) {
            rooms.push({
                room: msg.room,
                users: [
                {
                    name: msg.name,
                    x: 1,
                    y: 1,
                    index: 0,
                    alive: 1
                }
                ]
            })
            let current_room = msg.room
            for (let i = 0; i < rooms.length; i++) {
                if (current_room == rooms[i].room) {
                    io.emit(msg.room, rooms[i])
                }
            }
            
            console.log(rooms)
        })


        socket.on('join_room', function (msg) {
            console.log(rooms)
            current_room = msg.room
            for (let i = 0; i < rooms.length; i++) {
                if (current_room == rooms[i].room) {
                    if (rooms[i].users.length < 5) {
                        rooms[i].users.push({
                            name: msg.name,
                            x: 2,
                            y: 2,
                            index: rooms[i].users.length,
                            alive: 1
                        })
                    }
                    
                    io.emit(msg.room, {
                        data: rooms[i],
                        index: rooms[i].users.length-1
                    })

                }
            }
        })

        socket.on('user_join', function (msg) {
            if (users.length < 5) {
                users.push(msg)
            }
            io.emit('user_join', users)

            console.log(msg)
        })
        socket.on('chat_mess', function (msg) {

            message_room.push({
                room: msg.room,
                user_name: msg.name,
                message: msg.message
            })
            let current_room = msg.room
            for (let i = 0; i < message_room.length; i++) {
                if (current_room == message_room[i].room) {
                    io.emit('chat_mess', message_room[i])
                }
            }
           // io.emit('chat_mess', mess)
            console.log(JSON.stringify(message_room))
            
        })

        socket.on('game_starts', function (msg) {
            start = true
            io.emit('game_start', msg)
        })

        socket.on('send_move', function (msg) {
            // if (start) {
            //     for (let i = 0; i < users.length; i++) {

            //     }
            // }
            io.emit(msg.room, msg)
            // start = true
        })
        
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
        socket.on('go', function (msg) {

            current_room = msg.room
            current_name = msg.name
            console.log(current_room)
            console.log(current_name)

            for (let i = 0; i < rooms.length; i++) {
                if (current_room == rooms[i].room) {
                    if (current_name == rooms[i].users[i]) {
                        rooms[i].users[i].x = msg.x
                        rooms[i].users[i].y = msg.y
                        io.emit(msg.room, rooms[i])
                    }
                }
            }

        })

        socket.on('start', function (msg) {
            if (msg.status == "start_game") {
                io.emit(msg.room, {
                    status: "start_game"
                })
            }


        })

        // socket.on('go', function (msg) {

            
        //     io.emit(msg.room, msg)
        // })
    });

