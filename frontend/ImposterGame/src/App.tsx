import { Routes, Route, Outlet } from 'react-router-dom'

import Welcome from "./pages/Welcome.tsx";
import Lobby from "./pages/Lobby.tsx"
import Game from "./pages/Game.tsx"

import { GameProvider } from './contexts/GameContext.tsx'
import { RoomProvider } from './contexts/RoomContext.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route
        element={
          <RoomProvider>
            <Outlet />
          </RoomProvider>
        }
      >
        <Route path="/Lobby" element={<Lobby />} />
        <Route
          path="/Game"
          element={
            <GameProvider>
              <Game />
            </GameProvider>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
