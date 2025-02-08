import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import TopNavbar from "./components/navbar";
import Chatbot from "./components/Chatbot"; 
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import IncidentLogs from "./pages/IncidentLogs";
import "bootstrap/dist/css/bootstrap.min.css";

function Layout() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";
  const showChatbot = location.pathname !== "/"; 

  return (
    <>
      {showNavbar && <TopNavbar />}
      {showChatbot && <Chatbot />} {/* ✅ Floating chatbot */}

      <div className="content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Overview />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/logs" element={<IncidentLogs />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;










