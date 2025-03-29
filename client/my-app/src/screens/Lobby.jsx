import { useCallback, useContext, useEffect, useState } from "react"
import { CounterContext } from "../context/CounterContext"
import {useNavigate} from "react-router-dom"

function Lobby() {  
  const [user,setUser] = useState({
    email:'',
    room:''
  })
  const {socket} = useContext(CounterContext)
  const navigate = useNavigate()



  const handleInputValues = (e)=>{
    const {name,value} = e.target;
    setUser({
      ...user,
      [name]:value
    })
  }

  const submitData = useCallback(()=>{
    navigate(`/room/${user.room}`)
      socket.emit('join-room',user)
  },[user,socket,navigate])

  const savedRoom = useCallback(({email,room})=>{
    console.log(`This email ${email} is Join room and it Room ${room} `)
  },[])
  
  useEffect(()=>{
    socket.on('save-room',savedRoom)
    return()=>{
      socket.off('save-room')
    }
  },[socket,savedRoom])



  return (
    <div>
      <input type="text" placeholder="Enter Your Email" name="email" onChange={handleInputValues} />
      <input type="text" placeholder="Enter Your Room Id" name="room" onChange={handleInputValues} />
      <button onClick={submitData} >Submit</button>
    </div>


  )
}

export default Lobby
































// import { CounterContext } from "../context/CounterContext"
// import { useContext, useEffect, useState } from "react"
// import {useNavigate} from 'react-router-dom'
// function Lobby() {
//     const {socket} =  useContext(CounterContext)
//     const [userData,setUserData] = useState()
//     const navigate = useNavigate()
//     socket.on('connect',()=>{
//         console.log(`You are connected `)
//       })
//       const getUserData = (e)=>{
//         const {name,value} = e.target
//         setUserData({
//             ...userData,
//             [name]:value
//         })
//       }
//       const submitData = ()=>{
//         socket.emit('join-room',userData)
//         navigate(`/room/${userData.room}`)
//       }
//       useEffect(()=>{
//         socket.on('response-join',(data)=>{
//             const {email,room} = data
//         })
//       },[])
//   return (
//     <div>
//         <label>Email</label>
//         <input type="email" name="email" id="" placeholder="Enter Your E-mail" onChange={getUserData} />
//         <label>Room ID</label>
//         <input type="text" name="room" id="" placeholder="Enter Your ID" onChange={getUserData} />
//         <button onClick={submitData} >Submit</button>

//     </div>
//   )
// }

// export default Lobby