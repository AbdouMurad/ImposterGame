import { useState } from "react";

import Welcome from "./pages/Welcome/Welcome.tsx";
import Info from "./components/Info/Info.tsx";
import JoinForm from "./components/JoinForm/JoinForm.tsx";
import Game from "./pages/Game/Game.tsx"

function App() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
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

export default App
