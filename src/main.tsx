import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { App } from "@/app";
import { AudioContextCtx } from "@/context/audio-context";

const audioCtx = new AudioContext();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AudioContextCtx.Provider value={audioCtx}>
      <App />
    </AudioContextCtx.Provider>
  </StrictMode>,
);
