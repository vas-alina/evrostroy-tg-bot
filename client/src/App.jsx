import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import "./App.css";
import Form from "./components/Form/Form";

function App() {
  const { tg, onToggleButton } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
      <Route path="/form" element={<Form />} />
      </Routes>
      <button onClick={onToggleButton}>toggle</button>
    </div>
  );
}

export default App;
