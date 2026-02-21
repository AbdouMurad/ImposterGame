import { useState } from "react";
import { Routes, Route } from 'react-router-dom'

<<<<<<< HEAD
import Welcome from "./pages/Welcome/Welcome.tsx";
import Info from "./pages/Info/Info.tsx";
import JoinForm from "./pages/JoinForm/JoinForm.tsx";
import Lobby from "./pages/GameRoom/lobby.tsx";

function Home() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
=======
import Welcome from "./pages/Welcome.tsx";
import Info from "./components/Info.tsx";
import JoinForm from "./components/JoinForm.tsx";
import Game from "./pages/Game.tsx"

function App() {
  const [isJoinOpen, setIsJoinOpen] = useState(true);
>>>>>>> JamesBranch
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      {/* <Welcome
        onInfoClick={() => setIsInfoOpen(true)}
        onJoinClick={() => setIsJoinOpen(true)}
      />
      {isJoinOpen && <JoinForm onCancelJoinClick={() => setIsJoinOpen(false)} />}
      {isInfoOpen && <Info onInfoExitClick={() => setIsInfoOpen(false)} />} */}
      <Game />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/GameRoom/lobby" element={<Lobby />} />
    </Routes>
  )
}

export default App
