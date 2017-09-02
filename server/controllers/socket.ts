import Ad from '../models/ad';

export default (io) => {
  
  
  io.sockets.on('connect', (socket) => {

    Ad.find({'screens': parseInt(socket.handshake.query['screenid'])},(err, doc) => {
      if (err) { return console.error(err); }
      socket.emit("screen"+socket.handshake.query['screenid'],doc);
    });
    console.log('a user connected');

    socket.on('disconnect', () => {

      console.log('a user disconnected');
    });
  });


};
