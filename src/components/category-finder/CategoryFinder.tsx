import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FolderTree, Loader2, ChevronRight, AlertTriangle } from "lucide-react";

interface CategoryRec {
  path: string[];
  difficulty: "Easy" | "Medium" | "Competitive";
  reason: string;
}

const CATEGORY_DB: Record<string, { primary: CategoryRec[]; avoid: CategoryRec[] }> = {
  Fiction: {
    primary: [
      { path: ["Books", "Literature & Fiction", "Contemporary Fiction"], difficulty: "Medium", reason: "Broad category with consistent traffic. Your book's themes align well with contemporary fiction readers who explore new voices regularly." },
      { path: ["Kindle Store", "Kindle eBooks", "Literature & Fiction", "Genre Fiction"], difficulty: "Easy", reason: "Less saturated than the main fiction category. Genre fiction readers tend to buy more frequently and leave more reviews." },
      { path: ["Books", "Literature & Fiction", "Literary Fiction"], difficulty: "Competitive", reason: "Higher competition but also higher prestige. Strong reviews can push books to visibility here." },
    ],
    avoid: [
      { path: ["Books", "Literature & Fiction", "Classics"], difficulty: "Competitive", reason: "Dominated by established public domain titles. New releases rarely gain traction against permanent bestsellers." },
      { path: ["Books", "Literature & Fiction", "Short Stories"], difficulty: "Medium", reason: "Unless your book is a short story collection, being miscategorized here will lead to returns from disappointed readers." },
    ],
  },
  Business: {
    primary: [
      { path: ["Books", "Business & Money", "Entrepreneurship"], difficulty: "Medium", reason: "Strong buyer intent in this category. Readers here actively look for actionable advice and are willing to invest in their growth." },
      { path: ["Kindle Store", "Kindle eBooks", "Business & Money", "Small Business & Entrepreneurship"], difficulty: "Easy", reason: "The Kindle-specific subcategory has less competition and captures mobile-first readers who purchase on impulse." },
      { path: ["Books", "Business & Money", "Management & Leadership"], difficulty: "Competitive", reason: "If your content includes leadership themes, this category provides cross-genre visibility." },
    ],
    avoid: [
      { path: ["Books", "Business & Money", "Industries"], difficulty: "Competitive", reason: "Too broad and filled with industry-specific technical manuals. General business books get lost here." },
      { path: ["Books", "Reference"], difficulty: "Medium", reason: "Reference buyers expect encyclopedic formats. A narrative business book will underperform expectations." },
    ],
  },
  default: {
    primary: [
      { path: ["Books", "Self-Help", "Personal Transformation"], difficulty: "Medium", reason: "A versatile category that attracts readers looking for change. Works well for books with practical advice and personal stories." },
      { path: ["Kindle Store", "Kindle eBooks", "Self-Help"], difficulty: "Easy", reason: "The Kindle self-help category captures a distinct audience of digital-first readers who buy frequently." },
      { path: ["Books", "Health, Fitness & Dieting", "Mental Health"], difficulty: "Medium", reason: "If your book touches on wellness themes, this category provides additional visibility to a health-conscious audience." },
    ],
    avoid: [
      { path: ["Books", "Self-Help", "Self-Esteem"], difficulty: "Competitive", reason: "One of the most oversaturated subcategories. Established titles dominate the top positions permanently." },
      { path: ["Books", "Education & Teaching"], difficulty: "Medium", reason: "Education category buyers expect textbook-style formatting. A narrative self-help book will feel out of place." },
    ],
  },
};

const difficultyColor = (d: string) => {
  if (d === "Easy") return "bg-emerald/10 text-emerald";
  if (d === "Medium") return "bg-accent/10 text-accent";
  return "bg-destructive/10 text-destructive";
};

const CategoryFinder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("both");
  const [region, setRegion] = useState("us");
  const [results, setResults] = useState<{ primary: CategoryRec[]; avoid: CategoryRec[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyse = async () => {
    if (!title.trim()) { toast.error("Enter a book title"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    // Simple genre detection from description
    const desc = description.toLowerCase();
    let genre = "default";
    if (desc.includes("business") || desc.includes("entrepreneur") || desc.includes("startup")) genre = "Business";
    else if (desc.includes("novel") || desc.includes("fiction") || desc.includes("character")) genre = "Fiction";

    setResults(CATEGORY_DB[genre] || CATEGORY_DB.default);
    setLoading(false);
    toast.success("Categories analysed");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — Inputs */}
      <div className="space-y-4">
        <Card className="p-5 space-y-4">
          <div className="text-sm font-bold text-foreground">Book Details</div>

          <div>
            <Label className="text-xs mb-1 block">Book Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" className="h-9 text-sm" />
          </div>

          <div>
            <Label className="text-xs mb-1 block">Back Cover Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Paste your book description..." className="min-h-[140px] text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1 block">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ebook">eBook</SelectItem>
                  <SelectItem value="paperback">Paperback</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">US</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleAnalyse} disabled={loading} className="w-full font-semibold">
            {loading ? <Loader2 className="animate-spin mr-1.5" size={14} /> : <FolderTree size={14} className="mr-1.5" />}
            Analyse Categories
          </Button>
        </Card>

        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="text-[0.65rem] text-muted-foreground">
            💡 Enable Lovable Cloud for AI-powered category analysis. Currently using pattern-based recommendations.
          </div>
        </Card>
      </div>

      {/* Right — Results */}
      <div className="space-y-4">
        {results ? (
          <>
            <div className="text-sm font-bold text-foreground">Recommended Categories</div>
            {results.primary.map((cat, i) => (
              <Card key={i} className={`p-4 ${i === 0 ? "border-primary/30 bg-primary/5" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={i === 0 ? "default" : "secondary"} className="text-[0.65rem]">
                    {i === 0 ? "Primary" : `Alternative ${i}`}
                  </Badge>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${difficultyColor(cat.difficulty)}`}>
                    {cat.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap mb-2">
                  {cat.path.map((p, j) => (
                    <span key={j} className="flex items-center gap-1 text-xs">
                      {j > 0 && <ChevronRight size={10} className="text-muted-foreground" />}
                      <span className={j === cat.path.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}>{p}</span>
                    </span>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">{cat.reason}</div>
              </Card>
            ))}

            <div className="flex items-center gap-2 mt-6 mb-2">
              <AlertTriangle size={14} className="text-destructive" />
              <div className="text-sm font-bold text-foreground">Categories to Avoid</div>
            </div>
            {results.avoid.map((cat, i) => (
              <Card key={i} className="p-4 border-destructive/20 bg-destructive/5">
                <div className="flex items-center gap-1 flex-wrap mb-2">
                  {cat.path.map((p, j) => (
                    <span key={j} className="flex items-center gap-1 text-xs">
                      {j > 0 && <ChevronRight size={10} className="text-muted-foreground" />}
                      <span className={j === cat.path.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}>{p}</span>
                    </span>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">{cat.reason}</div>
              </Card>
            ))}

            <Card className="p-3 bg-accent/5 border-accent/20">
              <div className="text-xs text-muted-foreground">
                📝 eBook and Paperback categories are set separately on KDP. You can choose different categories for each format.
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-8 text-center">
            <FolderTree size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
            <div className="text-sm font-medium text-foreground">Category recommendations will appear here</div>
            <div className="text-xs text-muted-foreground mt-1">Enter your book details and click Analyse</div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CategoryFinder;
