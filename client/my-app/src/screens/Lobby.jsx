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