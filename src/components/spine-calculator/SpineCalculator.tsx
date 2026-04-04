import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Copy, CheckCircle2, XCircle } from "lucide-react";

const PAPER_TYPES = [
  { id: "white", label: "White paper (standard)", factor: 0.002347 },
  { id: "cream", label: "Cream paper", factor: 0.002500 },
  { id: "color", label: "Color paper", factor: 0.002347 },
];

const TRIM_SIZES: Record<string, { w: number; h: number; label: string }> = {
  "6x9": { w: 6, h: 9, label: "6 × 9 in" },
  "5.5x8.5": { w: 5.5, h: 8.5, label: "5.5 × 8.5 in" },
  "5x8": { w: 5, h: 8, label: "5 × 8 in" },
  "8.5x11": { w: 8.5, h: 11, label: "8.5 × 11 in" },
};

const SpineCalculator = () => {
  const [pageCount, setPageCount] = useState([200]);
  const [paperType, setPaperType] = useState("cream");
  const [trimSize, setTrimSize] = useState("6x9");

  const paper = PAPER_TYPES.find((p) => p.id === paperType)!;
  const trim = TRIM_SIZES[trimSize];
  const pages = pageCount[0];

  const spineIn = pages * paper.factor;
  const spineMm = spineIn * 25.4;
  const spinePx = Math.round(spineIn * 300);
  const textFits = pages >= 100;

  const copyLine = () => {
    const text = `Spine: ${spineIn.toFixed(4)} in / ${spineMm.toFixed(2)} mm / ${spinePx}px @ 300dpi`;
    navigator.clipboard.writeText(text);
    toast.success("Spine dimensions copied");
  };

  // SVG diagram
  const frontW = trim.w;
  const backW = trim.w;
  const totalW = backW + spineIn + frontW;
  const totalH = trim.h;
  const svgScale = 240 / totalW;
  const svgW = totalW * svgScale + 20;
  const svgH = totalH * svgScale + 36;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — Inputs */}
      <div className="space-y-4">
        <Card className="p-5 space-y-4">
          <div className="text-sm font-bold text-foreground">Spine Calculator</div>

          <div>
            <Label className="text-xs mb-1 block">Page Count: {pages}</Label>
            <Slider min={24} max={828} step={1} value={pageCount} onValueChange={setPageCount} />
          </div>

          <div>
            <Label className="text-xs mb-1 block">Paper Type</Label>
            <Select value={paperType} onValueChange={setPaperType}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAPER_TYPES.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.label} ({p.factor} in/page)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Trim Size</Label>
            <Select value={trimSize} onValueChange={setTrimSize}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TRIM_SIZES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Results</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground">Inches</div>
              <div className="text-xl font-bold text-primary">{spineIn.toFixed(4)}"</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Millimeters</div>
              <div className="text-xl font-bold text-foreground">{spineMm.toFixed(2)} mm</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pixels @ 300 DPI</div>
              <div className="text-xl font-bold text-foreground">{spinePx} px</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Min pages for text</div>
              <div className="text-xl font-bold text-foreground">100</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {textFits ? (
              <>
                <CheckCircle2 size={16} className="text-emerald" />
                <span className="text-sm font-medium text-emerald">Text fits on spine</span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-destructive" />
                <span className="text-sm font-medium text-destructive">Too narrow for spine text</span>
              </>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={copyLine} className="w-full text-xs mt-2">
            <Copy size={12} className="mr-1" /> Copy Spine Dimensions
          </Button>
        </Card>
      </div>

      {/* Right — Visual */}
      <div>
        <Card className="p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Cover Diagram</div>
          <div className="flex justify-center">
            <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
              {/* Back */}
              <rect x={10} y={10} width={backW * svgScale} height={totalH * svgScale} fill="hsl(222, 45%, 12%)" stroke="hsl(186, 100%, 50%)" strokeWidth={1} rx={2} />
              <text x={10 + (backW * svgScale) / 2} y={10 + (totalH * svgScale) / 2 - 6} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={11} fontWeight="bold">Back</text>
              <text x={10 + (backW * svgScale) / 2} y={10 + (totalH * svgScale) / 2 + 10} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={9}>{backW}"</text>

              {/* Spine */}
              <rect
                x={10 + backW * svgScale}
                y={10}
                width={Math.max(spineIn * svgScale, 2)}
                height={totalH * svgScale}
                fill={textFits ? "hsl(155, 100%, 20%)" : "hsl(350, 100%, 30%)"}
                stroke="hsl(186, 100%, 50%)"
                strokeWidth={1}
              />
              {spineIn * svgScale > 14 && (
                <text
                  x={10 + backW * svgScale + (spineIn * svgScale) / 2}
                  y={10 + (totalH * svgScale) / 2}
                  textAnchor="middle"
                  fill="hsl(216, 60%, 90%)"
                  fontSize={8}
                  transform={`rotate(-90, ${10 + backW * svgScale + (spineIn * svgScale) / 2}, ${10 + (totalH * svgScale) / 2})`}
                >
                  {spineIn.toFixed(3)}"
                </text>
              )}

              {/* Front */}
              <rect x={10 + (backW + spineIn) * svgScale} y={10} width={frontW * svgScale} height={totalH * svgScale} fill="hsl(222, 45%, 12%)" stroke="hsl(186, 100%, 50%)" strokeWidth={1} rx={2} />
              <text x={10 + (backW + spineIn) * svgScale + (frontW * svgScale) / 2} y={10 + (totalH * svgScale) / 2 - 6} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={11} fontWeight="bold">Front</text>
              <text x={10 + (backW + spineIn) * svgScale + (frontW * svgScale) / 2} y={10 + (totalH * svgScale) / 2 + 10} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={9}>{frontW}"</text>

              {/* Height label */}
              <text x={svgW - 5} y={10 + (totalH * svgScale) / 2} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={8} transform={`rotate(-90, ${svgW - 5}, ${10 + (totalH * svgScale) / 2})`}>{trim.h}"</text>
            </svg>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SpineCalculator;
