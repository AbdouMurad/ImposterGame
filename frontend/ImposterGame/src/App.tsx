import { Routes, Route } from 'react-router-dom'

import Welcome from "./pages/Welcome.tsx";
import Lobby from "./pages/GameRoom/lobby.tsx"
import Game from "./pages/Game.tsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/GameRoom/lobby" element={<Lobby />} />
      <Route path="/Game" element={<Game />} />
    </Routes>
  )
}

export default App
