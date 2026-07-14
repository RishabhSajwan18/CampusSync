import Navbar from "../components/Navbar";
import BrowseSection from "../components/BrowseSection";
import Footer from "../components/Footer";

export default function Browse() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <BrowseSection />
      </main>
      <Footer />
    </div>
  );
}
