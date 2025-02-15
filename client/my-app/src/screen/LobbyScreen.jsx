import {useForm} from "react-hook-form"
import io from "socket.io-client";
import './LobbyScreen.css'
import { useMemo } from "react";


function LobbyScreen() {
  const {register,handleSubmit} = useForm()

  const socket = useMemo(()=>io('http://localhost:4000',[]))


  const submitIfo = (data)=>{
    socket.emit('join-room',data)
  }    

  return <div className="container" >
    <form onSubmit={handleSubmit(submitIfo)} className="form" >
    <div>
    <input type="text" name="email" placeholder="Enter Your E-mail" {...register('email')}/> <br /> <br /> <br />
    <input type="text" name="room" placeholder="Enter Your Room ID" {...register('room')} /> <br /> <br /> <br />
    <button type="submit">Submit</button>
    </div>
    </form>
  </div>;
}

export default LobbyScreen;
