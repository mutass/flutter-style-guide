import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { CheckCircle2, Circle, Printer, Info } from "lucide-react";

interface CheckItem {
  id: string;
  title: string;
  tip: string;
}

const EBOOK_ITEMS: CheckItem[] = [
  { id: "eb1", title: "Manuscript formatted and exported as PDF", tip: "Use the AnyWay Formatter to ensure your manuscript meets KDP formatting requirements." },
  { id: "eb2", title: "Table of Contents has clickable internal links", tip: "Amazon requires clickable TOC for eBooks. The AnyWay Formatter eBook mode creates these automatically." },
  { id: "eb3", title: "Cover image is JPG, min 1000px on shortest side, 1:1.6 ratio", tip: "Recommended dimensions: 2560 × 1600px. Use the Cover Checker tool to validate." },
  { id: "eb4", title: "Book title on cover matches KDP title field exactly", tip: "Any mismatch between cover text and metadata can delay publishing or trigger a review." },
  { id: "eb5", title: "Copyright page includes year and author name", tip: "Standard format: © 2024 Author Name. All rights reserved." },
  { id: "eb6", title: "Front matter does not exceed 10% of total content", tip: "KDP enforces this rule. Front matter includes title page, copyright, dedication, and TOC." },
  { id: "eb7", title: "All fonts embedded in PDF", tip: "Unembedded fonts may render incorrectly on Kindle devices. The AnyWay Formatter embeds fonts automatically." },
  { id: "eb8", title: "No crop marks or bleeds on eBook PDF", tip: "Crop marks are for print only. eBook PDFs should have clean edges with no printer marks." },
  { id: "eb9", title: "Price set between $2.99–$9.99 for 70% royalty", tip: "Below $2.99 or above $9.99 drops you to the 35% royalty tier." },
  { id: "eb10", title: "7 backend keywords entered (none repeating title words)", tip: "Amazon already indexes your title. Use the Keyword Finder to discover optimal keyword phrases." },
];

const PAPERBACK_ITEMS: CheckItem[] = [
  { id: "pb1", title: "PDF exported at correct trim size", tip: "Common sizes: 6×9, 5.5×8.5, 5×8. The PDF page dimensions must match exactly." },
  { id: "pb2", title: "Gutter margin applied and mirrored", tip: "Recto pages: gutter on left. Verso pages: gutter on right. Use AnyWay Formatter Paperback mode." },
  { id: "pb3", title: "All pages including blanks total an even number", tip: "Printing requires even page counts. Add a blank page at the end if needed." },
  { id: "pb4", title: "Cover PDF is separate from interior PDF", tip: "KDP requires two separate files: one for the interior and one for the cover." },
  { id: "pb5", title: "Cover includes barcode placeholder area (back cover, bottom right)", tip: "KDP places an ISBN barcode in this area. Leave at least 2×1.2 inches clear." },
  { id: "pb6", title: "Spine width matches KDP spine calculator", tip: "Use the Spine Width Calculator to get the exact measurement for your page count and paper type." },
  { id: "pb7", title: "Fonts embedded, no transparency issues", tip: "PDF/X-1a format is recommended. Transparency can cause printing artifacts." },
  { id: "pb8", title: "Images are 300 DPI minimum", tip: "Lower resolution images will appear blurry in print. Check all images before submission." },
  { id: "pb9", title: "No content within 0.125in of trim edge (bleed safety zone)", tip: "Content in the bleed zone may be cut off during trimming. Keep all text and important images inside." },
  { id: "pb10", title: "Preview approved in KDP previewer before submitting", tip: "Always check the KDP online previewer. It shows exactly how your book will look in print." },
];

const LS_KEY = "kdp-upload-checklist";

function loadState(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
}

const UploadChecklist = () => {
  const [mode, setMode] = useState<"ebook" | "paperback">("ebook");
  const [checked, setChecked] = useState<Record<string, boolean>>(loadState);

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(checked)); }, [checked]);

  const items = mode === "ebook" ? EBOOK_ITEMS : PAPERBACK_ITEMS;
  const doneCount = items.filter((it) => checked[it.id]).length;
  const pct = Math.round((doneCount / items.length) * 100);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    const content = items.map((it, i) => `${checked[it.id] ? "✓" : "☐"} ${i + 1}. ${it.title}`).join("\n");
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<pre style="font-family: sans-serif; font-size: 14px; line-height: 2;">${mode.toUpperCase()} UPLOAD CHECKLIST\n${"=".repeat(40)}\n\n${content}\n\n${doneCount}/${items.length} complete (${pct}%)</pre>`);
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList>
            <TabsTrigger value="ebook" className="text-xs font-semibold">eBook</TabsTrigger>
            <TabsTrigger value="paperback" className="text-xs font-semibold">Paperback</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
          <Printer size={12} className="mr-1" /> Print Checklist
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-foreground">{pct}% Complete</div>
          <div className="text-xs text-muted-foreground">{doneCount}/{items.length}</div>
        </div>
        <Progress value={pct} className="h-2" />
      </Card>

      <TooltipProvider>
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <Card
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`p-3 cursor-pointer transition-all flex items-start gap-3 ${
                checked[item.id] ? "bg-primary/5 border-primary/20" : "hover:bg-primary/[0.03]"
              }`}
            >
              {checked[item.id] ? (
                <CheckCircle2 size={18} className="text-emerald flex-shrink-0 mt-0.5" />
              ) : (
                <Circle size={18} className="text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className={`text-sm font-medium ${checked[item.id] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {i + 1}. {item.title}
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-foreground">
                    <Info size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[250px] text-xs">
                  {item.tip}
                </TooltipContent>
              </Tooltip>
            </Card>
          ))}
        </div>
      </TooltipProvider>

      {pct === 100 && (
        <Card className="p-4 text-center bg-emerald/5 border-emerald/20">
          <div className="text-sm font-bold text-emerald">All checks passed — ready to upload to KDP</div>
        </Card>
      )}
    </div>
  );
};

export default UploadChecklist;
