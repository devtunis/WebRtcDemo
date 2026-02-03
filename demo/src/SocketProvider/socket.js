import io from "socket.io-client"


const socket = io("https://webrtcdemo-xo84.onrender.com",
    {
        autoConnect:false,
         auth: { key: "super-secret-123" }
    }
)


export default  socket


