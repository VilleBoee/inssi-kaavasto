import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KaavastoApp } from "@/components/kaavasto-app";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Sivun juurielementti puuttuu.");

createRoot(root).render(
  <StrictMode>
    <KaavastoApp />
  </StrictMode>,
);
