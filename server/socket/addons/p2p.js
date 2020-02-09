const p2p = {
  name: 'p2p',
  init: (socket,state) => {
    
    this.socket = socket;
    this.state = state;
    const self = this;
    
    socket.on('offer', d=>{
      
      const id = Object.keys(self.state.players).filter(key=>{
               return self.state.players[key].name == d.name
              });
       if(id)
         socket.broadcast.to(id).emit('offer', {id:socket.id,offer:d.offer,mode:d.mode});
      
    })
    socket.on('answer', d=>{
      socket.broadcast.to(d.id).emit('answer', {id:socket.id,answer:d.answer});
    })    
    
  }
  
}
module.exports = p2p; 