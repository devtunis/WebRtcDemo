import React, { useState } from "react";
import socket from "../SocketProvider/socket";
import "./CreateRoom.css";
import { useNavigate } from "react-router-dom";
import Sqids   from "sqids"

const CreaRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [duration, setDuration] = useState("");
  const Nav = useNavigate()

  
  const handleCreate = () => {
    if(!roomName  ){
      alert("missing roomName or duration")
      return
    }
  

    const sqids = new Sqids()
    const idroom = sqids.encode([Date.now()]) 
   
    Nav(`room/${idroom}/${50}/${roomName}`)
  };

  return (
    <div className="center">
      <div className="room-card-dark">
        <h2>Create Room 🖤</h2>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button className="dark-button" onClick={()=>handleCreate()}>
          Create Room
        </button>
      </div>
    </div>
  );
};

export default CreaRoom;
