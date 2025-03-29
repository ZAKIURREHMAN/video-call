import { useCallback, useContext, useEffect, useState } from "react";
import { CounterContext } from "../context/CounterContext";
import ReactPlayer from "react-player";
import peer from "../service/Peer.js";

function Room() {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream,setRemoteStream] = useState()
  const { socket } = useContext(CounterContext);

  const handleUserJoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
    console.log(`A new User with this email ${email} come in this Room  `);
  }, []);

  const handleUserCall = useCallback(async () => {
    const steam = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer()
    socket.emit('user-call',{to:remoteSocketId,offer})
    setMyStream(steam);
  }, [socket,remoteSocketId]);


  const handleIncomeCall = useCallback(async({from,offer})=>{
    setRemoteSocketId(from)
    const steam = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(steam);
    const ans = await peer.getAnswer(offer)
    socket.emit('call-accept',{to:from,ans})
    
  },[socket])

  const sendSteam = useCallback(()=>{
    for(const track of myStream.getTracks()){
      peer.peer.addTrack(track,myStream)
    }
  },[myStream])

  const handleCallAccepted = useCallback(async({ans})=>{
    await peer.setLocalDescription(ans)
    sendSteam()
  },[myStream])

  const handleNegotiation = useCallback(async()=>{
    const offer = await peer.getOffer()
    socket.emit('peer-negotiation-need',{offer,to:remoteSocketId})
  },[remoteSocketId,socket])

  useEffect(()=>{
    peer.peer.addEventListener('negotiationneeded',handleNegotiation)


    return ()=>{
      peer.peer.removeEventListener('negotiationneeded',handleNegotiation)
    }



  },[handleNegotiation])

  const handleNegotiationIncome = useCallback(async({from,offer})=>{
    const ans = await peer.getAnswer(offer)
    socket.emit('peer-negotiation-done',{to:from,ans})
  },[socket])

  const handleNegotiationFinal = useCallback(async({ans})=>{
   await  peer.setLocalDescription(ans)
  },[])
  useEffect(()=>{
    peer.peer.addEventListener('track',async(e)=>{
      const remoteStr = e.streams
      console.log("GOT TRACKs")
      setRemoteStream(remoteStr[0])
    })
  },[])
  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on('income-call',handleIncomeCall)
    socket.on('call-accepted',handleCallAccepted)
    socket.on('peer-negotiation-need',handleNegotiationIncome)
    socket.on('peer-negotiation-final',handleNegotiationFinal)
    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off('income-call',handleIncomeCall)
      socket.off('call-accepted',handleCallAccepted)
      socket.off('peer-negotiation-need',handleNegotiationIncome)
      socket.off('peer-negotiation-final',handleNegotiationFinal)
    };
  }, [socket, handleUserJoined,handleIncomeCall,handleCallAccepted,handleNegotiationFinal]);

  return (
    <div>
      {remoteSocketId ? <p>Connected</p> : <p>No One in Room</p>}
      {remoteSocketId ? (
        <p>
          <button onClick={handleUserCall}>Call</button>
        </p>
      ) : (
        ""
      )}
      {remoteSocketId ? (
        <p>
          <button onClick={sendSteam}>Start Steam </button>
        </p>
      ) : (
        ""
      )}
      {remoteSocketId && (
        <>
        <h1>My Video Steam </h1>
        <ReactPlayer
          playing
          muted
          url={myStream}
          height="300px"
          width="300px"
          />
          </>
      )}
        {remoteStream && (
        <>
        <h1>My Remote  Steam </h1>
        <ReactPlayer
          playing
          muted
          url={remoteStream}
          height="300px"
          width="300px"
          />
          </>
      )}
    </div>
  );
}
export default Room;
