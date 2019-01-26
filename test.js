var rooms = []
rooms.push({room: "kek"})

in_room = "kek"
user = {
    name: "lol"
}
for (let i = 0; i <rooms.length; i++) {
    if (rooms[i].room == in_room) {
        rooms[i].user.push(user)
    }
}

console.log(rooms)