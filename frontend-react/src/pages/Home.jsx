import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import RecentItems from "../components/RecentItems";
import TopMatches from "../components/TopMatches";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Navbar />

      <main className="flex-1">
        <Hero
          onReport={() => navigate("/report")}
          onBrowse={() => navigate("/browse")}
        />
        <StatsSection />
        <RecentItems />
        <TopMatches />
      </main>

      <Footer />
    </motion.div>
  );
}
