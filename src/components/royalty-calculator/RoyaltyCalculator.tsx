import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, BookOpen } from "lucide-react";

const MARKETPLACES = [
  { id: "us", label: "Amazon US", currency: "$", rate: 1 },
  { id: "uk", label: "Amazon UK", currency: "£", rate: 0.79 },
  { id: "de", label: "Amazon DE", currency: "€", rate: 0.92 },
  { id: "ca", label: "Amazon CA", currency: "CA$", rate: 1.36 },
  { id: "au", label: "Amazon AU", currency: "A$", rate: 1.53 },
];

const BW_COST_PER_PAGE = 0.012;
const COLOR_COST_PER_PAGE = 0.07;
const DELIVERY_COST_PER_MB = 0.15;
const ASSUMED_MB = 3;

const RoyaltyCalculator = () => {
  const [listPrice, setListPrice] = useState("9.99");
  const [marketplace, setMarketplace] = useState("us");
  const [format, setFormat] = useState<"ebook" | "paperback" | "hardcover">("ebook");
  const [pageCount, setPageCount] = useState([200]);
  const [printingCost, setPrintingCost] = useState("");
  const [colorInterior, setColorInterior] = useState(false);

  const mp = MARKETPLACES.find((m) => m.id === marketplace)!;
  const price = parseFloat(listPrice) || 0;

  const estimatedPrintCost = useMemo(() => {
    const perPage = colorInterior ? COLOR_COST_PER_PAGE : BW_COST_PER_PAGE;
    return +(perPage * pageCount[0]).toFixed(2);
  }, [pageCount, colorInterior]);

  const effectivePrintCost = parseFloat(printingCost) || estimatedPrintCost;

  const calc = useMemo(() => {
    if (format === "ebook") {
      const is70 = price >= 2.99 && price <= 9.99;
      const rate = is70 ? 0.70 : 0.35;
      const delivery = is70 ? DELIVERY_COST_PER_MB * ASSUMED_MB : 0;
      const royalty = Math.max(0, price * rate - delivery);
      const pct = price > 0 ? (royalty / price) * 100 : 0;
      const breakeven = delivery / rate;
      return { royalty, pct, breakeven, rate, delivery };
    } else {
      const royalty = Math.max(0, (price - effectivePrintCost) * 0.60);
      const pct = price > 0 ? (royalty / price) * 100 : 0;
      const breakeven = effectivePrintCost / 0.60;
      return { royalty, pct, breakeven, rate: 0.60, delivery: 0 };
    }
  }, [price, format, effectivePrintCost]);

  const tradRoyalty = price * 0.10;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — Inputs */}
      <div className="space-y-5">
        <Card className="p-5 space-y-4">
          <div className="text-sm font-bold text-foreground">Pricing</div>

          <div>
            <Label className="text-xs mb-1 block">List Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{mp.currency}</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Marketplace</Label>
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MARKETPLACES.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1.5 block">Format</Label>
            <Tabs value={format} onValueChange={(v) => setFormat(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ebook" className="text-xs">eBook</TabsTrigger>
                <TabsTrigger value="paperback" className="text-xs">Paperback</TabsTrigger>
                <TabsTrigger value="hardcover" className="text-xs">Hardcover</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {format !== "ebook" && (
            <>
              <div>
                <Label className="text-xs mb-1 block">Page Count: {pageCount[0]}</Label>
                <Slider min={24} max={828} step={1} value={pageCount} onValueChange={setPageCount} />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Printing Cost (est. {mp.currency}{estimatedPrintCost})</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={String(estimatedPrintCost)}
                  value={printingCost}
                  onChange={(e) => setPrintingCost(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={colorInterior}
                  onChange={(e) => setColorInterior(e.target.checked)}
                  className="rounded"
                />
                <Label className="text-xs">Color interior ($0.07/page vs $0.012 B&W)</Label>
              </div>
            </>
          )}

          {format === "ebook" && (
            <Card className="p-3 bg-primary/5 border-primary/20">
              <div className="text-[0.65rem] text-muted-foreground">
                {price >= 2.99 && price <= 9.99
                  ? "✓ 70% royalty tier — delivery fee applies ($0.15/MB × 3MB)"
                  : "35% royalty tier — no delivery fee"}
              </div>
            </Card>
          )}
        </Card>
      </div>

      {/* Right — Results */}
      <div className="space-y-4">
        {/* Main royalty */}
        <Card className="p-6 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Your Royalty Per Sale</div>
          <div className="text-5xl font-black text-primary tracking-tight">
            {mp.currency}{calc.royalty.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{calc.pct.toFixed(1)}% of list price</div>
          <Badge className="mt-3" variant={calc.pct >= 50 ? "default" : "secondary"}>
            {calc.pct >= 50 ? "Strong margin" : "Low margin"}
          </Badge>
        </Card>

        {/* Breakeven */}
        <Card className="p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Breakeven Price</div>
          <div className="text-xl font-bold text-foreground">{mp.currency}{calc.breakeven.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Minimum price for a positive royalty</div>
        </Card>

        {/* Monthly estimates */}
        <div className="grid grid-cols-3 gap-3">
          {[10, 50, 100].map((qty) => (
            <Card key={qty} className="p-4 text-center">
              <div className="text-xs text-muted-foreground">{qty} sales/mo</div>
              <div className="text-lg font-bold text-foreground mt-1">
                {mp.currency}{(calc.royalty * qty).toFixed(0)}
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison bar */}
        <Card className="p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Self-Pub vs Traditional</div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground font-medium">Your royalty</span>
                <span className="text-primary font-bold">{mp.currency}{calc.royalty.toFixed(2)}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, calc.pct)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground font-medium">Traditional (~10%)</span>
                <span className="text-muted-foreground">{mp.currency}{tradRoyalty.toFixed(2)}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-muted rounded-full" style={{ width: "10%" }} />
              </div>
            </div>
          </div>
          {calc.royalty > tradRoyalty && (
            <div className="text-xs text-primary font-semibold mt-2 flex items-center gap-1">
              <TrendingUp size={12} />
              You earn {(calc.royalty / Math.max(tradRoyalty, 0.01)).toFixed(1)}× more self-publishing
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RoyaltyCalculator;
