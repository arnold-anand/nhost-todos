import { useEffect, useState } from "react";
import { NhostProvider } from "@nhost/react";
import { nhost } from "./lib/nhost";
import Home from "./components/Home";

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <Home />
    </NhostProvider>
  );
}
export default App;
