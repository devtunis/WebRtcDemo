import io from "socket.io-client"


const socket = io("http://localhost:8080",
    {
        autoConnect:false,
         auth: { key: "super-secret-123" }
    }
)


export default  socket

