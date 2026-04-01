import { useState } from "react";
import {
  Globe,
  Upload,
  Eye,
  Palette,
  Type,
  Image,
  Star,
  Sparkles,
  ExternalLink,
  Check,
  BookOpen,
} from "lucide-react";

const templates = [
  { id: "nomad", name: "Nomad", desc: "Minimalist travel writer aesthetic", accent: "from-primary to-cyan-2", popular: true },
  { id: "bestseller", name: "Bestseller", desc: "Bold hero with social proof bar", accent: "from-gold to-amber-400", popular: false },
  { id: "memoir", name: "Memoir", desc: "Elegant serif typography layout", accent: "from-indigo-400 to-indigo-600", popular: false },
  { id: "thriller", name: "Thriller", desc: "Dark cinematic full-bleed cover", accent: "from-coral to-red-500", popular: true },
];

const LandingPageBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("nomad");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("The Nomad's Guide to Freedom");
  const [subtitle, setSubtitle] = useState("How I Left Corporate America and Built a Life on My Terms");
  const [authorName, setAuthorName] = useState("Sarah Mitchell");
  const [blurb, setBlurb] = useState("A raw, inspiring memoir about trading the corner office for a one-way ticket — and discovering that the best business plan is no plan at all.");
  const [ctaText, setCtaText] = useState("Pre-Order Now");
  const [accentColor, setAccentColor] = useState("#00E5FF");

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      {/* Left — Configuration */}
      <div className="space-y-5">
        {/* Template Selection */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={16} className="text-primary" />
            <span className="font-bold text-sm text-foreground">Choose Template</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`relative text-left p-4 rounded-xl border transition-all ${
                  selectedTemplate === t.id
                    ? "border-primary/40 bg-primary/[0.08]"
                    : "border-[rgba(255,255,255,0.06)] hover:border-primary/20 bg-card"
                }`}
              >
                {t.popular && (
                  <span className="absolute top-2 right-2 bg-gold/15 text-gold text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={8} /> Popular
                  </span>
                )}
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.accent} mb-2.5 flex items-center justify-center`}>
                  <Globe size={14} className="text-primary-foreground" />
                </div>
                <div className="font-semibold text-sm text-foreground">{t.name}</div>
                <div className="text-[0.68rem] text-muted mt-0.5">{t.desc}</div>
                {selectedTemplate === t.id && (
                  <div className="absolute top-3 left-3">
                    <Check size={14} className="text-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Book Details */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Type size={16} className="text-primary" />
            <span className="font-bold text-sm text-foreground">Book Details</span>
          </div>
          <div className="space-y-3.5">
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted mb-1.5 block">Book Title</label>
              <input
                value={bookTitle}
                onChange={e => setBookTitle(e.target.value)}
                className="w-full bg-background border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted mb-1.5 block">Subtitle</label>
              <input
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full bg-background border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted mb-1.5 block">Author Name</label>
              <input
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full bg-background border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted mb-1.5 block">Book Blurb</label>
              <textarea
                value={blurb}
                onChange={e => setBlurb(e.target.value)}
                rows={3}
                className="w-full bg-background border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted mb-1.5 block">CTA Button Text</label>
                <input
                  value={ctaText}
                  onChange={e => setCtaText(e.target.value)}
                  className="w-full bg-background border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted mb-1.5 block">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={e => setAccentColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.08)] cursor-pointer bg-transparent"
                  />
                  <input
                    value={accentColor}
                    onChange={e => setAccentColor(e.target.value)}
                    className="flex-1 bg-background border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Upload */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Image size={16} className="text-primary" />
            <span className="font-bold text-sm text-foreground">Book Cover</span>
          </div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl p-8 cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/[0.03]">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="h-36 rounded-lg shadow-lg object-contain" />
            ) : (
              <>
                <Upload size={28} className="text-muted mb-2" />
                <span className="text-sm font-semibold text-muted">Drop cover image or click to upload</span>
                <span className="text-[0.65rem] text-muted/60 mt-1">PNG, JPG — recommended 1600×2560px</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm transition-all hover:brightness-110 hover:shadow-[0_6px_24px_rgba(0,229,255,0.25)] flex items-center justify-center gap-2">
            <Sparkles size={15} /> Generate Page
          </button>
          <button className="bg-card border border-[rgba(255,255,255,0.06)] text-muted py-3 px-5 rounded-xl font-semibold text-sm transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center gap-2">
            <Eye size={15} /> Preview
          </button>
        </div>
      </div>

      {/* Right — Live Preview */}
      <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-primary" />
            <span className="font-bold text-xs text-foreground">Live Preview</span>
          </div>
          <button className="text-muted hover:text-foreground transition-colors">
            <ExternalLink size={14} />
          </button>
        </div>

        {/* Mini browser preview */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]" style={{ background: "hsl(222 50% 4%)" }}>
            {/* Preview Nav */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-xs font-bold text-foreground">{authorName}</span>
              <div className="flex gap-3 text-[0.6rem] text-muted font-semibold">
                <span>About</span>
                <span>Books</span>
                <span className="text-primary">Pre-Order</span>
              </div>
            </div>

            {/* Preview Hero */}
            <div className="px-5 py-8 text-center">
              {coverPreview ? (
                <img src={coverPreview} alt="Book cover" className="h-40 mx-auto rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] mb-5 object-contain" />
              ) : (
                <div className="w-28 h-40 mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-cyan-2/10 border border-primary/20 flex items-center justify-center mb-5">
                  <BookOpen size={28} className="text-primary/50" />
                </div>
              )}
              <div className="text-lg font-black text-foreground leading-tight mb-1">{bookTitle || "Book Title"}</div>
              <div className="text-[0.7rem] text-muted mb-1">by {authorName || "Author"}</div>
              <div className="text-[0.68rem] text-muted italic mb-4 max-w-[280px] mx-auto">{subtitle || "Subtitle goes here"}</div>
              <button
                className="px-6 py-2 rounded-full text-xs font-bold text-primary-foreground transition-all"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText || "Pre-Order"}
              </button>
            </div>

            {/* Preview Blurb */}
            <div className="px-5 pb-6">
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-2">About the Book</div>
              <div className="text-[0.68rem] text-muted/80 leading-relaxed">{blurb || "Your book description will appear here..."}</div>
            </div>

            {/* Preview Social Proof */}
            <div className="px-5 pb-6 flex justify-center gap-4">
              {[
                { val: "4.8★", label: "Rating" },
                { val: "1.2K", label: "Pre-Orders" },
                { val: "#3", label: "Bestseller" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-sm font-black text-foreground">{s.val}</div>
                  <div className="text-[0.55rem] text-muted">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Preview Footer */}
            <div className="border-t border-[rgba(255,255,255,0.06)] px-5 py-3 text-center">
              <div className="text-[0.55rem] text-muted">© 2026 {authorName}. All rights reserved.</div>
            </div>
          </div>

          {/* Template badge */}
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-[0.62rem] font-semibold">
              <Palette size={10} />
              {templates.find(t => t.id === selectedTemplate)?.name} Template
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageBuilder;
