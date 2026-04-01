import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  BookOpen,
  Sparkles,
  Download,
  Eye,
  Book,
  Star,
  ShieldCheck,
  Info,
  CheckCircle,
} from "lucide-react";

const exampleBooks = [
  {
    key: "nomad",
    title: "The Digital Nomad Blueprint",
    author: "Alex Carter",
    genre: "📘 Business",
    rating: "⭐ 4.9",
    content: `The Digital Nomad Blueprint\nAlex Carter\n\nIntroduction\n\nThe dream of working from anywhere is real. This book gives you the exact blueprint to make it happen — no hype, just strategy.\n\nChapter 1: Why Location Independence Matters\n\nImagine waking up in Bali, grabbing your laptop, and making money while the world commutes. Location independence isn't about running from responsibility — it's about designing a life that fits you.\n\nChapter 2: Finding Your Profitable Niche\n\nNiche selection is 80% of the success in self-publishing. You need a topic people are searching for, willing to pay for, and underserved by current offerings. Use tools like Publisher Rocket and Amazon's own search bar.\n\nChapter 3: Writing for Speed and Quality\n\nYou don't need to write like Hemingway. You need clarity, structure, and consistency. Aim for 2,000 words per day using the Pomodoro technique.\n\nChapter 4: Designing a Cover That Converts\n\nA professional cover is non-negotiable. Your cover sells the click. Use Canva Pro or hire a designer from 99designs. Study the top 10 books in your category.\n\nChapter 5: Launching to #1\n\nUse ARC readers, Kindle Countdown Deals, and external traffic from your email list to spike your BSR at launch. Timing is everything.\n\nConclusion: Your First 10 Sales\n\nStart today, publish your first book in 30 days, and build from there. Every empire starts with a single step.`,
  },
  {
    key: "mastery",
    title: "Amazon KDP Mastery",
    author: "Jordan Mills",
    genre: "📖 Self-publishing",
    rating: "⭐ 4.8",
    content: `Amazon KDP Mastery\nJordan Mills\n\nForeword\n\nIf you're reading this, you're already ahead of 90% of aspiring authors. This book will take you from curious to published.\n\nChapter 1: Why KDP is Still a Goldmine\n\nDespite myths, KDP remains one of the best ways to build passive income through digital publishing. The barrier to entry is low but the ceiling is unlimited.\n\nChapter 2: Niche Research Deep Dive\n\nDon't write what you love — write what readers want to buy. Learn to analyze BSR, review counts, and keyword difficulty.\n\nChapter 3: Writing High-Quality Manuscripts Fast\n\nUse a structured outline, dictation software, and AI tools to accelerate your writing without sacrificing quality.\n\nChapter 4: Cover Design That Sells\n\nYour cover is your first impression. It must match genre expectations while standing out in thumbnail size.\n\nChapter 5: Keyword Optimization & Categories\n\nFill all seven keyword slots with long-tail, buyer-intent phrases. Choose categories strategically to maximize ranking potential.\n\nChapter 6: Advertising for Profit\n\nStart with Amazon Ads using auto campaigns, then refine with manual targeting based on ACOS data.\n\nConclusion: Building a Catalog\n\nOne book is a hobby; ten books is a business. Focus on volume, quality, and reader retention.`,
  },
  {
    key: "fiction",
    title: "Echoes of the Deep",
    author: "Samantha Reid",
    genre: "📚 Fiction",
    rating: "⭐ 4.7",
    content: `Echoes of the Deep\nSamantha Reid\n\nPrologue\n\nThe ocean holds secrets older than humanity. Some are beautiful. Some are terrifying. And some should never be found.\n\nChapter One: The Dive\n\nLena checked her oxygen tank for the third time. The readings were normal, but her gut told her something was different about today's dive.\n\nChapter Two: The Discovery\n\nAt 40 meters, a dark opening appeared in the reef wall. It wasn't on any chart. The current pulled gently toward it, as if inviting her in.\n\nChapter Three: Whispers\n\nInside the cave, strange sounds echoed — not the usual clicks of marine life, but something almost... melodic. Her instruments went haywire.\n\nChapter Four: The Legend\n\nBack at the lab, she researched local folklore. The fishermen called it "The Singing Abyss" — a place where the sea speaks to those brave enough to listen.\n\nChapter Five: Descent\n\nShe returned with a team, descending deeper than before. The cave opened into an impossible chamber, illuminated by bioluminescent organisms.\n\nChapter Six: Revelation\n\nWhat they found would rewrite history — evidence of an intelligence far older than any known civilization, preserved in crystal formations deep beneath the waves.`,
  },
];

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detectTitle(text: string) {
  const lines = text.split("\n").slice(0, 15);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 100 && !/chapter|by|author/i.test(trimmed)) return trimmed;
  }
  return "Untitled";
}

function detectAuthor(text: string) {
  const lines = text.split("\n").slice(0, 20);
  for (const line of lines) {
    if (/by|author/i.test(line)) return line.replace(/by|author/i, "").trim();
  }
  return "Author";
}

function formatManuscript(text: string, format: string) {
  const chapterRegex = /(?:^|\n)(?:Chapter|CHAPTER|Ch\.?)\s+([IVX\d]+|[A-Za-z]+)/gi;
  const chapters: { title: string; index: number }[] = [];
  let match;
  while ((match = chapterRegex.exec(text)) !== null) {
    chapters.push({ title: match[0].trim(), index: match.index });
  }
  if (chapters.length === 0) chapters.push({ title: "Chapter 1", index: 0 });

  const title = detectTitle(text);
  const author = detectAuthor(text);
  const year = new Date().getFullYear();

  let html = `<div class="kdp-content">`;
  html += `<h1 style="text-align:center; margin-top:80px; font-size:1.8rem;">${escapeHtml(title)}</h1>`;
  html += `<p style="text-align:center; color:#666;">by ${escapeHtml(author)}</p>`;
  html += `<hr style="margin:2rem 0; border-color:#eee;" />`;
  html += `<h2 style="text-align:center; font-size:1.4rem;">Table of Contents</h2>`;
  html += `<div style="background:#F9FAFC; padding:1.5rem; border-radius:12px; margin:2rem 0;">`;

  for (let i = 0; i < chapters.length; i++) {
    if (format === "ebook") {
      html += `<div style="display:flex; justify-content:space-between; margin:0.5rem 0;"><a href="#ch-${i}" style="color:#1A5F7A; text-decoration:none;">${escapeHtml(chapters[i].title)}</a><span>...</span></div>`;
    } else {
      html += `<div style="display:flex; justify-content:space-between; margin:0.5rem 0;"><span>${escapeHtml(chapters[i].title)}</span><span>${i + 1}</span></div>`;
    }
  }
  html += `</div><hr style="margin:2rem 0; border-color:#eee;" />`;

  for (let i = 0; i < chapters.length; i++) {
    const chap = chapters[i];
    const nextIdx = i + 1 < chapters.length ? chapters[i + 1].index : text.length;
    const chapterText = text.substring(chap.index, nextIdx);
    const paragraphs = chapterText.split(/\n\s*\n/);
    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (!trimmed) continue;
      if (/^(?:Chapter|CHAPTER|Ch\.?)\s+/i.test(trimmed)) {
        html += `<h2 id="ch-${i}" style="margin-top:60px; font-size:1.4rem;">${escapeHtml(trimmed)}</h2>`;
      } else {
        html += `<p style="text-indent:1.5em; margin-bottom:1em; text-align:justify; line-height:1.7;">${escapeHtml(trimmed)}</p>`;
      }
    }
  }

  html += `<div style="text-align:center; margin-top:80px; color:#999;"><p>© ${year} All rights reserved.</p><p>Published by AnyWay Formatter</p></div>`;
  html += `</div>`;
  return html;
}

export default function PdfEngine() {
  const [rawText, setRawText] = useState("");
  const [formattedHTML, setFormattedHTML] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("ebook");
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ msg: string; type: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const docxRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const showAlertMsg = (msg: string, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const loadExample = (key: string) => {
    const ex = exampleBooks.find((b) => b.key === key);
    if (!ex) return;
    setRawText(ex.content);
    setLoadedFile(ex.title);
    setFormattedHTML("");
    setShowPreview(false);
    showAlertMsg(`Loaded "${ex.title}" by ${ex.author}. Click "Format manuscript" to preview.`, "success");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadedFile(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
    showAlertMsg(`Loading ${file.name}...`, "info");

    try {
      const text = await file.text();
      setRawText(text);
      setFormattedHTML("");
      setShowPreview(false);
      showAlertMsg("Successfully loaded. Ready to format.", "success");
    } catch {
      showAlertMsg(`Failed to read ${type.toUpperCase()}. Try a different file.`, "info");
    }
  };

  const processManuscript = () => {
    if (!rawText) {
      showAlertMsg("Please upload a DOCX/PDF or load an example first.", "info");
      return;
    }
    const html = formatManuscript(rawText, selectedFormat);
    setFormattedHTML(html);
    setShowPreview(true);
    showAlertMsg(
      `Formatted as ${selectedFormat === "ebook" ? "eBook (with hyperlinks)" : "Paperback (no links)"}. Ready for preview.`,
      "success"
    );
  };

  const downloadPDF = () => {
    if (!formattedHTML) {
      showAlertMsg("Please format a manuscript first.", "info");
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>KDP Formatted Manuscript</title>
      <style>body{font-family:'Georgia',serif;margin:0;padding:40px;line-height:1.6;max-width:800px;margin:0 auto}
      .kdp-content{width:100%}h1,h2{text-align:center}p{text-indent:1.5em;margin-bottom:1em}
      @media print{body{margin:0;padding:0}h1,h2{page-break-after:avoid}}</style>
      </head><body>${formattedHTML}<script>window.onload=()=>{window.print();setTimeout(()=>window.close(),1500)}<\/script></body></html>`);
    printWindow.document.close();
  };

  return (
    <div>
      {/* Alert */}
      {alert && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl mb-5 text-sm font-medium ${
          alert.type === "success"
            ? "bg-emerald/10 border-l-[3px] border-l-emerald text-emerald"
            : "bg-primary/[0.08] border-l-[3px] border-l-primary text-primary"
        }`}>
          {alert.type === "success" ? <CheckCircle size={16} /> : <Info size={16} />}
          {alert.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">AnyWay Formatter — KDP Manuscript Studio</h2>
        <p className="text-sm text-muted mt-2 leading-relaxed max-w-2xl">
          Upload DOCX or PDF, choose eBook (with hyperlinks) or Paperback (print-ready), and get a perfectly formatted, rejection-proof file. All processing stays in your browser.
        </p>
      </div>

      {/* Example Books */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm font-bold text-muted mb-4">
          <BookOpen size={15} className="text-primary" />
          Completed examples — load &amp; format instantly
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exampleBooks.map((book) => (
            <div
              key={book.key}
              onClick={() => loadExample(book.key)}
              className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 cursor-pointer transition-all hover:border-primary/30 hover:-translate-y-0.5"
            >
              <div className="font-bold text-base text-foreground mb-1">{book.title}</div>
              <div className="text-xs text-muted mb-3">{book.author}</div>
              <div className="flex items-center gap-3 text-xs text-muted mb-4">
                <span>{book.genre}</span>
                <span>{book.rating}</span>
              </div>
              <button className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground w-full">
                Load this book →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          onClick={() => docxRef.current?.click()}
          className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-primary/30 hover:-translate-y-0.5"
        >
          <FileText size={40} className="text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Upload DOCX</h3>
          <p className="text-sm text-muted mb-5">Microsoft Word document — best for text extraction</p>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold">Choose file</span>
          <input ref={docxRef} type="file" accept=".docx,.doc,.txt" className="hidden" onChange={(e) => handleFileUpload(e, "docx")} />
        </div>
        <div
          onClick={() => pdfRef.current?.click()}
          className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-primary/30 hover:-translate-y-0.5"
        >
          <FileText size={40} className="text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Upload PDF</h3>
          <p className="text-sm text-muted mb-5">Existing PDF — will be reformatted to KDP standard</p>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold">Choose file</span>
          <input ref={pdfRef} type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => handleFileUpload(e, "pdf")} />
        </div>
      </div>

      {/* Loaded File Info */}
      {loadedFile && (
        <div className="flex items-center gap-2 bg-emerald/10 text-emerald px-4 py-2.5 rounded-xl text-sm font-semibold mb-6">
          <CheckCircle size={15} /> {loadedFile}
        </div>
      )}

      {/* Format Options */}
      <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mb-8">
        <div className="text-sm font-bold text-foreground mb-4">Output format</div>
        <div className="flex gap-4 flex-wrap">
          <label
            onClick={() => setSelectedFormat("ebook")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
              selectedFormat === "ebook"
                ? "border-primary bg-primary/[0.08]"
                : "border-[rgba(255,255,255,0.06)] hover:border-primary/20"
            }`}
          >
            <input type="radio" name="format" value="ebook" checked={selectedFormat === "ebook"} onChange={() => setSelectedFormat("ebook")} className="accent-[hsl(186,100%,50%)] w-4 h-4" />
            <div>
              <div className="font-semibold text-sm text-foreground">eBook (Kindle)</div>
              <div className="text-[0.7rem] text-muted">Active hyperlinks in TOC</div>
            </div>
          </label>
          <label
            onClick={() => setSelectedFormat("paperback")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
              selectedFormat === "paperback"
                ? "border-primary bg-primary/[0.08]"
                : "border-[rgba(255,255,255,0.06)] hover:border-primary/20"
            }`}
          >
            <input type="radio" name="format" value="paperback" checked={selectedFormat === "paperback"} onChange={() => setSelectedFormat("paperback")} className="accent-[hsl(186,100%,50%)] w-4 h-4" />
            <div>
              <div className="font-semibold text-sm text-foreground">Paperback / Hardcover</div>
              <div className="text-[0.7rem] text-muted">No hyperlinks, proper gutters</div>
            </div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={processManuscript}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-extrabold text-sm transition-all hover:brightness-110 hover:shadow-[0_8px_24px_rgba(0,229,255,0.3)] hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Sparkles size={16} /> Format manuscript
        </button>
        {showPreview && (
          <button
            onClick={downloadPDF}
            className="bg-transparent border border-[rgba(255,255,255,0.06)] text-muted px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center gap-2"
          >
            <Download size={16} /> Download PDF (print ready)
          </button>
        )}
      </div>

      {/* Preview */}
      {showPreview && formattedHTML && (
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(255,255,255,0.06)]" style={{ background: "hsl(222 50% 6%)" }}>
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Eye size={16} /> Live preview — KDP style
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedFormat("ebook");
                  setFormattedHTML(formatManuscript(rawText, "ebook"));
                }}
                className="bg-transparent border border-[rgba(255,255,255,0.06)] text-muted px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center gap-1"
              >
                <Book size={12} /> eBook view
              </button>
              <button
                onClick={() => {
                  setSelectedFormat("paperback");
                  setFormattedHTML(formatManuscript(rawText, "paperback"));
                }}
                className="bg-transparent border border-[rgba(255,255,255,0.06)] text-muted px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center gap-1"
              >
                <BookOpen size={12} /> Paperback view
              </button>
            </div>
          </div>
          <div
            className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar"
            style={{ background: "#FFFFFF", color: "#1A2C3E", fontFamily: "'Georgia', serif" }}
            dangerouslySetInnerHTML={{ __html: formattedHTML }}
          />
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center mt-12 pt-6 border-t border-[rgba(255,255,255,0.06)] text-[0.7rem] text-muted flex items-center justify-center gap-2">
        <ShieldCheck size={13} /> All processing happens in your browser. No files are uploaded — your data stays private.
      </div>
    </div>
  );
}