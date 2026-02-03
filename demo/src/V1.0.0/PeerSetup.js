import iceConfiguration from "./iceConfiguration";
import constraint from "./constraint";
// reuse component
class PeerSetup{
 
    constructor (localVideoRef,peer,remoteVideoRef) {
        // this.peer = peer || pass something here
        this.peer = peer   
        this.localVideoRef = localVideoRef
        this.remoteVideoRef = remoteVideoRef 
        this.localStream = null
        this.buffer = []
     
    } 

     putwaitice(ice){
        this.buffer.push(ice)
     }
     getbuffer(){
        return this.buffer
     }

    
     addicefromthebuffer(){
       if(this.buffer.length>0){
     
        this.buffer.forEach(async(ice)=>{
        await this.peer.current.addIceCandidate(new RTCIceCandidate(ice));
        console.log("✅ ICE candidate added successfully from buffer")
        })
        this.buffer = []
        }
     }



    async _intializCamera(){

        this.localStream  = await navigator.mediaDevices.getUserMedia(constraint)
        this.localVideoRef.current.srcObject = this.localStream

        this.addlocaltracks()
        this.addremotetracks()

        
            

    }

    close(){
        console.log("clean up the function ...")
        this.localStream?.getTracks().forEach(track=>track.stop())
     
        if(this.localVideoRef){

            this.localVideoRef.srcObject = null 
        }
        if(this.remoteVideoRef){
            this.remoteVideoRef.srcObject  = null
        }
         if(this.peer.current){

         this.peer.current?.close()
         this.peer.current = null
       
         this.peer.onicecandidate  = null

         }
         this.localStream = null
         // this good clean up .?
         
    }
    
    addlocaltracks(){
     this.localStream.getTracks().forEach(track => {
            this.peer.current.addTrack(track,this.localStream)
            console.log("sucess")
        });
    }
   
    addremotetracks(){
      this.peer.current.ontrack  = (event)=>{
        
        this.remoteVideoRef.current.srcObject  = event.streams[0]
      }
    }

    async CreateOffer() {
    try {
        const offer = await this.peer.current.createOffer();
        await this.peer.current.setLocalDescription(offer);

        
        return this.peer.current.localDescription;  
    } catch (error) {
        console.log("Error creating offer:", error);
        throw error;
    }
    }

    async CreateAnswer(offer){
        try{
      
        await  this.peer.current.setRemoteDescription(new RTCSessionDescription(offer))             
        const answer =  await  this.peer.current.createAnswer()
        await  this.peer.current.setLocalDescription(answer)
        return this.peer.current.localDescription
        }catch(error){
            console.log(error)        
            throw error
        }
    }

 async MakeConnectionAB (answerpleasework)  {
 try {
          await this.peer.current.setRemoteDescription(answerpleasework);
      console.log("✅✅✅✅ A got remote answer, connection is ready!");


     
     
 }catch(error){
    console.log(error)
    throw error
 }

 }

      





  async addIceF(data){
    try {
     
        await this.peer.current.addIceCandidate(new RTCIceCandidate(data));
        console.log("✅ ICE candidate added successfully");
        
        
    } catch(err) {
        console.error("❌ Failed to add ICE candidate:", err);
    }
}

    
}

export default PeerSetup





















// Record the state of the server is down or no

// pc.oniceconnectionstatechange = () => {
 //  console.log('ICE:', pc.iceConnectionState);
// };
//  if (pc) pc.close();

// pc.addEventListener("iceconnectionstatechange", (event) => {
//   if (pc.iceConnectionState === "failed") {
//     /* possibly reconfigure the connection in some way here */
//     /* then request ICE restart */
//     pc.restartIce();
//   }
// })