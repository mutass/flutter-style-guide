import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText, Upload, Download, Eye, BookOpen, Hash, Type, ChevronRight,
  X, Loader2
} from "lucide-react";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";

// ── Constants ──────────────────────────────────────────────
const HEADING_RE = /^(chapter|part|prologue|epilogue|introduction|foreword|preface|conclusion|appendix)\s*[\d\w:—\-]*/i;
const ALLCAPS_RE = /^[A-Z][A-Z\s\d:—\-]{3,59}$/;

const PAGE_SIZES: Record<string, [number, number]> = {
  "6x9": [432, 648],
  "5.5x8.5": [396, 612],
  "5x8": [360, 576],
  "8.5x11": [612, 792],
  A4: [595.28, 841.89],
};

const GUTTER_MAP: Record<string, number> = {
  "150": 45,
  "400": 54,
  "600": 63,
};

const SAMPLE_BOOK = `The Art of Self-Publishing
By Jane Doe

PROLOGUE

The journey of a thousand books begins with a single word. In this guide, we will explore the fascinating world of self-publishing on Amazon's Kindle Direct Publishing platform. Whether you are a first-time author or a seasoned writer looking to take control of your publishing destiny, this book will provide you with the tools and knowledge you need to succeed.

Self-publishing has revolutionized the way authors reach their readers. No longer do you need to wait for a traditional publisher to discover your manuscript. With KDP, you can publish your book and reach millions of readers worldwide within hours.

CHAPTER 1: GETTING STARTED

Every successful author starts somewhere. The first step is understanding the KDP ecosystem and how it works. Amazon provides authors with a powerful platform that handles everything from distribution to payments.

Before you begin writing, consider your target audience. Who are they? What problems do they face? What solutions can you offer? Understanding your reader is the foundation of a successful book.

The writing process itself is deeply personal. Some authors prefer to outline extensively before writing a single word, while others dive straight into the first draft. There is no wrong approach — only the approach that works best for you.

CHAPTER 2: FORMATTING YOUR MANUSCRIPT

This is where most authors struggle. Amazon has strict formatting requirements that must be met for your book to be accepted. The most common issues include incorrect margins, missing table of contents hyperlinks, and improper page numbering.

For eBooks, the table of contents must contain clickable hyperlinks that navigate to each chapter. This is not optional — Amazon will reject your manuscript without them. The hyperlinks must work correctly on all Kindle devices and apps.

For paperbacks, the margins must account for the gutter — the space where pages are bound together. Without proper gutter margins, text near the spine will be unreadable. The gutter size depends on your page count.

CHAPTER 3: COVER DESIGN

Your book cover is the single most important marketing tool you have. Readers absolutely do judge books by their covers. A professional cover design can mean the difference between a bestseller and a book that never sells.

When designing your cover, consider the genre expectations. Romance readers expect certain visual cues that differ from thriller readers or non-fiction readers. Study the bestselling covers in your genre and note the common elements.

Color psychology plays a significant role in cover design. Warm colors like red and orange convey energy and passion, while cool colors like blue and green suggest calm and trust. Choose colors that align with your book's tone and genre.

CHAPTER 4: MARKETING AND LAUNCH

Publishing your book is only half the battle. Without a solid marketing plan, even the best book will struggle to find readers. Start building your author platform months before your launch date.

Social media is a powerful tool for connecting with potential readers. Choose two or three platforms where your target audience spends time and focus your efforts there. Consistency is more important than trying to be everywhere at once.

Email marketing remains one of the most effective ways to sell books. Build an email list of interested readers and nurture that relationship with valuable content. When launch day arrives, you will have an eager audience ready to buy.

CHAPTER 5: LONG-TERM SUCCESS

The most successful self-published authors treat their writing as a business. They plan series, build backlists, and continuously improve their craft. One book is rarely enough — most successful indie authors have multiple titles.

Track your sales data and use it to inform your decisions. Which books sell best? Which marketing channels drive the most sales? Data-driven decisions will help you grow your author business over time.

Never stop learning. The publishing industry is constantly evolving, and the strategies that work today may not work tomorrow. Stay connected with other authors, attend conferences, and keep experimenting with new approaches.

EPILOGUE

The path of self-publishing is not always easy, but it is incredibly rewarding. You have the power to share your stories with the world, build a sustainable income, and create a legacy that outlasts you. The only question is: are you ready to begin?`;

// ── Helpers ──────────────────────────────────────────────
interface Chapter {
  title: string;
  body: string;
  pageNum?: number;
}

function detectChapters(text: string): Chapter[] {
  const lines = text.split("\n");
  const chapters: Chapter[] = [];
  let currentTitle = "";
  let currentBody = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      currentBody += "\n";
      continue;
    }
    if (HEADING_RE.test(trimmed) || (ALLCAPS_RE.test(trimmed) && trimmed.length >= 4 && trimmed.length <= 60)) {
      if (currentTitle) {
        chapters.push({ title: currentTitle, body: currentBody.trim() });
      }
      currentTitle = trimmed;
      currentBody = "";
    } else {
      currentBody += trimmed + "\n";
    }
  }
  if (currentTitle) chapters.push({ title: currentTitle, body: currentBody.trim() });
  return chapters;
}

function extractTitleAuthor(text: string): { bookTitle: string; author: string } {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const bookTitle = lines[0] || "Untitled Book";
  let author = "Unknown Author";
  for (let i = 1; i < Math.min(lines.length, 5); i++) {
    if (/^by\s+/i.test(lines[i])) {
      author = lines[i].replace(/^by\s+/i, "");
      break;
    }
  }
  return { bookTitle, author };
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[];
}

// ── Component ────────────────────────────────────────────
const PdfEngine = () => {
  const [mode, setMode] = useState<"ebook" | "paperback">("ebook");
  const [manuscript, setManuscript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // eBook settings
  const [ebookPageSize, setEbookPageSize] = useState("6x9");
  const [ebookFontSize, setEbookFontSize] = useState("11");
  const [ebookTocLinks, setEbookTocLinks] = useState(true);
  const [ebookColorHeadings, setEbookColorHeadings] = useState(true);

  // Paperback settings
  const [pbTrimSize, setPbTrimSize] = useState("6x9");
  const [pbPageCount, setPbPageCount] = useState("400");
  const [pbFontSize, setPbFontSize] = useState("11");
  const [pbRunningHeaders, setPbRunningHeaders] = useState(true);
  const [pbOddChapters, setPbOddChapters] = useState(true);

  const chapters = useMemo(() => detectChapters(manuscript), [manuscript]);
  const { bookTitle, author } = useMemo(() => extractTitleAuthor(manuscript), [manuscript]);
  const wc = useMemo(() => wordCount(manuscript), [manuscript]);

  // ── File handling ──
  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".docx")) {
      toast.error("Please upload a .docx file");
      return;
    }
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setManuscript(result.value);
      toast.success(`Loaded ${file.name} — ${wordCount(result.value).toLocaleString()} words`);
    } catch {
      toast.error("Failed to read .docx file");
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // ── Margin specs ──
  const getMarginSpecs = () => {
    if (mode === "ebook") {
      return { top: 36, bottom: 36, left: 36, right: 36, label: "0.5in all sides" };
    }
    const gutter = GUTTER_MAP[pbPageCount] || 54;
    return {
      top: 54, bottom: 54,
      left: gutter, right: 36,
      gutterPt: gutter,
      label: `Top/Bottom: 0.75in · Gutter: ${(gutter / 72).toFixed(3)}in · Outer: 0.5in`,
    };
  };

  // ── Preview Structure ──
  const handlePreview = () => {
    if (!manuscript.trim()) { toast.error("No manuscript text"); return; }
    if (chapters.length === 0) { toast.error("No chapters detected"); return; }

    const pages: string[] = [];
    if (mode === "ebook") {
      pages.push("1 — Title Page");
      pages.push("2 — Copyright Page");
      pages.push("3 — Table of Contents (clickable links)");
      chapters.forEach((ch, i) => pages.push(`${i + 4} — ${ch.title} (est.)`));
    } else {
      pages.push("1 — Title Page (recto)");
      pages.push("2 — Blank (verso)");
      pages.push("3 — Copyright Page (recto)");
      pages.push("4 — Table of Contents (verso)");
      let pg = 5;
      chapters.forEach((ch) => {
        if (pbOddChapters && pg % 2 === 0) {
          pages.push(`${pg} — Blank (force odd start)`);
          pg++;
        }
        pages.push(`${pg} — ${ch.title}`);
        pg++;
      });
    }
    setPreviewPages(pages);
    setShowPreview(true);
  };

  // ── Generate eBook PDF ──
  const generateEbook = () => {
    const [pageW, pageH] = PAGE_SIZES[ebookPageSize] || PAGE_SIZES["6x9"];
    const fontSize = parseInt(ebookFontSize);
    const margin = 36;
    const contentW = pageW - margin * 2;
    const lineHeight = fontSize * 1.5;

    const doc = new jsPDF({ unit: "pt", format: [pageW, pageH] });

    // ── Title page ──
    doc.setFillColor(20, 20, 35);
    doc.rect(0, 0, pageW, pageH, "F");
    doc.setTextColor(0, 229, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    const titleLines = wrapText(doc, bookTitle, contentW);
    let ty = pageH / 2 - titleLines.length * 18;
    titleLines.forEach((line) => {
      doc.text(line, pageW / 2, ty, { align: "center" });
      ty += 36;
    });
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(author, pageW / 2, ty + 20, { align: "center" });

    // ── Copyright page ──
    doc.addPage([pageW, pageH]);
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(9);
    const copyrightLines = [
      `© ${new Date().getFullYear()} ${author}. All rights reserved.`,
      "",
      "No part of this publication may be reproduced, distributed, or transmitted",
      "in any form or by any means without the prior written permission of the author.",
      "",
      `Published via KDP Unlocked Formatter`,
    ];
    let cy = pageH / 2 - 40;
    copyrightLines.forEach((l) => {
      doc.text(l, pageW / 2, cy, { align: "center" });
      cy += 14;
    });

    // ── TOC page (placeholder, will backfill) ──
    doc.addPage([pageW, pageH]);
    const tocPageNum = 3;

    // ── Chapter pages ──
    const chapterPageNums: number[] = [];

    chapters.forEach((ch) => {
      doc.addPage([pageW, pageH]);
      chapterPageNums.push(doc.getNumberOfPages());

      let y = margin + 30;

      // Chapter heading
      if (ebookColorHeadings) {
        doc.setTextColor(0, 229, 255);
      } else {
        doc.setTextColor(30, 30, 30);
      }
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(ch.title, margin, y);
      y += 36;

      // Body text
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "normal");

      const paragraphs = ch.body.split("\n\n").filter(Boolean);
      for (const para of paragraphs) {
        const lines = wrapText(doc, para.replace(/\n/g, " ").trim(), contentW);
        for (const line of lines) {
          if (y + lineHeight > pageH - margin) {
            doc.addPage([pageW, pageH]);
            // Page number
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text(String(doc.getNumberOfPages()), pageW / 2, pageH - 20, { align: "center" });
            doc.setFontSize(fontSize);
            doc.setTextColor(30, 30, 30);
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        }
        y += lineHeight * 0.5;
      }

      // Page number at bottom
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(String(doc.getNumberOfPages()), pageW / 2, pageH - 20, { align: "center" });
    });

    // ── Backfill TOC ──
    doc.setPage(tocPageNum);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Table of Contents", margin, margin + 30);

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    let tocY = margin + 60;

    chapters.forEach((ch, i) => {
      const pageNum = chapterPageNums[i];
      const titleText = ch.title;
      const pageStr = String(pageNum);

      const titleW = doc.getTextWidth(titleText);
      const pageW2 = doc.getTextWidth(pageStr);
      const dotsSpace = contentW - titleW - pageW2 - 10;
      const dotW = doc.getTextWidth(".");
      const dotCount = Math.max(0, Math.floor(dotsSpace / dotW));
      const dots = ".".repeat(dotCount);

      doc.setTextColor(30, 30, 30);
      doc.text(titleText, margin, tocY);
      doc.setTextColor(150, 150, 150);
      doc.text(dots, margin + titleW + 4, tocY);
      doc.setTextColor(30, 30, 30);
      doc.text(pageStr, margin + contentW - pageW2, tocY);

      if (ebookTocLinks) {
        doc.link(margin, tocY - fontSize, contentW, fontSize + 4, { pageNumber: pageNum });
      }

      tocY += lineHeight * 1.4;
    });

    const totalPages = doc.getNumberOfPages();
    const filename = `${bookTitle.replace(/\s+/g, "_").toLowerCase()}_ebook_kdp.pdf`;
    doc.save(filename);
    toast.success(`PDF saved — ${chapters.length} chapters, ${totalPages} pages`);
  };

  // ── Generate Paperback PDF ──
  const generatePaperback = () => {
    const [pageW, pageH] = PAGE_SIZES[pbTrimSize] || PAGE_SIZES["6x9"];
    const fontSize = parseInt(pbFontSize);
    const gutter = GUTTER_MAP[pbPageCount] || 54;
    const outerMargin = 36;
    const topMargin = 54;
    const bottomMargin = 54;
    const lineHeight = fontSize * 1.5;
    const headerHeight = pbRunningHeaders ? 24 : 0;

    const getMargins = (pageNum: number) => {
      const isRecto = pageNum % 2 === 1;
      return {
        left: isRecto ? gutter : outerMargin,
        right: isRecto ? outerMargin : gutter,
      };
    };

    const doc = new jsPDF({ unit: "pt", format: [pageW, pageH] });

    const addPageNum = (pageNum: number) => {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      const m = getMargins(pageNum);
      if (pageNum % 2 === 0) {
        doc.text(String(pageNum), m.left, pageH - 30);
      } else {
        doc.text(String(pageNum), pageW - m.right, pageH - 30, { align: "right" });
      }
    };

    const addHeader = (pageNum: number, chapterTitle: string) => {
      if (!pbRunningHeaders) return;
      const m = getMargins(pageNum);
      doc.setFontSize(7);
      doc.setTextColor(130, 130, 130);
      doc.setFont("helvetica", "italic");
      if (pageNum % 2 === 0) {
        doc.text(bookTitle, m.left, topMargin - 10);
      } else {
        doc.text(chapterTitle, pageW - m.right, topMargin - 10, { align: "right" });
      }
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(m.left, topMargin - 4, pageW - m.right, topMargin - 4);
    };

    let currentPage = 1;

    // ── Page 1: Title (recto) ──
    doc.setFillColor(20, 20, 35);
    doc.rect(0, 0, pageW, pageH, "F");
    doc.setTextColor(0, 229, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    const contentW = pageW - gutter - outerMargin;
    const titleLines = wrapText(doc, bookTitle, contentW);
    let ty2 = pageH / 2 - titleLines.length * 18;
    titleLines.forEach((line) => {
      doc.text(line, pageW / 2, ty2, { align: "center" });
      ty2 += 34;
    });
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text(author, pageW / 2, ty2 + 20, { align: "center" });
    currentPage++;

    // ── Page 2: Blank (verso) ──
    doc.addPage([pageW, pageH]);
    currentPage++;

    // ── Page 3: Copyright (recto) ──
    doc.addPage([pageW, pageH]);
    const m3 = getMargins(currentPage);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const copLines = [
      `© ${new Date().getFullYear()} ${author}. All rights reserved.`,
      "",
      "No part of this publication may be reproduced, distributed,",
      "or transmitted in any form without prior written permission.",
      "",
      "Published via KDP Unlocked Formatter",
    ];
    let cy2 = pageH / 2 - 30;
    copLines.forEach((l) => {
      doc.text(l, pageW / 2, cy2, { align: "center" });
      cy2 += 13;
    });
    addPageNum(currentPage);
    currentPage++;

    // ── Page 4: TOC (verso) ──
    doc.addPage([pageW, pageH]);
    const tocPage = currentPage;
    currentPage++;

    // ── Chapters ──
    const chapterPageNums: number[] = [];
    let activeChapterTitle = "";

    chapters.forEach((ch) => {
      if (pbOddChapters && currentPage % 2 === 0) {
        doc.addPage([pageW, pageH]);
        addPageNum(currentPage);
        currentPage++;
      }

      doc.addPage([pageW, pageH]);
      chapterPageNums.push(currentPage);
      activeChapterTitle = ch.title;

      const m = getMargins(currentPage);
      const cw = pageW - m.left - m.right;
      let y = topMargin + headerHeight + 20;

      doc.setTextColor(30, 30, 30);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(ch.title, m.left, y);
      y += 36;

      doc.setTextColor(30, 30, 30);
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "normal");

      const paragraphs = ch.body.split("\n\n").filter(Boolean);
      for (const para of paragraphs) {
        const lines = wrapText(doc, para.replace(/\n/g, " ").trim(), cw);
        for (const line of lines) {
          if (y + lineHeight > pageH - bottomMargin) {
            addPageNum(currentPage);
            addHeader(currentPage, activeChapterTitle);
            doc.addPage([pageW, pageH]);
            currentPage++;
            const nm = getMargins(currentPage);
            y = topMargin + headerHeight + 4;
            doc.setFontSize(fontSize);
            doc.setTextColor(30, 30, 30);
            doc.setFont("helvetica", "normal");
            doc.text(line, nm.left, y);
            y += lineHeight;
            continue;
          }
          doc.text(line, m.left, y);
          y += lineHeight;
        }
        y += lineHeight * 0.4;
      }

      addPageNum(currentPage);
      addHeader(currentPage, activeChapterTitle);
      currentPage++;
    });

    // ── Backfill TOC ──
    doc.setPage(tocPage);
    const m4 = getMargins(tocPage);
    const tocCW = pageW - m4.left - m4.right;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Table of Contents", m4.left, topMargin + headerHeight + 20);

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    let tocY2 = topMargin + headerHeight + 54;

    chapters.forEach((ch, i) => {
      const pageStr = String(chapterPageNums[i]);
      const tw = doc.getTextWidth(ch.title);
      const pw = doc.getTextWidth(pageStr);
      const dotsSpace = tocCW - tw - pw - 10;
      const dotW = doc.getTextWidth(".");
      const dots = ".".repeat(Math.max(0, Math.floor(dotsSpace / dotW)));

      doc.setTextColor(30, 30, 30);
      doc.text(ch.title, m4.left, tocY2);
      doc.setTextColor(150, 150, 150);
      doc.text(dots, m4.left + tw + 4, tocY2);
      doc.setTextColor(30, 30, 30);
      doc.text(pageStr, m4.left + tocCW - pw, tocY2);
      tocY2 += lineHeight * 1.4;
    });
    addPageNum(tocPage);

    const totalPages = doc.getNumberOfPages();
    const filename = `${bookTitle.replace(/\s+/g, "_").toLowerCase()}_paperback_kdp.pdf`;
    doc.save(filename);
    toast.success(`PDF saved — ${chapters.length} chapters, ${totalPages} pages`);
  };

  // ── Generate handler ──
  const handleGenerate = async () => {
    if (!manuscript.trim()) { toast.error("Paste or upload a manuscript first"); return; }
    if (chapters.length === 0) { toast.error("No chapters detected — add chapter headings"); return; }
    setGenerating(true);
    setProgress(10);

    try {
      await new Promise((r) => setTimeout(r, 200));
      setProgress(40);
      if (mode === "ebook") generateEbook();
      else generatePaperback();
      setProgress(100);
    } catch (err) {
      toast.error("PDF generation failed");
      console.error(err);
    } finally {
      setTimeout(() => { setGenerating(false); setProgress(0); }, 600);
    }
  };

  const marginSpecs = getMarginSpecs();

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="w-[280px] flex-shrink-0 border-r border-border flex flex-col overflow-y-auto custom-scrollbar bg-card/50 p-4">
        {/* Mode tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "ebook" | "paperback")} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ebook" className="text-xs font-semibold">eBook PDF</TabsTrigger>
            <TabsTrigger value="paperback" className="text-xs font-semibold">Paperback PDF</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-background rounded-lg border border-border p-2.5 text-center">
            <div className="text-xs text-muted-foreground">Words</div>
            <div className="text-lg font-bold text-foreground">{wc.toLocaleString()}</div>
          </div>
          <div className="flex-1 bg-background rounded-lg border border-border p-2.5 text-center">
            <div className="text-xs text-muted-foreground">Chapters</div>
            <div className="text-lg font-bold text-foreground">{chapters.length}</div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3 mb-4">
          <div className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">Settings</div>

          {mode === "ebook" ? (
            <>
              <div>
                <Label className="text-xs mb-1 block">Page Size</Label>
                <Select value={ebookPageSize} onValueChange={setEbookPageSize}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6x9">6 × 9 in</SelectItem>
                    <SelectItem value="8.5x11">8.5 × 11 in</SelectItem>
                    <SelectItem value="A4">A4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Font Size</Label>
                <Select value={ebookFontSize} onValueChange={setEbookFontSize}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10pt</SelectItem>
                    <SelectItem value="11">11pt</SelectItem>
                    <SelectItem value="12">12pt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Clickable TOC Links</Label>
                <Switch checked={ebookTocLinks} onCheckedChange={setEbookTocLinks} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Colored Headings</Label>
                <Switch checked={ebookColorHeadings} onCheckedChange={setEbookColorHeadings} />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-xs mb-1 block">Trim Size</Label>
                <Select value={pbTrimSize} onValueChange={setPbTrimSize}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6x9">6 × 9 in</SelectItem>
                    <SelectItem value="5.5x8.5">5.5 × 8.5 in</SelectItem>
                    <SelectItem value="5x8">5 × 8 in</SelectItem>
                    <SelectItem value="8.5x11">8.5 × 11 in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Est. Page Count (gutter)</Label>
                <Select value={pbPageCount} onValueChange={setPbPageCount}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">Up to 150 (0.625in)</SelectItem>
                    <SelectItem value="400">151–400 (0.75in)</SelectItem>
                    <SelectItem value="600">401–600 (0.875in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Font Size</Label>
                <Select value={pbFontSize} onValueChange={setPbFontSize}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10pt</SelectItem>
                    <SelectItem value="11">11pt</SelectItem>
                    <SelectItem value="12">12pt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Running Headers</Label>
                <Switch checked={pbRunningHeaders} onCheckedChange={setPbRunningHeaders} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Chapters on Odd Pages</Label>
                <Switch checked={pbOddChapters} onCheckedChange={setPbOddChapters} />
              </div>
            </>
          )}
        </div>

        {/* Detected Chapters */}
        <div className="mb-4">
          <div className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Detected Chapters ({chapters.length})
          </div>
          <div className="space-y-1 max-h-[180px] overflow-y-auto custom-scrollbar">
            {chapters.length === 0 && (
              <div className="text-xs text-muted-foreground italic px-1">No chapters detected yet</div>
            )}
            {chapters.map((ch, i) => (
              <div key={i} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-md bg-background border border-border">
                <Badge variant="secondary" className="text-[0.6rem] h-5 w-5 flex items-center justify-center p-0 flex-shrink-0">
                  {i + 1}
                </Badge>
                <span className="text-foreground truncate">{ch.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KDP Spec Box */}
        <Card className="p-3 mb-4 bg-primary/5 border-primary/20">
          <div className="text-[0.6rem] font-bold uppercase tracking-widest text-primary mb-1">KDP Margins</div>
          <div className="text-[0.7rem] text-muted-foreground leading-relaxed">{marginSpecs.label}</div>
          {mode === "paperback" && (
            <div className="text-[0.65rem] text-muted-foreground mt-1">
              Recto: gutter left · Verso: gutter right
            </div>
          )}
        </Card>

        {/* Progress */}
        {generating && (
          <div className="mb-3">
            <Progress value={progress} className="h-2" />
            <div className="text-[0.65rem] text-muted-foreground mt-1 text-center">Generating PDF…</div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 mt-auto">
          <Button onClick={handleGenerate} disabled={generating} className="w-full font-semibold text-xs">
            {generating ? <Loader2 className="animate-spin mr-1.5" size={14} /> : <Download size={14} className="mr-1.5" />}
            Generate & Download PDF
          </Button>
          <Button variant="outline" onClick={handlePreview} className="w-full text-xs">
            <Eye size={14} className="mr-1.5" /> Preview Structure
          </Button>
          <Button variant="ghost" onClick={() => setManuscript(SAMPLE_BOOK)} className="w-full text-xs">
            <BookOpen size={14} className="mr-1.5" /> Load Sample Book
          </Button>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`m-4 mb-0 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          <Upload size={28} className="mx-auto mb-2 text-muted-foreground" />
          <div className="text-sm font-medium text-foreground">Drop your .docx here or click to browse</div>
          <div className="text-xs text-muted-foreground mt-1">Uses mammoth.js for clean text extraction</div>
          <input ref={fileRef} type="file" accept=".docx" className="hidden" onChange={onFileInput} />
        </div>

        {/* Textarea */}
        <div className="flex-1 p-4 overflow-hidden">
          <Textarea
            value={manuscript}
            onChange={(e) => setManuscript(e.target.value)}
            placeholder="Paste your manuscript here, or upload a .docx file above…&#10;&#10;The formatter detects chapters from headings like:&#10;CHAPTER 1: Your Title&#10;PROLOGUE&#10;INTRODUCTION&#10;ALL-CAPS LINES (4-60 chars)"
            className="h-full w-full resize-none text-sm font-mono bg-background"
          />
        </div>
      </div>

      {/* ── Preview Modal ── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-8" onClick={() => setShowPreview(false)}>
          <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="font-bold text-foreground">Page Structure Preview</div>
              <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
                <X size={16} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
              {previewPages.map((page, i) => (
                <div key={i} className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-background border border-border">
                  <ChevronRight size={14} className="text-primary flex-shrink-0" />
                  <span className="text-foreground">{page}</span>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border text-center">
              <span className="text-xs text-muted-foreground">Estimated {previewPages.length} pages total</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PdfEngine;
