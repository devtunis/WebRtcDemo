import 'dotenv/config';          // ← this loads .env automatically
 
import express from 'express';
import { Server } from 'socket.io';
import {createServer} from "node:http"
import createid from './createidRoom.js';
import Quee from './Quee.js';
import {emitUser,emitone} from './functionEit/emitUser.js';
 
const app = express();

const httpServer = createServer(app)
const io  = new Server(httpServer,{
    cors:{
        origin:"https://web-rtc-demo-pi.vercel.app"
    }
})
 

 io.use((socket, next) => {
   const key = socket.handshake.auth.key;
 

   if (key !== "super-secret-123") {
     return next(new Error("Unauthorized"));
   }

   socket.isAuthorized = true;
   next();
 });
 





const queeSet = new Quee()



io.on("connection",(socket)=>{
  console.log("connected ✅",socket.id)
  console.log("-------------------")

  if(socket.id!=undefined){
   queeSet.AddItem(socket.id)
  }
  const  next = queeSet.bringIce(socket.id)
  if(!next) {
  
    emitone(io,"alone",socket.id,true)
   
  }else{
    queeSet.delete(socket.id)
    queeSet.delete(next)
 
     emitUser(io,"matching",next,socket.id,true)
     queeSet.AddCouple(next,socket.id)
  }

   
 


socket.on("ice-candidate",({candidate,target })=>{
  io.to(target).emit("ice-candidate",candidate)
 
})

 socket.on("Offer",({sdp,target,myid })=>{
   
  io.to(target).emit("Offer",{sdp,myid})
 
})

socket.on("Answer",({sdp,target})=>{
 // console.log(target,sdp)
  io.to(target).emit("Answer",sdp)
})
  socket.on("showQuee",()=>{
 
     queeSet.display()
  })
 
  
 socket.on("listenRooms",(room)=>{
    console.log(room)
    queeSet.addChannel(room.Key,{idR:room.idRoom,pers :room.peers})
 })
    

    socket.on("disconnect",()=>{
        console.log("-------------------")
        queeSet.delete(socket.id) 
        console.log("disconnect 🔴 ",socket.id)
        
        if(queeSet.HasRelation(socket.id)){
          
            
            const idPartner  =  queeSet.HasRelation(socket.id)
            const key= [socket.id,idPartner].sort().join("_")

            queeSet.deleteKeyChannel(key)

            io.to(idPartner).emit("divorce",{test:true,yourdivorce:socket.id})

            queeSet.DelteCouple(socket.id,queeSet.HasRelation(socket.id))
            const Chance =  queeSet.bringIce(idPartner)

            if(Chance){
            queeSet.delete(Chance)
            emitUser(io,"matching",Chance,idPartner,true)
            queeSet.AddCouple(idPartner,Chance)
            } else{
             queeSet.AddItem(idPartner)
            }
          
         
 
        }
        
         
    })
})




const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

 
