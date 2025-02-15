
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import LobbyScreen from './screen/LobbyScreen'




function App() {
  return (
    <>
    <BrowserRouter>
    < Routes>
    < Route path='/' element={<LobbyScreen/>}  />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
