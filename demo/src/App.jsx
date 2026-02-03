import React from 'react'
import {Routes,Route } from "react-router-dom"
import SocketProvider from './SocketProvider/SocketProvider'
 

const Room =  React.lazy(()=>import("./Componet/Room"))
const CreaRoom =  React.lazy(()=>import("./Componet/CreaRoom"))

const App = () => {


  return (
    <Routes>
       <Route path='/' element={<CreaRoom/>}/>
       <Route path='/room/:id/:time/:name' element={<>
        
        <React.Suspense fallback={<div>waiting </div>}>
        <SocketProvider> 
          <Room/>
          </SocketProvider>
        </React.Suspense>
      
        </>}/>
    </Routes>



  )
}

export default App