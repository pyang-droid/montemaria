import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Gallery from "./Components/Gallery";
import Landmarks from "./Components/Landmarks";
import Attractions from "./Components/Attractions";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Landmarks />
      <Attractions />
      <Footer />
    </main>
  );
}