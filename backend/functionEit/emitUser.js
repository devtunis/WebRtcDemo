export  function emitUser(io,event,id1,id2,f){
    
    io.to(id1).emit(event,{peerid :id2,type :f})
    io.to(id2).emit(event,{peerid :id1,type :!f})
  
}

export function emitone(io,event,x,message){
    io.to(x).emit(event,message)
  
  
}

 