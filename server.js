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

io.on('connection',(socket) => {
    console.log('Socket id is = ',socket.id);
})