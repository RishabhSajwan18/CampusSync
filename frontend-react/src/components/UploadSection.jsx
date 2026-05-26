import { useCallback, useRef, useState } from "react";
import { createItem } from "../services/api";

const INITIAL_FORM = {
  title: "",
  description: "",
  location: "",
  type: "lost",
};

export default function UploadSection({ onUploadSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const fileInputRef = useRef(null);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const setFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, image: "Please select a valid image file" }));
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setFieldErrors((prev) => ({ ...prev, image: null }));
  }, [preview]);

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
    setError(null);

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("description", form.description.trim() || "");
    formData.append("location", form.location.trim() || "");
    formData.append("type", form.type);
    formData.append("image", imageFile);

    try {
      const data = await createItem(formData);
      onUploadSuccess?.(data);
      setForm(INITIAL_FORM);
      setImageFile(null);
      if (preview) URL.revokeObjectURL(preview);
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
    <section id="lost-found" className="relative py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="section-heading">Report an Item</h2>
          <p className="section-sub mx-auto">
            Upload a photo and details. Our AI will search for visually similar
            opposite-type reports on campus.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-strong overflow-hidden rounded-3xl shadow-glass"
        >
          <div className="border-b border-white/10 bg-gradient-to-r from-accent-blue/10 via-transparent to-accent-violet/10 px-6 py-4 sm:px-8">
            <p className="text-sm font-medium text-slate-300">Item type</p>
            <div className="mt-3 flex rounded-xl bg-navy-900/80 p-1 ring-1 ring-white/10">
              {["lost", "found"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateField("type", t)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
                    form.type === t
                      ? t === "lost"
                        ? "bg-rose-500/20 text-rose-300 shadow-sm ring-1 ring-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 shadow-sm ring-1 ring-emerald-500/30"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-300">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Black backpack with laptop"
                className={`input-field ${fieldErrors.title ? "border-rose-500/50 ring-rose-500/20" : ""}`}
                disabled={loading}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Distinctive features, brand, color..."
                className="input-field resize-none"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-slate-300">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. Library 2nd floor"
                className="input-field"
                disabled={loading}
              />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-300">
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
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  dragOver
                    ? "border-accent-cyan bg-accent-cyan/5"
                    : fieldErrors.image
                      ? "border-rose-500/40 bg-rose-500/5"
                      : "border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
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
                  <div className="relative mx-auto max-w-xs">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-xl object-contain shadow-lg ring-1 ring-white/10"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage();
                      }}
                      className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-slate-400 ring-1 ring-white/20 hover:text-white"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 ring-1 ring-white/10">
                      <svg className="h-7 w-7 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="font-medium text-white">Drag & drop your image here</p>
                    <p className="mt-1 text-sm text-slate-500">or click to browse · PNG, JPG, WEBP</p>
                  </>
                )}
              </div>
              {fieldErrors.image && (
                <p className="mt-1 text-xs text-rose-400">{fieldErrors.image}</p>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Searching AI matches...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Upload & Find Matches
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
