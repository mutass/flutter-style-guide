import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, CheckCircle2, XCircle, Image as ImageIcon, Copy } from "lucide-react";

const TRIM_SIZES: Record<string, { w: number; h: number; label: string }> = {
  "6x9": { w: 6, h: 9, label: "6 × 9 in" },
  "5.5x8.5": { w: 5.5, h: 8.5, label: "5.5 × 8.5 in" },
  "5x8": { w: 5, h: 8, label: "5 × 8 in" },
  "8.5x11": { w: 8.5, h: 11, label: "8.5 × 11 in" },
};

const SPINE_PER_PAGE_CREAM = 0.002252;

interface CheckResult {
  label: string;
  pass: boolean;
  detail: string;
  fix?: string;
}

const CoverChecker = () => {
  const [imageData, setImageData] = useState<{ width: number; height: number; size: number; name: string; url: string; isGrey: boolean } | null>(null);
  const [trimSize, setTrimSize] = useState("6x9");
  const [pageCount, setPageCount] = useState("200");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const trim = TRIM_SIZES[trimSize];
  const pages = parseInt(pageCount) || 200;
  const spineWidth = pages * SPINE_PER_PAGE_CREAM;

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a JPG or PNG file");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      // Check greyscale by sampling pixels
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = Math.min(img.width, 100);
      canvas.height = Math.min(img.height, 100);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let greyCount = 0;
      const total = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === data[i + 1] && data[i + 1] === data[i + 2]) greyCount++;
      }
      const isGrey = greyCount / total > 0.95;

      setImageData({ width: img.width, height: img.height, size: file.size, name: file.name, url, isGrey });
    };
    img.src = url;
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  }, [processImage]);

  const checks = (): CheckResult[] => {
    if (!imageData) return [];
    const { width, height, size, isGrey } = imageData;

    // Full cover = front + spine + back + bleed
    const fullCoverW = trim.w * 2 + spineWidth + 0.25; // 0.125 bleed each side
    const fullCoverH = trim.h + 0.25;
    const reqW = Math.ceil(fullCoverW * 300);
    const reqH = Math.ceil(fullCoverH * 300);

    // DPI calculation based on full cover dimensions
    const dpiW = width / fullCoverW;
    const dpiH = height / fullCoverH;
    const effectiveDpi = Math.min(dpiW, dpiH);

    // Aspect ratio check
    const expectedRatio = fullCoverW / fullCoverH;
    const actualRatio = width / height;
    const ratioDiff = Math.abs(actualRatio - expectedRatio) / expectedRatio * 100;

    const results: CheckResult[] = [
      {
        label: "Minimum 300 DPI",
        pass: effectiveDpi >= 300,
        detail: `Effective DPI: ${Math.round(effectiveDpi)}`,
        fix: effectiveDpi < 300 ? `Increase image to at least ${reqW}×${reqH}px` : undefined,
      },
      {
        label: "Correct aspect ratio",
        pass: ratioDiff <= 2,
        detail: `Expected ${expectedRatio.toFixed(3)}, got ${actualRatio.toFixed(3)} (${ratioDiff.toFixed(1)}% off)`,
        fix: ratioDiff > 2 ? `Resize cover to ${reqW}×${reqH}px for ${trim.label} with spine` : undefined,
      },
      {
        label: "File size under 50MB",
        pass: size < 50 * 1024 * 1024,
        detail: `${(size / (1024 * 1024)).toFixed(1)} MB`,
        fix: size >= 50 * 1024 * 1024 ? "Compress the image or reduce resolution" : undefined,
      },
      {
        label: "Spine width adequate",
        pass: pages >= 100,
        detail: `Spine: ${spineWidth.toFixed(4)}in (${pages} pages)`,
        fix: pages < 100 ? "KDP requires 100+ pages for spine text" : undefined,
      },
      {
        label: "Color mode",
        pass: !isGrey,
        detail: isGrey ? "Image appears greyscale" : "Color image detected",
        fix: isGrey ? "If color cover intended, ensure image is saved in RGB mode" : undefined,
      },
    ];

    return results;
  };

  const results = checks();
  const passCount = results.filter((r) => r.pass).length;

  // Visual diagram proportions
  const frontW = trim.w;
  const backW = trim.w;
  const totalW = backW + spineWidth + frontW;
  const totalH = trim.h;
  const scale = 260 / totalW;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — Upload + Settings */}
      <div className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          {imageData ? (
            <div>
              <ImageIcon size={32} className="mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium text-foreground">{imageData.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{imageData.width} × {imageData.height}px · {(imageData.size / (1024 * 1024)).toFixed(1)} MB</div>
            </div>
          ) : (
            <>
              <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm font-medium text-foreground">Drop your cover image here</div>
              <div className="text-xs text-muted-foreground mt-1">JPG or PNG</div>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processImage(e.target.files[0]); }} />
        </div>

        <Card className="p-4 space-y-3">
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
          <div>
            <Label className="text-xs mb-1 block">Page Count</Label>
            <Input type="number" min={24} max={828} value={pageCount} onChange={(e) => setPageCount(e.target.value)} className="h-9 text-sm" />
          </div>
        </Card>

        {/* Cover diagram */}
        <Card className="p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Cover Layout</div>
          <svg width={totalW * scale + 20} height={totalH * scale + 30} viewBox={`0 0 ${totalW * scale + 20} ${totalH * scale + 30}`} className="mx-auto">
            {/* Back */}
            <rect x={10} y={10} width={backW * scale} height={totalH * scale} fill="hsl(222, 45%, 12%)" stroke="hsl(186, 100%, 50%)" strokeWidth={1} rx={2} />
            <text x={10 + (backW * scale) / 2} y={10 + (totalH * scale) / 2} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={10}>Back</text>
            <text x={10 + (backW * scale) / 2} y={10 + (totalH * scale) / 2 + 14} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={8}>{backW}in</text>

            {/* Spine */}
            <rect x={10 + backW * scale} y={10} width={Math.max(spineWidth * scale, 2)} height={totalH * scale} fill={pages >= 100 ? "hsl(155, 100%, 20%)" : "hsl(350, 100%, 30%)"} stroke="hsl(186, 100%, 50%)" strokeWidth={1} />
            {spineWidth * scale > 20 && (
              <text x={10 + backW * scale + (spineWidth * scale) / 2} y={10 + (totalH * scale) / 2} textAnchor="middle" fill="hsl(216, 60%, 90%)" fontSize={7} transform={`rotate(-90, ${10 + backW * scale + (spineWidth * scale) / 2}, ${10 + (totalH * scale) / 2})`}>Spine</text>
            )}

            {/* Front */}
            <rect x={10 + (backW + spineWidth) * scale} y={10} width={frontW * scale} height={totalH * scale} fill="hsl(222, 45%, 12%)" stroke="hsl(186, 100%, 50%)" strokeWidth={1} rx={2} />
            <text x={10 + (backW + spineWidth) * scale + (frontW * scale) / 2} y={10 + (totalH * scale) / 2} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={10}>Front</text>
            <text x={10 + (backW + spineWidth) * scale + (frontW * scale) / 2} y={10 + (totalH * scale) / 2 + 14} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={8}>{frontW}in</text>

            {/* Dimension label */}
            <text x={(totalW * scale + 20) / 2} y={totalH * scale + 26} textAnchor="middle" fill="hsl(218, 25%, 47%)" fontSize={8}>
              Spine: {spineWidth.toFixed(4)}in
            </text>
          </svg>
        </Card>
      </div>

      {/* Right — Results */}
      <div className="space-y-4">
        {imageData && (
          <>
            <Card className="p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Detected Dimensions</div>
              <div className="text-2xl font-bold text-foreground">{imageData.width} × {imageData.height} px</div>
              <div className="text-xs text-muted-foreground mt-1">
                Required: {Math.ceil((trim.w * 2 + spineWidth + 0.25) * 300)} × {Math.ceil((trim.h + 0.25) * 300)} px for {trim.label}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Validation</div>
                <Badge variant={passCount === results.length ? "default" : "secondary"}>
                  {passCount}/{results.length} passed
                </Badge>
              </div>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {r.pass ? (
                      <CheckCircle2 size={16} className="text-emerald flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.detail}</div>
                      {r.fix && <div className="text-xs text-destructive mt-0.5">Fix: {r.fix}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {!imageData && (
          <Card className="p-8 text-center">
            <ImageIcon size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
            <div className="text-sm font-medium text-foreground">Upload a cover image to check</div>
            <div className="text-xs text-muted-foreground mt-1">Validates DPI, aspect ratio, size, and spine</div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoverChecker;
