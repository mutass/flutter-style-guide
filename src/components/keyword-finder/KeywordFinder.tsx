import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Copy, Loader2, AlertTriangle } from "lucide-react";

const GENRES = ["Fiction", "Non-fiction", "Self-help", "Business", "Romance", "Thriller", "Fantasy", "Sci-fi", "Children's", "Biography", "Health", "Cooking"];
const SUB_GENRES: Record<string, string[]> = {
  Fiction: ["Literary", "Contemporary", "Historical", "Dystopian", "Satire"],
  Romance: ["Contemporary", "Paranormal", "Historical", "Romantic Suspense", "Clean"],
  Thriller: ["Psychological", "Legal", "Medical", "Spy", "Action"],
  Fantasy: ["Epic", "Urban", "Dark", "LitRPG", "Cozy"],
  Business: ["Entrepreneurship", "Leadership", "Marketing", "Finance", "Startups"],
  "Self-help": ["Productivity", "Mindfulness", "Relationships", "Career", "Habits"],
  default: ["General"],
};

const COMPETITION: Record<string, "High" | "Medium" | "Low"> = {};

function generateKeywords(title: string, genre: string, subGenre: string, comps: string[], reader: string): { keyword: string; competition: "High" | "Medium" | "Low" }[] {
  const g = genre.toLowerCase();
  const sg = subGenre.toLowerCase();
  const pool: { keyword: string; competition: "High" | "Medium" | "Low" }[] = [];

  const patterns = [
    { keyword: `${g} books ${sg}`, competition: "Medium" as const },
    { keyword: `best ${sg} ${g}`, competition: "High" as const },
    { keyword: `${g} for ${reader.split(" ").slice(0, 2).join(" ") || "adults"}`, competition: "Low" as const },
    { keyword: `new ${sg} ${g} 2024`, competition: "Low" as const },
    { keyword: `${sg} books like ${comps[0] || title}`, competition: "Low" as const },
    { keyword: `top ${g} ${sg} reads`, competition: "Medium" as const },
    { keyword: `${g} ${sg} kindle`, competition: "Medium" as const },
    { keyword: `must read ${sg} books`, competition: "High" as const },
    { keyword: `${sg} ${g} recommendations`, competition: "Medium" as const },
    { keyword: `award winning ${sg} ${g}`, competition: "Low" as const },
  ];

  // Pick 7 diverse ones
  const selected = patterns.slice(0, 7).map((p) => ({
    keyword: p.keyword.replace(/\s+/g, " ").trim().slice(0, 50),
    competition: p.competition,
  }));

  return selected;
}

const competitionColor = (c: string) => {
  if (c === "Low") return "bg-emerald/10 text-emerald";
  if (c === "Medium") return "bg-accent/10 text-accent";
  return "bg-destructive/10 text-destructive";
};

const KeywordFinder = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [genre, setGenre] = useState("Fiction");
  const [subGenre, setSubGenre] = useState("");
  const [comp1, setComp1] = useState("");
  const [comp2, setComp2] = useState("");
  const [comp3, setComp3] = useState("");
  const [reader, setReader] = useState("");
  const [keywords, setKeywords] = useState<{ keyword: string; competition: "High" | "Medium" | "Low" }[]>([]);
  const [loading, setLoading] = useState(false);

  const subGenres = SUB_GENRES[genre] || SUB_GENRES.default;

  const handleGenerate = async () => {
    if (!title.trim()) { toast.error("Enter a book title"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = generateKeywords(title, genre, subGenre || subGenres[0], [comp1, comp2, comp3].filter(Boolean), reader);
    setKeywords(result);
    setLoading(false);
    toast.success("7 keywords generated");
  };

  const copyAll = () => {
    navigator.clipboard.writeText(keywords.map((k) => k.keyword).join(", "));
    toast.success("All keywords copied");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — Inputs */}
      <div className="space-y-4">
        <Card className="p-5 space-y-4">
          <div className="text-sm font-bold text-foreground">Book Info</div>

          <div>
            <Label className="text-xs mb-1 block">Book Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your book title" className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Subtitle</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Optional subtitle" className="h-9 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1 block">Genre</Label>
              <Select value={genre} onValueChange={(v) => { setGenre(v); setSubGenre(""); }}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GENRES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Sub-genre</Label>
              <Select value={subGenre} onValueChange={setSubGenre}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {subGenres.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs font-bold text-foreground mt-2">Comparison Titles</div>
          <Input value={comp1} onChange={(e) => setComp1(e.target.value)} placeholder="Similar book 1" className="h-9 text-sm" />
          <Input value={comp2} onChange={(e) => setComp2(e.target.value)} placeholder="Similar book 2" className="h-9 text-sm" />
          <Input value={comp3} onChange={(e) => setComp3(e.target.value)} placeholder="Similar book 3" className="h-9 text-sm" />

          <div>
            <Label className="text-xs mb-1 block">Target Reader</Label>
            <Input value={reader} onChange={(e) => setReader(e.target.value)} placeholder="Who reads books like yours?" className="h-9 text-sm" />
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full font-semibold">
            {loading ? <Loader2 className="animate-spin mr-1.5" size={14} /> : <Search size={14} className="mr-1.5" />}
            Generate Keywords
          </Button>
        </Card>

        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="text-[0.65rem] text-muted-foreground">
            💡 Enable Lovable Cloud for AI-powered keyword research. Currently using pattern-based generation.
          </div>
        </Card>
      </div>

      {/* Right — Results */}
      <div className="space-y-4">
        {keywords.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-foreground">Your 7 KDP Keywords</div>
              <Button variant="outline" size="sm" onClick={copyAll} className="text-xs">
                <Copy size={12} className="mr-1" /> Copy All 7
              </Button>
            </div>

            <div className="space-y-2">
              {keywords.map((kw, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[0.6rem] h-5 w-5 flex items-center justify-center p-0">{i + 1}</Badge>
                        <span className="text-sm font-medium text-foreground">{kw.keyword}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-semibold ${competitionColor(kw.competition)}`}>
                          {kw.competition}
                        </span>
                        <span>{kw.keyword.length}/50 chars</span>
                        {kw.keyword.length > 50 && (
                          <span className="flex items-center gap-1 text-destructive">
                            <AlertTriangle size={10} /> Over limit
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                      navigator.clipboard.writeText(kw.keyword);
                      toast.success("Copied");
                    }}>
                      <Copy size={12} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-3 bg-accent/5 border-accent/20">
              <div className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> Avoid including your book title or author name in keywords — Amazon already indexes those separately.
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-8 text-center">
            <Search size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
            <div className="text-sm font-medium text-foreground">Keywords will appear here</div>
            <div className="text-xs text-muted-foreground mt-1">Fill in your book details and click Generate</div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KeywordFinder;
