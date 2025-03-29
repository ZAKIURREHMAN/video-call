import Lobby from "./screens/Lobby"
import Room from "./screens/Room"
import {BrowserRouter,Route, Routes} from 'react-router-dom'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      < Route path="/" element={<Lobby/>}/>
      < Route path="/room/:id" element={<Room/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
