import logo from './logo.svg';
import './App.css';

import React from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Homepage from './pages/Homepage';
import WaitingPage from './pages/Waiting';
import LoggedIn from "./pages/LoggedIn"
import Play from './pages/Play';
import CompletedGames from './pages/CompletedGames';

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="loggedin" element={<LoggedIn />} />
          <Route path="waiting/:code" element={<WaitingPage />} />
          <Route path="play/:gameID" element={<Play />} />
          <Route path="games" element={<CompletedGames />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
