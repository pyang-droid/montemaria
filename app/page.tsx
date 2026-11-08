"use client";

import { useState } from "react";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Gallery from "./Components/Gallery";
import Landmarks from "./Components/Landmarks";
import Attractions from "./Components/Attractions";
import Footer from "./Components/Footer";
import LoginModal from "./Components/LoginModal";
import SignUpModal from "./Components/SignUpModal";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  const openLogin = () => {
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  const openSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  return (
    <main className="w-full overflow-x-hidden">
      <Navbar
        onOpenLogin={openLogin}
        onOpenSignUp={openSignUp}
      />

      <Hero />

      <About />

      <Gallery />

      <Landmarks />

      <Attractions onPlanVisit={openLogin} />

      <Footer />

      {/* SHARED LOGIN MODAL */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onOpenSignUp={openSignUp}
      />

      {/* SHARED SIGN UP MODAL */}
      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onOpenLogin={openLogin}
      />
    </main>
  );
}