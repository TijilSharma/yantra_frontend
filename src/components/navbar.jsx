import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import "./Navbar.css"; // Custom styles

const TopNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }} // Start position (hidden)
      animate={{ y: 0, opacity: 1 }} // Animate into view
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth animation
    >
      <Navbar expand="lg" className={`top-navbar ${scrolled ? "scrolled" : ""}`}>
        {/* Sentinel Logo */}
        <Navbar.Brand as={Link} to="/" className="text-white nav-logo">
          🔍 Sentinel
        </Navbar.Brand>

        {/* Hamburger Menu for Mobile */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </div>

        <Nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Nav.Link as={Link} to="/" className="text-white">
            Overview
          </Nav.Link>
          <Nav.Link as={Link} to="/dashboard" className="text-white">
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/upload" className="text-white">
            Upload Data
          </Nav.Link>
          <Nav.Link as={Link} to="/logs" className="text-white">
            Incident Logs
          </Nav.Link>
        </Nav>
      </Navbar>
    </motion.nav>
  );
};

export default TopNavbar;






