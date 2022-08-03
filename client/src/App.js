import "./App.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Login from "./pages/Login";
import Register from "./pages/Register";
import WaitingPage from "./pages/Waiting";
import Home from "./pages/Home";
import Play from "./pages/Play";
import CompletedGames from "./pages/CompletedGames";

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="waiting/:code" element={<WaitingPage />} />
          <Route path="play/:gameID" element={<Play />} />
          <Route path="games" element={<CompletedGames />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
