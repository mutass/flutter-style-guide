import { useState, useRef } from "react";
import {
  FileText,
  BookOpen,
  Sparkles,
  Download,
  Eye,
  Book,
  ShieldCheck,
  Info,
  CheckCircle,
  Upload,
  Loader2,
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
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  const secondLine = text.split("\n")[1]?.trim();
  if (secondLine && secondLine.length < 50 && !/chapter/i.test(secondLine)) return secondLine;
  return "Author";
}

function formatManuscript(text: string, format: string) {
  const chapterRegex = /(?:^|\n)(?:Chapter|CHAPTER|Ch\.?)\s+([IVX\d]+|[A-Za-z]+)/gi;
  const chapters: { title: string; index: number }[] = [];
  let match;
  while ((match = chapterRegex.exec(text)) !== null) {
    chapters.push({ title: match[0].trim(), index: match.index });
  }

  // Also detect "Prologue", "Foreword", "Introduction", "Conclusion", "Epilogue"
  const sectionRegex = /(?:^|\n)(Prologue|Foreword|Introduction|Conclusion|Epilogue)\b/gi;
  while ((match = sectionRegex.exec(text)) !== null) {
    chapters.push({ title: match[1].trim(), index: match.index });
  }
  chapters.sort((a, b) => a.index - b.index);
  if (chapters.length === 0) chapters.push({ title: "Chapter 1", index: 0 });

  const title = detectTitle(text);
  const author = detectAuthor(text);
  const year = new Date().getFullYear();
  const isEbook = format === "ebook";
  const gutterStyle = !isEbook ? "padding: 40px 60px 40px 80px;" : "padding: 40px;";

  let html = `<div class="kdp-content" style="font-family: 'Georgia', serif; max-width: 700px; margin: 0 auto; ${gutterStyle}">`;
  
  // Title page
  html += `<div style="text-align:center; padding: 60px 0 40px;">`;
  html += `<h1 style="font-size:2rem; font-weight:bold; margin-bottom:8px; color:#1A2C3E;">${escapeHtml(title)}</h1>`;
  html += `<p style="font-size:1rem; color:#666; margin-bottom:4px;">by ${escapeHtml(author)}</p>`;
  html += `<div style="width:60px; height:2px; background:#1A5F7A; margin:20px auto;"></div>`;
  html += `</div>`;

  // Copyright
  html += `<div style="text-align:center; color:#999; font-size:0.8rem; margin-bottom:40px;">`;
  html += `<p>© ${year} ${escapeHtml(author)}. All rights reserved.</p>`;
  html += `<p style="margin-top:4px;">Formatted by AnyWay Formatter</p>`;
  html += `</div>`;

  // Table of Contents
  html += `<div style="margin-bottom:40px;">`;
  html += `<h2 style="text-align:center; font-size:1.3rem; color:#1A2C3E; margin-bottom:16px;">Table of Contents</h2>`;
  html += `<div style="background:#F9FAFC; padding:20px; border-radius:10px; border:1px solid #eee;">`;
  for (let i = 0; i < chapters.length; i++) {
    if (isEbook) {
      html += `<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dotted #e0e0e0;"><a href="#ch-${i}" style="color:#1A5F7A; text-decoration:none; font-size:0.95rem;">${escapeHtml(chapters[i].title)}</a><span style="color:#999;">${i + 1}</span></div>`;
    } else {
      html += `<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dotted #e0e0e0;"><span style="font-size:0.95rem;">${escapeHtml(chapters[i].title)}</span><span style="color:#999;">${i + 1}</span></div>`;
    }
  }
  html += `</div></div>`;

  // Chapters
  for (let i = 0; i < chapters.length; i++) {
    const chap = chapters[i];
    const nextIdx = i + 1 < chapters.length ? chapters[i + 1].index : text.length;
    const chapterText = text.substring(chap.index, nextIdx);
    const paragraphs = chapterText.split(/\n\s*\n/);
    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (!trimmed) continue;
      if (/^(?:Chapter|CHAPTER|Ch\.?)\s+/i.test(trimmed) || /^(Prologue|Foreword|Introduction|Conclusion|Epilogue)$/i.test(trimmed)) {
        html += `<h2 id="ch-${i}" style="margin-top:50px; font-size:1.3rem; color:#1A2C3E; border-bottom:1px solid #eee; padding-bottom:8px;">${escapeHtml(trimmed)}</h2>`;
      } else {
        html += `<p style="text-indent:1.5em; margin-bottom:0.9em; text-align:justify; line-height:1.8; font-size:0.95rem; color:#333;">${escapeHtml(trimmed)}</p>`;
      }
    }
  }

  // End matter
  html += `<div style="text-align:center; margin-top:60px; padding-top:20px; border-top:1px solid #eee; color:#999; font-size:0.8rem;">`;
  html += `<p>— END —</p>`;
  html += `<p style="margin-top:8px;">© ${year} ${escapeHtml(author)}. All rights reserved.</p>`;
  html += `</div></div>`;
  return html;
}

export default function PdfEngine() {
  const [rawText, setRawText] = useState("");
  const [formattedHTML, setFormattedHTML] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("ebook");
  const [loadedFile, setLoadedFile] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ msg: string; type: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formatting, setFormatting] = useState(false);
  const docxRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const showAlertMsg = (msg: string, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadExample = (key: string) => {
    const ex = exampleBooks.find((b) => b.key === key);
    if (!ex) return;
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload animation
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setRawText(ex.content);
          setLoadedFile(ex.title);
          setFormattedHTML("");
          setShowPreview(false);
          showAlertMsg(`Loaded "${ex.title}" by ${ex.author}. Click "Format manuscript" to preview.`, "success");
          return 100;
        }
        return prev + 20;
      });
    }, 120);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    setLoadedFile(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + 15;
      });
    }, 100);

    try {
      let text = "";
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
        text = await file.text();
      } else if (fileName.endsWith(".pdf") || fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        // Binary files can't be read as plain text — extract readable content
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        if (fileName.endsWith(".pdf")) {
          // Extract text between stream markers in PDF
          const rawStr = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
          // Pull readable text: lines that have mostly printable characters
          const lines = rawStr.split(/\r?\n/);
          const readable: string[] = [];
          for (const line of lines) {
            const cleaned = line.replace(/[^\x20-\x7E]/g, "").trim();
            if (cleaned.length > 10 && /[a-zA-Z]{3,}/.test(cleaned)) {
              // Remove PDF operators like BT, ET, Tf, Td, Tj etc
              const stripped = cleaned
                .replace(/\b(BT|ET|Tf|Td|Tj|TJ|Tm|cm|re|f|W|n|q|Q|Do|gs|CS|cs|sc|SC|rg|RG)\b/g, "")
                .replace(/[\[\]()]/g, "")
                .replace(/\s{2,}/g, " ")
                .trim();
              if (stripped.length > 5 && /[a-zA-Z]{3,}/.test(stripped)) {
                readable.push(stripped);
              }
            }
          }
          text = readable.join("\n\n");
          if (text.length < 50) {
            clearInterval(interval);
            setUploading(false);
            setUploadProgress(0);
            showAlertMsg("This PDF contains mostly images or encoded text. Please copy-paste your text content directly, or use a .txt file.", "info");
            return;
          }
        } else {
          // DOCX: extract text from XML content inside the zip
          const rawStr = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
          // Extract text between <w:t> tags (Word XML)
          const matches = rawStr.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
          if (matches && matches.length > 0) {
            text = matches.map(m => m.replace(/<[^>]+>/g, "")).join(" ");
            // Try to restore paragraph breaks
            text = text.replace(/\s{3,}/g, "\n\n");
          } else {
            // Fallback: extract any readable text
            const lines = rawStr.split(/\r?\n/);
            const readable = lines
              .map(l => l.replace(/[^\x20-\x7E]/g, "").trim())
              .filter(l => l.length > 10 && /[a-zA-Z]{3,}/.test(l));
            text = readable.join("\n\n");
          }
          if (text.length < 50) {
            clearInterval(interval);
            setUploading(false);
            setUploadProgress(0);
            showAlertMsg("Could not extract text from this DOCX. Please copy-paste your text content directly, or save as .txt first.", "info");
            return;
          }
        }
      } else {
        // Try reading as plain text
        text = await file.text();
      }

      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setRawText(text);
        setFormattedHTML("");
        setShowPreview(false);
        showAlertMsg(`Successfully loaded ${file.name}. Ready to format.`, "success");
      }, 500);
    } catch {
      clearInterval(interval);
      setUploading(false);
      setUploadProgress(0);
      showAlertMsg(`Failed to read ${type.toUpperCase()}. Try a plain text or .txt file.`, "info");
    }
  };

  const processManuscript = () => {
    if (!rawText) {
      showAlertMsg("Please upload a file or load an example first.", "info");
      return;
    }
    setFormatting(true);
    setTimeout(() => {
      const html = formatManuscript(rawText, selectedFormat);
      setFormattedHTML(html);
      setShowPreview(true);
      setFormatting(false);
      showAlertMsg(
        `Formatted as ${selectedFormat === "ebook" ? "eBook (with hyperlinks)" : "Paperback (print-ready gutters)"}. Scroll down to preview.`,
        "success"
      );
    }, 600);
  };

  const downloadPDF = () => {
    if (!formattedHTML) {
      showAlertMsg("Please format a manuscript first.", "info");
      return;
    }
    const title = detectTitle(rawText);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showAlertMsg("Pop-up blocked. Please allow pop-ups and try again.", "info");
      return;
    }
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${escapeHtml(title)} — KDP Formatted</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; margin: 0; padding: 0; line-height: 1.6; color: #333; }
        .kdp-content { max-width: 700px; margin: 0 auto; padding: 40px; }
        h1 { text-align: center; font-size: 2rem; }
        h2 { page-break-after: avoid; margin-top: 50px; }
        p { text-indent: 1.5em; margin-bottom: 0.9em; text-align: justify; line-height: 1.8; }
        @media print {
          body { margin: 0; padding: 0; }
          .kdp-content { padding: 0.75in 1in; max-width: none; }
          h2 { page-break-after: avoid; }
        }
        @page { margin: 0.75in 1in; }
      </style>
    </head><body>${formattedHTML}
    <script>
      window.onload = function() { 
        setTimeout(function() { window.print(); }, 500);
      };
    <\/script></body></html>`);
    printWindow.document.close();
  };

  return (
    <div>
      {/* Alert */}
      {alert && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl mb-5 text-sm font-medium animate-fade-up ${
          alert.type === "success"
            ? "bg-emerald/10 border-l-[3px] border-l-emerald text-emerald"
            : "bg-primary/[0.08] border-l-[3px] border-l-primary text-primary"
        }`}>
          {alert.type === "success" ? <CheckCircle size={16} /> : <Info size={16} />}
          {alert.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">AnyWay Formatter — KDP Manuscript Studio</h2>
        <p className="text-sm text-muted mt-1.5 leading-relaxed max-w-2xl">
          Upload DOCX/PDF or load an example, choose eBook or Paperback format, and get a KDP-compliant manuscript. All processing stays in your browser.
        </p>
      </div>

      {/* Upload Animation Overlay */}
      {uploading && (
        <div className="bg-card border border-primary/20 rounded-2xl p-6 mb-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={18} className="text-primary animate-spin" />
            <span className="text-sm font-semibold text-foreground">Processing file...</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-cyan-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-2">{uploadProgress}% complete</div>
        </div>
      )}

      {/* Example Books */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-muted mb-3">
          <BookOpen size={14} className="text-primary" />
          Load an example — format instantly
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {exampleBooks.map((book) => (
            <div
              key={book.key}
              onClick={() => !uploading && loadExample(book.key)}
              className={`bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-4 cursor-pointer transition-all hover:border-primary/30 hover:-translate-y-0.5 ${uploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="font-bold text-sm text-foreground mb-1">{book.title}</div>
              <div className="text-xs text-muted mb-2">{book.author}</div>
              <div className="flex items-center gap-2 text-xs text-muted mb-3">
                <span>{book.genre}</span>
                <span>{book.rating}</span>
              </div>
              <button className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground w-full">
                Load this book →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => !uploading && docxRef.current?.click()}
          className={`bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-6 text-center cursor-pointer transition-all hover:border-primary/30 hover:-translate-y-0.5 group ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
            <Upload size={24} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Upload DOCX / TXT</h3>
          <p className="text-xs text-muted mb-3">Word document or plain text file</p>
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-xs font-bold inline-block">Choose file</span>
          <input ref={docxRef} type="file" accept=".docx,.doc,.txt" className="hidden" onChange={(e) => handleFileUpload(e, "docx")} />
        </div>
        <div
          onClick={() => !uploading && pdfRef.current?.click()}
          className={`bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-6 text-center cursor-pointer transition-all hover:border-primary/30 hover:-translate-y-0.5 group ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
            <FileText size={24} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Upload PDF</h3>
          <p className="text-xs text-muted mb-3">Reformat to KDP standard</p>
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-xs font-bold inline-block">Choose file</span>
          <input ref={pdfRef} type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => handleFileUpload(e, "pdf")} />
        </div>
      </div>

      {/* Loaded File Info */}
      {loadedFile && !uploading && (
        <div className="flex items-center gap-2 bg-emerald/10 text-emerald px-4 py-2.5 rounded-xl text-sm font-semibold mb-5 animate-fade-up">
          <CheckCircle size={15} /> {loadedFile}
        </div>
      )}

      {/* Format Options */}
      <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-5 mb-6">
        <div className="text-xs font-bold text-foreground mb-3">Output format</div>
        <div className="flex gap-3 flex-wrap">
          {[
            { val: "ebook", label: "eBook (Kindle)", sub: "Active hyperlinks in TOC" },
            { val: "paperback", label: "Paperback / Hardcover", sub: "No hyperlinks, proper gutters" },
          ].map((opt) => (
            <label
              key={opt.val}
              onClick={() => setSelectedFormat(opt.val)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                selectedFormat === opt.val
                  ? "border-primary bg-primary/[0.08]"
                  : "border-[rgba(255,255,255,0.06)] hover:border-primary/20"
              }`}
            >
              <input type="radio" name="format" value={opt.val} checked={selectedFormat === opt.val} onChange={() => setSelectedFormat(opt.val)} className="accent-[hsl(186,100%,50%)] w-4 h-4" />
              <div>
                <div className="font-semibold text-sm text-foreground">{opt.label}</div>
                <div className="text-[0.65rem] text-muted">{opt.sub}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={processManuscript}
          disabled={formatting}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-extrabold text-sm transition-all hover:brightness-110 hover:shadow-[0_8px_24px_rgba(0,229,255,0.3)] hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-60"
        >
          {formatting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {formatting ? "Formatting..." : "Format manuscript"}
        </button>
        {showPreview && (
          <button
            onClick={downloadPDF}
            className="bg-transparent border border-[rgba(255,255,255,0.06)] text-muted px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center gap-2"
          >
            <Download size={16} /> Download PDF
          </button>
        )}
      </div>

      {/* Preview */}
      {showPreview && formattedHTML && (
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden animate-fade-up">
          <div className="flex justify-between items-center px-5 py-3 border-b border-[rgba(255,255,255,0.06)]" style={{ background: "hsl(222 50% 6%)" }}>
            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
              <Eye size={15} /> Live preview — KDP style
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setSelectedFormat("ebook"); setFormattedHTML(formatManuscript(rawText, "ebook")); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  selectedFormat === "ebook" ? "bg-primary/10 text-primary border border-primary/30" : "bg-transparent border border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground"
                }`}
              >
                <Book size={12} /> eBook
              </button>
              <button
                onClick={() => { setSelectedFormat("paperback"); setFormattedHTML(formatManuscript(rawText, "paperback")); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  selectedFormat === "paperback" ? "bg-primary/10 text-primary border border-primary/30" : "bg-transparent border border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground"
                }`}
              >
                <BookOpen size={12} /> Paperback
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

      {/* Footer */}
      <div className="text-center mt-10 pt-5 border-t border-[rgba(255,255,255,0.06)] text-[0.7rem] text-muted flex items-center justify-center gap-2">
        <ShieldCheck size={13} /> All processing happens in your browser. No files are uploaded — your data stays private.
      </div>
    </div>
  );
}
