const express = require('express');
const path = require('path');
const app = express();

let server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
const io = require('socket.io')(server,{
    allowEIO3: true,
});
app.use(express.static(path.join(__dirname, '')));
let userConnections = [];
io.on('connection',(socket) => {
    console.log('Socket id is = ',socket.id);
    socket.on('userconnect',(data)=>{
        console.log('User connected', data);

       //Contains all user data except the person joining the room itself  
       let otherUserConnections = userConnections.filter(
           (user) => user.meeting_id == data.meetingid
       )
        
       //Contains all user data
        userConnections.push({
            connectionId:socket.id,
            user_id: data.displayName,
            meeting_id: data.meetingid
        });

        // let other know you joined the room
        others_users.forEach((user)=>{
            socket.to(user.connectionId).emit("inform_others_about_me",{
                other_user_id: data.displayName,
                connId: socket.id,
            });
        });
    })
})