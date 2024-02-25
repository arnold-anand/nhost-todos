import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { NhostProvider } from "@nhost/react";
import { nhost } from "./lib/nhost";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Signin from "./components/Signin";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(nhost.auth.getSession());

    nhost.auth.onAuthStateChanged((_, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NhostProvider nhost={nhost}>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/"
            element={session ? <Home session={session} /> : <Signin />}
          />
        </Routes>
      </Router>
    </NhostProvider>
  );
}

export default App;
