 import { useEffect, useRef } from "react"
import socket from "../SocketProvider/socket"
import { useState } from "react"
import { useParams } from "react-router-dom"
import "../index.css"
import MyCountdown from "./Countdown"
import PeerSetup from "../V1.0.0/PeerSetup"
import iceConfiguration from "../V1.0.0/iceConfiguration"

const Room = () => {
  const [icesCandidats,seticesCandidats] = useState([])

  const peerConnection = useRef(null)
  const usePeerConnection = useRef()

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);





  const  {id,time,name} = useParams()  
  const [isAlone,setIsAlone] =useState(null)
  const [isMatching,SetIsMatching] =useState(null)
  const [divorce,setdivorce] =useState(false)
  const [startTimer,SetstartTimer] = useState(false)
  const  peerid  =  useRef(null)





const HandedlSend =()=>{
      socket.emit("showQuee")
}
useEffect(()=>{
      socket.on("alone",(data)=>{
        
         setIsAlone(true)
        
      })
      return()=>{
        socket.off("alone")
      }

  },[])
const HandelMatching = (data)=>{

        console.log(data)
        peerid.current    =  data.peerid
        
        if(data.type){
          socket.emit("listenRooms",{
           
             idRoom :  name   , 
             peers : [socket.id,data.peerid],
             Key :[socket.id, data.peerid].sort().join("_")
          })
        }
        
       setIsAlone(false)
       SetIsMatching(true)
       SetstartTimer(true)
       setdivorce(false)
}
useEffect(()=>{

      socket.on("matching",HandelMatching)

      return()=>{
        socket.off("matching",HandelMatching)
      }

 },[])
const  NewConnectionVersion01 = async() =>{
  try{
    console.log("I enter to this function line 80")
      peerConnection.current = new RTCPeerConnection(iceConfiguration)
      usePeerConnection.current  = new PeerSetup(localVideoRef,peerConnection,remoteVideoRef)
      await usePeerConnection.current._intializCamera()

      peerConnection.current.oniceconnectionstatechange = () => {
          console.log('ICE STATE:',peerConnection.current.iceConnectionState);
      };



      peerConnection.current.onicecandidate = (event) => {


          if(peerConnection.current.remoteDescription){
            console.log("........... Remote Description should be this part  ..................",socket.id)
            usePeerConnection.current.addicefromthebuffer();

          }

           if(peerConnection.current.localDescription){
            console.log("........... localDescription Description should be this part  ..................")
          }

            // see other deal && peerConnection.current.remoteDescription 
          if(event.candidate){
           // console.log(event.candidate,":any",peerid.current)
            seticesCandidats((prev)=>[...prev,event.candidate])
               socket.emit("ice-candidate", { candidate: event.candidate, target: peerid.current});
          }
      }



  }catch(error){
    console.log(error)
    throw error
  }
}
const HandelCLose = async ()=>{

if(peerConnection.current){
  usePeerConnection.current.close()
  await NewConnectionVersion01()
} 
}
useEffect(()=>{


     const GetInforamtionAboutMatchingSItaution= async (data)=>{
        try {
        SetIsMatching(false) 
        setIsAlone(data.test)
        setdivorce(true)
        SetstartTimer(false)
        console.log("intialize all thing  your divorce",data.yourdivorce)
        await   HandelCLose()
        console.log("Handel Close Sucess")
        }catch(error){
           console.log(error)
           throw error
        }
      }


      socket.on("divorce",GetInforamtionAboutMatchingSItaution)
      return()=>{
        socket.off("divorce",GetInforamtionAboutMatchingSItaution)
      }

     


  },[])

 
useEffect(()=>{

      const init = async()=>{
        try{
          peerConnection.current =  new RTCPeerConnection(iceConfiguration); 
          usePeerConnection.current  = new PeerSetup(localVideoRef,peerConnection,remoteVideoRef)
          await usePeerConnection.current._intializCamera()
      // if peerconnection setremoteddescription really their do it or no

          peerConnection.current.oniceconnectionstatechange = () => {
          console.log('ICE STATE:',peerConnection.current.iceConnectionState);
        };



        peerConnection.current.onicecandidate = (event) => {

      

          if(peerConnection.current.remoteDescription){
            console.log("........... Remote Description should be this part  ..................",socket.id)
            usePeerConnection.current.addicefromthebuffer();

          }

           if(peerConnection.current.localDescription){
            console.log("........... localDescription Description should be this part  ..................")
          }

            // see other deal && peerConnection.current.remoteDescription 
          if(event.candidate){
           // console.log(event.candidate,":any",peerid.current) // this peerid here safe bcauze all this happend before mathcing
            seticesCandidats((prev)=>[...prev,event.candidate])
            socket.emit("ice-candidate", { candidate: event.candidate, target: peerid.current});
          }
      }

           
        }catch(error){ 
          console.log(error)
        }
      }

      init()


    return()=>{
      
         usePeerConnection.current?.close()
}





    },[])
  


  async function StartCall(userid){
   
  
     const offer = await  usePeerConnection.current.CreateOffer()
     console.log(offer)
     socket.emit("Offer",{sdp : JSON.stringify(offer) , target:peerid.current,myid:socket.id})

     
    
 
    
  }
 




 useEffect(()=>{
  const HandedlAnswer = async (data)=>{
 
 const   answerOff = await usePeerConnection.current.CreateAnswer(JSON.parse(data.sdp)) 
 console.log(answerOff,"this the answer of it ")
 socket.emit("Answer",{sdp : JSON.stringify(answerOff) , target : data.myid})
  }
 socket.on("Offer",HandedlAnswer)
  
 return()=>{
  socket.off("Offer",HandedlAnswer)
 }
 },[])




 useEffect(()=>{

  const getanswer = async(answer)=>{
    try{
     console.log(JSON.parse(answer),"<== this your return")
      usePeerConnection.current.MakeConnectionAB(JSON.parse(answer))
    }catch(error){
      console.log(er) 
    }
  }
 socket.on("Answer",getanswer)
 return()=>{
  socket.off("Answer",getanswer)
 }
  
 },[])

 
     
useEffect(()=>{

   const HandelIce = (candidate)=>{
     
    if(peerConnection.current.remoteDescription){
  
      console.log("yes we ready --------",socket.id)
      usePeerConnection.current.addIceF(candidate)
      console.log("this ice you can use ")    
    } else{
     
      console.log(candidate,"we send this to the buffer")
      usePeerConnection.current.putwaitice(candidate)
    }

    
   

   }
    socket.on("ice-candidate",HandelIce)
 


return()=>{
  
socket.off("ice-candidate",HandelIce)
}

},[])





 


  return (
  <>
   {divorce && <MyCountdown  minutes ={44} seconds ={5}/>}
<div className="room-text">
  <div className="room-id" style={{color:"red"}}>my  id : {socket.id}</div>
  <div className="room-id">Name ROOM : {name}</div>
  <div className="room-id">ID ROOM : {id}</div>
  <div className="room-time">Time Room :{!startTimer &&  time } {startTimer && <MyCountdown  minutes ={time} seconds ={0}/>} Minutes</div>
</div>


   {isMatching? <div style={{width:"30px",height:"30px",borderRadius:"100%",backgroundColor:"green"}}></div> : isMatching==false &&  <div style={{width:"30px",height:"30px",borderRadius:"100%",backgroundColor:"red"}}></div>   }
  <h2 style={{color:"red"}}> {isAlone && <span>🥺</span>}</h2>
   <br/> <br/>
   <button onClick={()=>HandedlSend()} style={{cursor:"pointer"}}> quee </button>  
   <br/> <br/>
   <br/> <br/>
   <video ref={localVideoRef} autoPlay  style={{borderRadius:"20px",width:"500px",height:"300px",background:"black"}} /> 
   <video ref={remoteVideoRef} autoPlay  style={{borderRadius:"20px",width:"500px",height:"300px",background:"black"}} /> 
    <br/> <br/>
   {isMatching && <button onClick={()=>StartCall(peerid.current)} style={{background:"black",width:"100px",borderRadius:"10px",border:"none",padding:"10px",fontWeight:"bold",color:"white",cursor:"pointer"}}>Start</button>
}
   <br/>
 {/*
   <button onClick={()=>usePeerConnection.current.showmeCandidats()} style={{background:"black",width:"100px",borderRadius:"10px",border:"none",padding:"10px",fontWeight:"bold",color:"white",cursor:"pointer"}}>showmeCandidats</button>
   <button onClick={()=>console.log(icesCandidats)}>show my ice candidate</button>
    <button onClick={()=>console.log(peerid.current)}>show my peerid</button>
   <button onClick={()=>console.log(myice)}>show small ice</button>
    <button onClick={()=>console.log(usePeerConnection.current.getbuffer(),"this buffer")}>show getbuffer</button>
    <button onClick={()=>HandelCLose()}>clean up</button>

*/}

    </>
  )
}

export default Room









