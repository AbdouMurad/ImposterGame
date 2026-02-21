import { useState } from "react";
import { Routes, Route } from 'react-router-dom'

import Welcome from "./pages/Welcome/Welcome.tsx";
import Info from "./pages/Info/Info.tsx";
import JoinForm from "./pages/JoinForm/JoinForm.tsx";
import Lobby from "./pages/GameRoom/lobby.tsx";

function Home() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <Welcome
        onInfoClick={() => setIsInfoOpen(true)}
        onJoinClick={() => setIsJoinOpen(true)}
      />
      {isJoinOpen && <JoinForm onCancelJoinClick={() => setIsJoinOpen(false)} />}
      {isInfoOpen && <Info onInfoExitClick={() => setIsInfoOpen(false)} />}
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
