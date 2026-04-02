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
  CheckCircle,
} from "lucide-react";

const exampleBooks = [
  {
    id: 1,
    title: "The Digital Nomad Blueprint",
    author: "Alex Carter",
    tagline: "Escape the 9-to-5. Build income from anywhere.",
    about: "A step-by-step guide to building a location-independent business using Amazon KDP.",
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
    about: "The complete Amazon KDP playbook for serious authors.",
    price: "$14.99",
    cta: "Start Reading Today",
    link: "https://amazon.com",
    coverGradient: "linear-gradient(160deg,#0d1117 0%,#1a2744 40%,#2d4a8a 100%)",
    coverColor: "#7eb8f7",
    label: "AMAZON MASTERY",
  },
];

const colorSwatches = ["#F5C842", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F97316", "#EC4899"];

const templates = [
  { id: "dark", name: "Midnight Dark" },
  { id: "light", name: "Publisher Light" },
  { id: "editorial", name: "Editorial" },
  { id: "cinematic", name: "Cinematic" },
];

function generatePageHTML(data: {
  title: string; author: string; tagline: string; about: string;
  price: string; cta: string; link: string; coverDataURL: string | null;
  accentColor: string; template: string; showLeadCapture: boolean;
  showStars: boolean; showBio: boolean;
}) {
  const isDark = data.template !== "light";
  const bg = isDark ? "#0A0A0F" : "#F8F7F4";
  const text = isDark ? "#E8E8F0" : "#1A1A2E";
  const muted = isDark ? "#6B6B85" : "#6B6B85";
  const accent = data.accentColor;
  const coverHTML = data.coverDataURL
    ? `<img src="${data.coverDataURL}" style="max-height:280px; border-radius:12px; box-shadow:0 16px 48px rgba(0,0,0,0.4);" />`
    : `<div style="width:160px;height:230px;background:linear-gradient(135deg,${accent}22,${accent}11);border:1px solid ${accent}33;border-radius:12px;display:flex;align-items:center;justify-content:center;color:${accent};font-size:2rem;">📖</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Outfit',sans-serif;background:${bg};color:${text};min-height:100vh}</style></head><body>
<div style="padding:40px 24px;text-align:center;">
  <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${accent};margin-bottom:20px;">NEW RELEASE</div>
  ${coverHTML}
  <h1 style="font-size:1.8rem;font-weight:900;margin-top:24px;letter-spacing:-0.02em;">${data.title || "Your Book Title"}</h1>
  <p style="font-size:0.85rem;color:${muted};margin-top:6px;">by ${data.author || "Author Name"}</p>
  <p style="font-size:0.9rem;color:${muted};margin-top:4px;font-style:italic;">${data.tagline || "Your tagline"}</p>
  ${data.price ? `<div style="font-size:1.3rem;font-weight:800;color:${accent};margin-top:12px;">${data.price}</div>` : ""}
  <a href="${data.link || "#"}" style="display:inline-block;background:${accent};color:${isDark ? "#0A0A0F" : "#fff"};padding:12px 32px;border-radius:10px;font-weight:800;font-size:0.9rem;text-decoration:none;margin-top:16px;">${data.cta || "Buy Now"}</a>
  ${data.showStars ? `<div style="margin-top:20px;color:${accent};font-size:1rem;">★★★★★ <span style="color:${muted};font-size:0.75rem;">4.9 · 1,247 ratings</span></div>` : ""}
  <div style="max-width:460px;margin:24px auto 0;text-align:left;">
    <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:10px;">About This Book</h3>
    <p style="color:${muted};line-height:1.7;font-size:0.85rem;">${data.about || "Your book description will appear here."}</p>
  </div>
  ${data.showLeadCapture ? `<div style="max-width:360px;margin:32px auto 0;padding:20px;border-radius:12px;border:1px solid ${accent}33;background:${isDark ? "#13131C" : "#fff"};">
    <p style="font-size:0.8rem;font-weight:600;margin-bottom:10px;">Get the first chapter free</p>
    <input type="email" placeholder="you@email.com" style="width:100%;padding:9px 12px;border-radius:8px;border:1px solid ${isDark ? "#2a2a3a" : "#ddd"};background:${isDark ? "#0A0A0F" : "#f9f9f9"};color:${text};font-size:0.8rem;margin-bottom:8px;" />
    <button style="width:100%;padding:9px;background:${accent};color:${isDark ? "#0A0A0F" : "#fff"};border:none;border-radius:8px;font-weight:700;font-size:0.8rem;cursor:pointer;">Send Me Chapter 1 →</button>
  </div>` : ""}
  ${data.showBio ? `<div style="max-width:360px;margin:32px auto 0;text-align:center;">
    <div style="width:56px;height:56px;border-radius:50%;background:${accent}22;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;">👤</div>
    <p style="font-weight:700;">${data.author}</p>
    <p style="color:${muted};font-size:0.75rem;margin-top:4px;">Bestselling author, speaker, and KDP strategist.</p>
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
  const [uploadAnimation, setUploadAnimation] = useState(false);
  const [exampleLoaded, setExampleLoaded] = useState<string | null>(null);

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
    setExampleLoaded(book.title);
    setTimeout(() => setExampleLoaded(null), 3000);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadAnimation(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverDataURL(reader.result as string);
      setTimeout(() => setUploadAnimation(false), 800);
    };
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
    <div className="flex h-full overflow-hidden">
      {/* Left Panel */}
      <div className="w-[300px] flex-shrink-0 border-r border-[rgba(255,255,255,0.06)] overflow-y-auto custom-scrollbar" style={{ background: "hsl(222 50% 6%)" }}>
        <div className="p-5">
          {/* Success Alert */}
          {exampleLoaded && (
            <div className="flex items-center gap-2 bg-emerald/10 text-emerald px-3 py-2 rounded-lg text-xs font-semibold mb-3 animate-fade-up">
              <CheckCircle size={13} /> Loaded "{exampleLoaded}"
            </div>
          )}

          {/* Example Books */}
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted mb-2">Start with an Example</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {exampleBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => loadExample(book.id)}
                className="border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden cursor-pointer transition-all hover:border-primary/40 hover:-translate-y-0.5 bg-secondary"
              >
                <div
                  className="w-full h-[80px] flex flex-col items-center justify-center text-[0.5rem] font-bold tracking-wider uppercase p-2 text-center"
                  style={{ background: book.coverGradient, color: book.coverColor }}
                >
                  <BookOpen size={16} className="mb-1 opacity-60" />
                  <span style={{ opacity: 0.8 }}>{book.label}</span>
                </div>
                <div className="p-2">
                  <div className="font-bold text-[0.65rem] text-foreground leading-tight">{book.title}</div>
                  <div className="text-[0.6rem] text-muted mt-0.5">{book.author}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Cover Upload */}
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted mb-2">Book Cover</div>
          <div
            onClick={() => coverInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all relative ${
              coverDataURL
                ? "border-primary/40 border-solid p-0"
                : "border-primary/25 hover:border-primary/50 bg-primary/[0.03]"
            } ${uploadAnimation ? "animate-pulse" : ""}`}
          >
            {coverDataURL ? (
              <div className="relative">
                <img src={coverDataURL} alt="Cover" className="w-full h-[180px] object-cover rounded-lg" />
                {uploadAnimation && (
                  <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
                    <CheckCircle size={32} className="text-primary animate-bounce" />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Image size={28} className="text-gold opacity-50 mx-auto mb-2" />
                <p className="text-xs text-muted">Click to upload</p>
                <p className="text-[0.65rem] text-muted"><span className="text-gold font-semibold">JPG, PNG, WEBP</span></p>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </div>

          {/* Book Details */}
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted mb-2 mt-4">Book Details</div>
          <div className="space-y-2.5">
            {[
              { label: "Book Title", value: title, setter: setTitle, placeholder: "Enter book title..." },
              { label: "Author", value: author, setter: setAuthor, placeholder: "Your name..." },
              { label: "Tagline", value: tagline, setter: setTagline, placeholder: "A bold one-liner..." },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1 block">{f.label}</label>
                <input
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1 block">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Book description..."
                rows={3}
                className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors resize-none leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1 block">Price</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$9.99" className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1 block">CTA</label>
                <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Get My Copy" className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted mb-1 block">Buy Link</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://amazon.com/dp/..." className="w-full bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
          </div>

          {/* Accent Color */}
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted mb-2 mt-4">Accent Color</div>
          <div className="flex gap-1.5 flex-wrap mb-3">
            {colorSwatches.map((c) => (
              <div
                key={c}
                onClick={() => setAccentColor(c)}
                className={`w-6 h-6 rounded-full cursor-pointer transition-all hover:scale-110 ${
                  accentColor === c ? "ring-2 ring-white/20 border-2 border-white" : "border-2 border-transparent"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>

          {/* Options */}
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted mb-2 mt-4">Options</div>
          {[
            { label: "Lead Capture", checked: showLeadCapture, setter: setShowLeadCapture },
            { label: "Star Ratings", checked: showStars, setter: setShowStars },
            { label: "Author Bio", checked: showBio, setter: setShowBio },
          ].map((opt) => (
            <div key={opt.label} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-xs font-medium text-foreground">{opt.label}</span>
              <label className="relative w-[34px] h-[18px] flex-shrink-0 cursor-pointer">
                <input type="checkbox" checked={opt.checked} onChange={() => opt.setter(!opt.checked)} className="opacity-0 w-0 h-0 peer" />
                <span className="absolute inset-0 rounded-full transition-all border bg-secondary border-[rgba(255,255,255,0.06)] peer-checked:bg-primary/15 peer-checked:border-primary/40" />
                <span className="absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-muted transition-all peer-checked:translate-x-4 peer-checked:bg-primary" />
              </label>
            </div>
          ))}

          {/* Templates */}
          <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted mb-2 mt-4">Template</div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all relative ${
                  selectedTemplate === t.id ? "border-gold" : "border-[rgba(255,255,255,0.06)] hover:border-primary/40"
                } bg-secondary`}
              >
                <div className={`w-full h-[60px] ${
                  t.id === "dark" ? "bg-[#0A0A0F]" : t.id === "light" ? "bg-[#F8F7F4]" : t.id === "editorial" ? "bg-[#0F1117]" : "bg-[#070710]"
                } flex items-center justify-center`}>
                  <BookOpen size={14} className={t.id === "light" ? "text-[#1A1A2E] opacity-30" : "text-foreground opacity-20"} />
                </div>
                <div className={`text-[0.6rem] font-semibold px-2 py-1.5 ${selectedTemplate === t.id ? "text-gold" : "text-muted"}`}>{t.name}</div>
                {selectedTemplate === t.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold text-primary-foreground flex items-center justify-center text-[0.5rem] font-extrabold">✓</div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2 mt-4">
            <button
              onClick={generatePreview}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-extrabold text-xs transition-all hover:brightness-110 hover:shadow-[0_8px_24px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
            >
              <Eye size={14} /> Generate Preview
            </button>
            <button
              onClick={() => { generatePreview(); setShowFullPreview(true); }}
              className="w-full bg-transparent border border-[rgba(255,255,255,0.06)] text-muted py-2.5 rounded-lg font-semibold text-xs transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
              <Maximize2 size={13} /> Full Screen Preview
            </button>
            <button
              onClick={copyHTML}
              className="w-full bg-transparent border border-[rgba(255,255,255,0.06)] text-muted py-2.5 rounded-lg font-semibold text-xs transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
              <Code size={13} /> Copy HTML
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel — Preview */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#08080D" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0" style={{ background: "hsl(222 50% 6%)" }}>
          <div>
            <div className="font-bold text-sm text-foreground">Live Preview</div>
            <div className="text-[0.65rem] text-muted">{previewHTML ? "Preview generated" : "Fill in details → Generate"}</div>
          </div>
          <div className="flex items-center gap-2">
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
                  <d.icon size={13} />
                </button>
              ))}
            </div>
            <button
              onClick={() => { generatePreview(); setShowFullPreview(true); }}
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-[0.65rem] font-bold transition-all hover:brightness-110 flex items-center gap-1"
            >
              <Maximize2 size={11} /> Full
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex items-start justify-center p-4 custom-scrollbar" style={{
          background: "#06060A",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}>
          {!previewHTML ? (
            <div className="flex flex-col items-center justify-center gap-3 text-muted flex-1 h-full">
              <BookOpen size={40} className="opacity-30" />
              <div className="font-bold text-sm text-foreground opacity-40">No Preview Yet</div>
              <p className="text-xs opacity-60 max-w-[240px] text-center leading-relaxed">
                Fill in your book details, then click "Generate Preview".
              </p>
            </div>
          ) : (
            <div
              className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-[0_32px_80px_rgba(0,0,0,0.6)] flex-shrink-0 transition-all duration-300 bg-secondary"
              style={{ width: deviceWidth, maxWidth: "100%" }}
            >
              <iframe
                ref={iframeRef}
                srcDoc={previewHTML}
                title="Landing page preview"
                className="w-full border-none block bg-white"
                style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}
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
            <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <Eye size={14} className="text-gold" /> Full Page Preview
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyHTML} className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1">
                  <Code size={11} /> Copy HTML
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
