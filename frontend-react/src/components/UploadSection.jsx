import { useCallback, useEffect, useRef, useState } from "react";
import { createItem } from "../services/api";

const INITIAL_FORM = {
  title: "",
  description: "",
  location: "",
  type: "lost",
};

const LOADING_PHASES = [
  "Uploading...",
  "Analyzing...",
  "Searching matches...",
  "Ranking results...",
];

export default function UploadSection({ onUploadSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const fileInputRef = useRef(null);
  const phaseTimerRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      setLoadingPhase(0);
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      return;
    }

    phaseTimerRef.current = setInterval(() => {
      setLoadingPhase((p) => (p < LOADING_PHASES.length - 1 ? p + 1 : p));
    }, 900);

    return () => {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, [loading]);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const setFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) {
        setFieldErrors((prev) => ({ ...prev, image: "Please select a valid image file" }));
        return;
      }
      if (preview) URL.revokeObjectURL(preview);
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setFieldErrors((prev) => ({ ...prev, image: null }));
    },
    [preview]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
  };

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!imageFile) errors.image = "Image is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setLoadingPhase(0);
    setError(null);

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim() || "");
    formData.append("location", form.location.trim() || "");
    formData.append("type", form.type);
    formData.append("image", imageFile);

    try {
      const data = await createItem(formData);
      const imageForResults = data.item?.image_url || preview;
      onUploadSuccess?.(data, imageForResults);
      setForm(INITIAL_FORM);
      setImageFile(null);
      if (preview && data.item?.image_url) URL.revokeObjectURL(preview);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section id="lost-found" className="py-8 sm:py-10">
      <div className="mx-auto max-w-report px-4 sm:px-6">
        <div className="mb-5">
          <h2 className="section-title">Report Lost / Found</h2>
          <p className="section-desc">
            Add details and a photo. We&apos;ll match against opposite-type reports.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-5 sm:p-6">
          <div className="mb-5">
            <span className="mb-2 block text-xs font-medium text-content-muted">Type</span>
            <div className="segmented max-w-xs">
              {["lost", "found"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateField("type", t)}
                  disabled={loading}
                  className={`segmented-btn ${
                    form.type === t ? "segmented-btn-active" : "segmented-btn-inactive"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-xs font-medium text-content-muted">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Black backpack with laptop"
                className={`input-field ${fieldErrors.title ? "border-rose-500/40" : ""}`}
                disabled={loading}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-xs font-medium text-content-muted">
                Description
              </label>
              <textarea
                id="description"
                rows={2}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brand, color, distinctive marks..."
                className="input-field resize-none"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-1 block text-xs font-medium text-content-muted">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Library, 2nd floor"
                className="input-field"
                disabled={loading}
              />
            </div>

            <div>
              <span className="mb-1 block text-xs font-medium text-content-muted">
                Image <span className="text-rose-400">*</span>
              </span>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`cursor-pointer rounded-md border border-dashed px-4 py-6 text-center transition-colors duration-200 ${
                  dragOver
                    ? "border-primary/50 bg-primary/5"
                    : fieldErrors.image
                      ? "border-rose-500/40 bg-rose-500/5"
                      : "border-white/[0.1] hover:border-white/[0.18] hover:bg-white/[0.02]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  disabled={loading}
                />

                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-36 rounded-md object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface-elevated text-xs text-content-muted hover:text-content"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-content">Drop image here or click to browse</p>
                    <p className="mt-1 text-xs text-content-faint">PNG, JPG, WEBP</p>
                  </>
                )}
              </div>
              {fieldErrors.image && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.image}</p>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {LOADING_PHASES[loadingPhase]}
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
