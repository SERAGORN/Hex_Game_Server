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
var current_room
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('create_room', function (msg) {
            rooms.push({
                room: msg.room,
                users: []
            })
            socket.emit(msg.room, 'kek')
            console.log(rooms)
        })


        socket.on('join_room', function (msg) {
            console.log("======")
            console.log(rooms)
            current_room = msg.room
            for (let i = 0; i < rooms.length; i++) {
                if (current_room == rooms[i].room) {
                    rooms[i].users.push({
                        name: msg.name,
                        x: "",
                        y: ""
                    })
                }
            }
        })

        socket.on('go', function (msg) {
            switch (msg.status) {
                case 'user_join': {
                    if (rooms.users.length < 5) {
                        console.log(rooms)
                        users.push({
                            name: msg.name,
                            x: "",
                            y: ""
                        })
                    }
                    io.emit('user_join', rooms[i])
                }
                break;
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

            io.emit('chat_mess', msg)
            console.log(msg)
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
            socket.emit('send_move', msg)
            start = true
        })
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });

