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
  const [uploadedItem, setUploadedItem] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
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

  const handleUploadSuccess = (data, previewUrl) => {
    setHasSearched(true);
    setMatches(data.possible_matches || []);
    setUploadedItem(data.item || null);
    setUploadPreview(previewUrl || data.item?.image_url || null);
    setRefreshKey((k) => k + 1);
    setTimeout(() => {
      matchesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const uploadedImage = uploadPreview || uploadedItem?.image_url;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onReportClick={scrollToUpload} />

      <main className="flex-1">
        <Hero onReport={scrollToUpload} onBrowse={() => scrollTo("browse")} />

        <div ref={uploadRef}>
          <UploadSection onUploadSuccess={handleUploadSuccess} />
        </div>

        <section ref={matchesRef} className="border-t border-white/[0.06] py-8 sm:py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            {hasSearched && (
              <h2 className="section-title mb-5">
                {matches.length > 0
                  ? `Matches Found (${matches.length})`
                  : "Matches Found (0)"}
              </h2>
            )}

            {!hasSearched ? (
              <p className="text-sm text-content-muted">
                Submit a report above to see AI similarity matches.
              </p>
            ) : matches.length === 0 ? (
              <p className="text-sm text-content-muted">No matches found.</p>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[200px_1fr] lg:gap-8">
                <div className="lg:sticky lg:top-16 lg:self-start">
                  <p className="mb-2 text-xs font-medium text-content-muted">Your upload</p>
                  <div className="card overflow-hidden">
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt={uploadedItem?.title || "Uploaded item"}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-square items-center justify-center text-xs text-content-faint">
                        No preview
                      </div>
                    )}
                    {uploadedItem?.title && (
                      <p className="truncate px-3 py-2 text-xs text-content-muted">
                        {uploadedItem.title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {matches.map((match, index) => (
                    <MatchCard key={match.id} match={match} featured={index === 0} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <StatsSection refreshKey={refreshKey} />
        <BrowseSection refreshKey={refreshKey} />
      </main>

      <Footer />
    </div>
  );
}
