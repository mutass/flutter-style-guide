import { useState, useRef, useCallback } from "react";
import {
  Image,
  Eye,
  Code,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  BookOpen,
} from "lucide-react";

const exampleBooks = [
  {
    id: 1,
    title: "The Digital Nomad Blueprint",
    author: "Alex Carter",
    tagline: "Escape the 9-to-5. Build income from anywhere.",
    about:
      "A step-by-step guide to building a location-independent business using Amazon KDP. Discover niche research, cover design, pricing, and scaling to six figures.",
    price: "$12.99",
    cta: "Get My Copy Now",
    link: "https://amazon.com",
    coverGradient: "linear-gradient(160deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)",
    coverColor: "#e2b96a",
    label: "KDP NOMAD",
  },
  {
    id: 2,
    title: "Amazon KDP Mastery",
    author: "Jordan Mills",
    tagline: "Dominate the Kindle Store. Own your royalties.",
    about:
      "The complete Amazon KDP playbook for serious authors. Learn how to research, write, publish, and market.",
    price: "$14.99",
    cta: "Start Reading Today",
    link: "https://amazon.com",
    coverGradient: "linear-gradient(160deg,#0d1117 0%,#1a2744 40%,#2d4a8a 100%)",
    coverColor: "#7eb8f7",
    label: "AMAZON MASTERY",
  },
];

const colorSwatches = [
  "#F5C842",
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
  "#EC4899",
];

const templates = [
  { id: "dark", name: "Midnight Dark" },
  { id: "light", name: "Publisher Light" },
  { id: "editorial", name: "Editorial" },
  { id: "cinematic", name: "Cinematic" },
];

function generatePageHTML(data: {
  title: string;
  author: string;
  tagline: string;
  about: string;
  price: string;
  cta: string;
  link: string;
  coverDataURL: string | null;
  accentColor: string;
  template: string;
  showLeadCapture: boolean;
  showStars: boolean;
  showBio: boolean;
}) {
  const isDark = data.template === "dark" || data.template === "editorial" || data.template === "cinematic";
  const bg = isDark ? "#0A0A0F" : "#F8F7F4";
  const text = isDark ? "#E8E8F0" : "#1A1A2E";
  const muted = isDark ? "#6B6B85" : "#6B6B85";
  const accent = data.accentColor;
  const coverHTML = data.coverDataURL
    ? `<img src="${data.coverDataURL}" style="max-height:320px; border-radius:12px; box-shadow:0 16px 48px rgba(0,0,0,0.4);" />`
    : `<div style="width:180px;height:260px;background:linear-gradient(135deg,${accent}22,${accent}11);border:1px solid ${accent}33;border-radius:12px;display:flex;align-items:center;justify-content:center;color:${accent};font-size:2rem;">📖</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Outfit',sans-serif;background:${bg};color:${text};min-height:100vh}</style></head><body>
<div style="padding:48px 32px;text-align:center;">
  <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${accent};margin-bottom:24px;">NEW RELEASE</div>
  ${coverHTML}
  <h1 style="font-size:2.2rem;font-weight:900;margin-top:32px;letter-spacing:-0.02em;">${data.title || "Your Book Title"}</h1>
  <p style="font-size:0.9rem;color:${muted};margin-top:8px;">by ${data.author || "Author Name"}</p>
  <p style="font-size:1rem;color:${muted};margin-top:4px;font-style:italic;">${data.tagline || "Your tagline"}</p>
  ${data.price ? `<div style="font-size:1.5rem;font-weight:800;color:${accent};margin-top:16px;">${data.price}</div>` : ""}
  <a href="${data.link || "#"}" style="display:inline-block;background:${accent};color:${isDark ? "#0A0A0F" : "#fff"};padding:14px 36px;border-radius:10px;font-weight:800;font-size:0.95rem;text-decoration:none;margin-top:20px;transition:all 0.2s;">${data.cta || "Buy Now"}</a>
  ${data.showStars ? `<div style="margin-top:24px;color:${accent};font-size:1.1rem;">★★★★★ <span style="color:${muted};font-size:0.8rem;">4.9 · 1,247 ratings</span></div>` : ""}
  <div style="max-width:500px;margin:32px auto 0;text-align:left;">
    <h3 style="font-size:1rem;font-weight:700;margin-bottom:12px;">About This Book</h3>
    <p style="color:${muted};line-height:1.7;font-size:0.9rem;">${data.about || "Your book description will appear here."}</p>
  </div>
  ${data.showLeadCapture ? `<div style="max-width:400px;margin:40px auto 0;padding:24px;border-radius:14px;border:1px solid ${accent}33;background:${isDark ? "#13131C" : "#fff"};">
    <p style="font-size:0.85rem;font-weight:600;margin-bottom:12px;">Get the first chapter free</p>
    <input type="email" placeholder="you@email.com" style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid ${isDark ? "#2a2a3a" : "#ddd"};background:${isDark ? "#0A0A0F" : "#f9f9f9"};color:${text};font-size:0.85rem;margin-bottom:8px;" />
    <button style="width:100%;padding:10px;background:${accent};color:${isDark ? "#0A0A0F" : "#fff"};border:none;border-radius:8px;font-weight:700;font-size:0.85rem;cursor:pointer;">Send Me Chapter 1 →</button>
  </div>` : ""}
  ${data.showBio ? `<div style="max-width:400px;margin:40px auto 0;text-align:center;">
    <div style="width:64px;height:64px;border-radius:50%;background:${accent}22;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">👤</div>
    <p style="font-weight:700;">${data.author}</p>
    <p style="color:${muted};font-size:0.8rem;margin-top:4px;">Bestselling author, speaker, and KDP strategist.</p>
  </div>` : ""}
</div></body></html>`;
}

const LandingPageBuilder = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tagline, setTagline] = useState("");
  const [about, setAbout] = useState("");
  const [price, setPrice] = useState("");
  const [cta, setCta] = useState("Get My Copy");
  const [link, setLink] = useState("");
  const [coverDataURL, setCoverDataURL] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState("#F5C842");
  const [selectedTemplate, setSelectedTemplate] = useState("dark");
  const [showLeadCapture, setShowLeadCapture] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [showBio, setShowBio] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");
  const [device, setDevice] = useState("desktop");
  const [showFullPreview, setShowFullPreview] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const loadExample = (id: number) => {
    const book = exampleBooks.find((b) => b.id === id);
    if (!book) return;
    setTitle(book.title);
    setAuthor(book.author);
    setTagline(book.tagline);
    setAbout(book.about);
    setPrice(book.price);
    setCta(book.cta);
    setLink(book.link);
    setCoverDataURL(null);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverDataURL(reader.result as string);
    reader.readAsDataURL(file);
  };

  const generatePreview = useCallback(() => {
    const html = generatePageHTML({
      title, author, tagline, about, price, cta, link,
      coverDataURL, accentColor, template: selectedTemplate,
      showLeadCapture, showStars, showBio,
    });
    setPreviewHTML(html);
  }, [title, author, tagline, about, price, cta, link, coverDataURL, accentColor, selectedTemplate, showLeadCapture, showStars, showBio]);

  const copyHTML = () => {
    if (!previewHTML) return;
    navigator.clipboard.writeText(previewHTML);
  };

  const deviceWidth = device === "mobile" ? "375px" : device === "tablet" ? "768px" : "100%";

  return (
    <div className="flex h-[calc(100vh-141px)]" style={{ margin: "-30px -34px", padding: 0 }}>
      {/* Left Panel */}
      <div className="w-[320px] flex-shrink-0 border-r border-[rgba(255,255,255,0.06)] overflow-y-auto p-6 custom-scrollbar" style={{ background: "hsl(222 50% 6%)" }}>
        {/* Example Books */}
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted mb-3 font-[Syne]">Start with an Example Book</div>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {exampleBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => loadExample(book.id)}
              className="border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden cursor-pointer transition-all hover:border-primary/40 hover:-translate-y-0.5 bg-secondary"
            >
              <div
                className="w-full h-[110px] flex flex-col items-center justify-center text-[0.55rem] font-bold tracking-wider uppercase p-2 text-center"
                style={{ background: book.coverGradient, color: book.coverColor }}
              >
                <BookOpen size={20} className="mb-1 opacity-60" />
                <span style={{ opacity: 0.8 }}>{book.label}</span>
              </div>
              <div className="p-2.5">
                <div className="font-bold text-[0.7rem] text-foreground leading-tight font-[Syne]">{book.title}</div>
                <div className="text-[0.65rem] text-muted mt-0.5">{book.author}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[0.7rem] text-muted mb-1 px-0.5">Or upload your own cover below</div>

        {/* Cover Upload */}
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted mb-3 mt-4 font-[Syne]">Book Cover</div>
        <div
          onClick={() => coverInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[14px] p-6 text-center cursor-pointer transition-all ${
            coverDataURL
              ? "border-primary/40 border-solid p-0"
              : "border-primary/25 hover:border-primary/50 bg-primary/[0.03]"
          }`}
        >
          {coverDataURL ? (
            <img src={coverDataURL} alt="Cover" className="w-full h-[220px] object-cover rounded-xl" />
          ) : (
            <div>
              <Image size={32} className="text-gold opacity-50 mx-auto mb-2" />
              <p className="text-sm text-muted">Click or drag to upload</p>
              <p className="text-xs text-muted"><span className="text-gold font-semibold">JPG, PNG, WEBP</span> supported</p>
            </div>
          )}
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        </div>

        {/* Book Details */}
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted mb-3 mt-6 font-[Syne]">Book Details</div>
        <div className="space-y-3.5">
          {[
            { label: "Book Title", value: title, setter: setTitle, placeholder: "Enter your book title..." },
            { label: "Author Name", value: author, setter: setAuthor, placeholder: "Your name..." },
            { label: "Tagline / Subtitle", value: tagline, setter: setTagline, placeholder: "A bold one-liner..." },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1.5 block">{f.label}</label>
              <input
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-[9px] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors font-[DM_Sans]"
              />
            </div>
          ))}
          <div>
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1.5 block">About This Book</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write a compelling description of your book..."
              rows={4}
              className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-[9px] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors resize-none leading-relaxed font-[DM_Sans]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1.5 block">Price</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$9.99" className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-[9px] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors font-[DM_Sans]" />
            </div>
            <div>
              <label className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1.5 block">CTA Button</label>
              <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Get My Copy" className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-[9px] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors font-[DM_Sans]" />
            </div>
          </div>
          <div>
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1.5 block">Amazon / Buy Link</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://amazon.com/dp/..." className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-[9px] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors font-[DM_Sans]" />
          </div>
        </div>

        {/* Accent Color */}
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted mb-3 mt-6 font-[Syne]">Accent Color</div>
        <div className="flex gap-2 flex-wrap mb-3.5">
          {colorSwatches.map((c) => (
            <div
              key={c}
              onClick={() => setAccentColor(c)}
              className={`w-7 h-7 rounded-full cursor-pointer transition-all hover:scale-110 ${
                accentColor === c ? "ring-2 ring-white/20 border-2 border-white" : "border-2 border-transparent"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>

        {/* Options / Toggles */}
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted mb-3 mt-6 font-[Syne]">Options</div>
        {[
          { label: "Lead Capture Form", sub: "Add email opt-in to page", checked: showLeadCapture, setter: setShowLeadCapture },
          { label: "Social Proof Stars", sub: "Show 5-star rating section", checked: showStars, setter: setShowStars },
          { label: "Author Bio Section", sub: "Show author spotlight block", checked: showBio, setter: setShowBio },
        ].map((opt) => (
          <div key={opt.label} className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.06)] mb-2">
            <div>
              <div className="text-sm font-medium text-foreground">{opt.label}</div>
              <div className="text-[0.7rem] text-muted mt-0.5">{opt.sub}</div>
            </div>
            <label className="relative w-[38px] h-[22px] flex-shrink-0 cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={() => opt.setter(!opt.checked)} className="opacity-0 w-0 h-0 peer" />
              <span className="absolute inset-0 rounded-full transition-all border bg-secondary border-[rgba(255,255,255,0.06)] peer-checked:bg-primary/15 peer-checked:border-primary/40" />
              <span className="absolute top-[3px] left-[3px] w-[14px] h-[14px] rounded-full bg-muted transition-all peer-checked:translate-x-4 peer-checked:bg-primary" />
            </label>
          </div>
        ))}

        {/* Template Selection */}
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted mb-3 mt-6 font-[Syne]">Choose Template</div>
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all relative ${
                selectedTemplate === t.id
                  ? "border-gold"
                  : "border-[rgba(255,255,255,0.06)] hover:border-primary/40 hover:-translate-y-0.5"
              } bg-secondary`}
            >
              <div className={`w-full h-[90px] ${
                t.id === "dark" ? "bg-[#0A0A0F]" :
                t.id === "light" ? "bg-[#F8F7F4]" :
                t.id === "editorial" ? "bg-[#0F1117]" :
                "bg-[#070710]"
              } flex items-center justify-center`}>
                <BookOpen size={20} className={t.id === "light" ? "text-[#1A1A2E] opacity-30" : "text-foreground opacity-20"} />
              </div>
              <div className={`text-[0.7rem] font-semibold px-2.5 py-2 ${selectedTemplate === t.id ? "text-gold" : "text-muted"}`}>
                {t.name}
              </div>
              {selectedTemplate === t.id && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gold text-primary-foreground flex items-center justify-center text-[0.6rem] font-extrabold">✓</div>
              )}
            </div>
          ))}
        </div>

        {/* Build Actions */}
        <div className="space-y-2.5 mt-5">
          <button
            onClick={generatePreview}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-extrabold text-sm transition-all hover:brightness-110 hover:shadow-[0_8px_24px_rgba(0,229,255,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Eye size={15} /> Generate Preview
          </button>
          <button
            onClick={() => { generatePreview(); setShowFullPreview(true); }}
            className="w-full bg-transparent border border-[rgba(255,255,255,0.06)] text-muted py-3 rounded-lg font-semibold text-sm transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
          >
            <Maximize2 size={15} /> Full Screen Preview
          </button>
          <button
            onClick={copyHTML}
            className="w-full bg-transparent border border-[rgba(255,255,255,0.06)] text-muted py-3 rounded-lg font-semibold text-sm transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
          >
            <Code size={15} /> Copy Page HTML
          </button>
        </div>
      </div>

      {/* Right Panel — Preview */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#08080D" }}>
        {/* Preview Topbar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0" style={{ background: "hsl(222 50% 6%)" }}>
          <div>
            <div className="font-bold text-sm text-foreground font-[Syne]">Live Preview</div>
            <div className="text-xs text-muted">{previewHTML ? "Preview generated" : "Fill in your book details →"}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[
                { id: "desktop", icon: Monitor },
                { id: "tablet", icon: Tablet },
                { id: "mobile", icon: Smartphone },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    device === d.id
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-secondary border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground"
                  }`}
                >
                  <d.icon size={14} />
                </button>
              ))}
            </div>
            <button
              onClick={() => { generatePreview(); setShowFullPreview(true); }}
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:brightness-110 flex items-center gap-1"
            >
              <Maximize2 size={12} /> Full Preview
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-6 custom-scrollbar" style={{
          background: "#06060A",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}>
          {!previewHTML ? (
            <div className="flex flex-col items-center justify-center gap-4 text-muted flex-1 h-full">
              <BookOpen size={48} className="opacity-30" />
              <div className="font-bold text-base text-foreground opacity-40 font-[Syne]">No Preview Yet</div>
              <p className="text-sm opacity-60 max-w-[280px] text-center leading-relaxed">
                Fill in your book title and description, then click "Generate Preview" to see your landing page.
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_32px_80px_rgba(0,0,0,0.6)] flex-shrink-0 transition-all duration-300 bg-secondary"
              style={{ width: deviceWidth, maxWidth: "900px" }}
            >
              <iframe
                ref={iframeRef}
                srcDoc={previewHTML}
                title="Landing page preview"
                className="w-full border-none block bg-white"
                style={{ height: "580px" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Full Preview Modal */}
      {showFullPreview && previewHTML && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowFullPreview(false); }}
        >
          <div className="bg-[hsl(222,50%,6%)] border border-[rgba(255,255,255,0.06)] rounded-2xl w-[90vw] max-w-[1100px] h-[90vh] flex flex-col overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground font-[Syne]">
                <Eye size={15} className="text-gold" /> Full Page Preview
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyHTML} className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1">
                  <Code size={12} /> Copy HTML
                </button>
                <button onClick={() => setShowFullPreview(false)} className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors">
                  ✕ Close
                </button>
              </div>
            </div>
            <iframe srcDoc={previewHTML} title="Full page preview" className="flex-1 border-none w-full bg-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageBuilder;