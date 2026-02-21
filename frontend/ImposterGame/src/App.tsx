import { useState } from "react";

import Welcome from "./pages/Welcome/Welcome.tsx";
import Info from "./pages/Info/Info.tsx";
import JoinForm from "./pages/JoinForm/JoinForm.tsx";

function App() {
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

export default App
