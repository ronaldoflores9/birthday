import { useState } from "react";
import { BIRTHDAY } from "./config";
import { MainPage } from "./components/MainPage";
import { CountdownGate } from "./components/CountdownGate";

/* ── ROOT ── */
export default function App() {
  const isBirthday = Date.now() >= BIRTHDAY.getTime();
  const [editorAccess, setEditorAccess] = useState(false);

  if (isBirthday || editorAccess) return <MainPage />;
  return <CountdownGate onEditorAccess={() => setEditorAccess(true)} />;
}
