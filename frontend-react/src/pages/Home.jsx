import { useCallback, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import UploadSection from "../components/UploadSection";
import MatchCard from "../components/MatchCard";
import BrowseSection from "../components/BrowseSection";
import Footer from "../components/Footer";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const uploadRef = useRef(null);
  const matchesRef = useRef(null);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToUpload = useCallback(() => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleUploadSuccess = (data) => {
    setHasSearched(true);
    setMatches(data.possible_matches || []);
    setUploadMessage(data.message || "Item uploaded successfully");
    setRefreshKey((k) => k + 1);
    setTimeout(() => {
      matchesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const bestMatch = matches[0];
  const otherMatches = matches.slice(1);

  return (
    <div className="min-h-screen">
      <Navbar onReportClick={scrollToUpload} />

      <main>
        <Hero
          onReportLost={scrollToUpload}
          onBrowse={() => scrollTo("browse")}
        />

        <StatsSection refreshKey={refreshKey} />

        <div ref={uploadRef}>
          <UploadSection onUploadSuccess={handleUploadSuccess} />
        </div>

        <section ref={matchesRef} className="relative py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="section-heading">AI Match Results</h2>
              <p className="section-sub mx-auto">
                {uploadMessage
                  ? uploadMessage
                  : "Upload an item above to see AI-powered similarity matches."}
              </p>
            </div>

            {!hasSearched ? (
              <div className="glass mx-auto max-w-lg rounded-2xl py-14 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-slate-400">Awaiting upload</p>
                <p className="mt-2 text-sm text-slate-600">
                  Report an item to search for visually similar opposite-type listings.
                </p>
              </div>
            ) : matches.length === 0 ? (
              <div className="glass mx-auto max-w-lg rounded-2xl py-14 text-center">
                <p className="text-lg font-medium text-slate-400">No matches found</p>
                <p className="mt-2 text-sm text-slate-600">
                  No visually similar opposite-type items met the AI threshold yet.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {bestMatch && (
                  <div>
                    <h3 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-accent-cyan">
                      Top Match
                    </h3>
                    <div className="mx-auto max-w-md">
                      <MatchCard match={bestMatch} featured />
                    </div>
                  </div>
                )}

                {otherMatches.length > 0 && (
                  <div>
                    <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
                      Other Matches ({otherMatches.length})
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {otherMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <BrowseSection refreshKey={refreshKey} />
      </main>

      <Footer />
    </div>
  );
}
