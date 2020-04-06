export default(()=>{

AFRAME.registerComponent('p2p', {
  schema: {
  },
  
  init: function(){
    const self = this;
    self.peers = {};
 
    document.addEventListener('gameStart',e=>{
      
      self.local = new Peer(CS1.myPlayer.name);
      
      self.local.on('connection', (conn) => {
        conn.on('data', (data) => {
          CS1.log(data);
        });
      });
      
      self.video = document.createElement('a-video');
      self.video.object3D.position.set(0,1,-2);
      self.video.setAttribute('visible',false);
      CS1.cam.appendChild(self.video);
      
      self.audio = document.createElement('a-sound');
      self.audio.object3D.position.set(0,1,-2);
      CS1.cam.appendChild(self.audio);
      
      self.local.on('call', (call) => {
        CS1.log('call received...');
        navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', (remoteStream) => {
            if ('srcObject' in self.video) {
              self.video.srcObject = remoteStream
            } else {
              self.video.src = window.URL.createObjectURL(remoteStream) // for older browsers
            }
          });
        }, (err) => {
          console.error('Failed to get local stream', err);
        });
      });
      
      CS1.p2p = self;
      
    }); 
    
  },
  
  msg: function(name,msg){
    const conn=this.local.connect(name);
    console.log('peer added with addPeer...');
    conn.on('open',()=>{
       conn.send(`${CS1.myPlayer.name}: ${msg}`);
    });
  },
  
  call: function(name){
    const self = this;
    navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
        CS1.log(`Calling ${name}...`);
        const call = self.local.call(name, stream);
        console.log(call);
        call.on('stream', (remoteStream) => {
          if ('srcObject' in self.video) {
            self.video.srcObject = remoteStream
          } else {
            self.video.src = window.URL.createObjectURL(remoteStream) // for older browsers
          }
        });
      }, (err) => {
        console.error('Failed to get local stream', err);
        CS1.log(err);
      });

    }
  
  
});
  
})()