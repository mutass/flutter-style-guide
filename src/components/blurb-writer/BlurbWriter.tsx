import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, Copy, RefreshCw, Palette, Loader2 } from "lucide-react";

const GENRES = ["Fiction", "Non-fiction", "Self-help", "Business", "Romance", "Thriller", "Fantasy", "Children's", "Biography"];
const TONES = ["Exciting", "Professional", "Warm", "Mysterious", "Inspirational"];

const BLURB_TEMPLATES: Record<string, Record<string, string>> = {
  Fiction: {
    Exciting: "When {title} thrusts readers into a world where nothing is as it seems, every page delivers pulse-pounding tension that refuses to let go.\n\nThis gripping narrative follows characters who must confront impossible choices, navigate treacherous alliances, and discover strengths they never knew they possessed.\n\n• Uncover secrets that will change everything you thought you knew\n• Experience a story that keeps you guessing until the final page\n• Meet characters so real they will stay with you long after the last chapter\n\nFor readers who demand stories that challenge, surprise, and leave a lasting impression — this is the book you have been waiting for.",
    Professional: "{title} presents a carefully crafted narrative that examines the complexities of human nature through a lens of sophisticated storytelling.\n\nWith precision and depth, this novel explores themes that resonate across cultures and generations, offering readers a literary experience that is both intellectually stimulating and emotionally rewarding.\n\n• A masterfully constructed plot with layers of meaning\n• Characters drawn with psychological depth and authenticity\n• Prose that balances elegance with accessibility\n\nIdeal for discerning readers who appreciate fiction that respects their intelligence while delivering genuine emotional impact.",
    Warm: "{title} invites readers into a story filled with connection, hope, and the quiet strength found in everyday moments.\n\nThrough richly drawn characters and thoughtful storytelling, this novel reminds us that the most powerful stories are often the ones closest to our own hearts.\n\n• Characters you will root for from the very first page\n• A story that celebrates resilience and human connection\n• Moments of humor, tenderness, and genuine surprise\n\nPerfect for readers who love stories that leave them feeling uplifted and grateful for the power of a good book.",
    Mysterious: "{title} opens with a question that demands an answer — and the deeper you read, the more complex that answer becomes.\n\nLayers of intrigue unfold across every chapter as carefully planted clues lead to revelations that redefine everything that came before.\n\n• A puzzle-box narrative that rewards careful readers\n• Atmosphere so thick you can feel it on every page\n• Twists that are earned, not manufactured\n\nFor readers who love to piece together the truth alongside the characters — and who appreciate a story that never underestimates them.",
    Inspirational: "{title} is a story about finding light in unexpected places and discovering that the capacity for change lives within each of us.\n\nThrough characters who face real struggles with courage and grace, this novel demonstrates that even the smallest acts of determination can reshape an entire life.\n\n• A narrative that speaks to the resilience of the human spirit\n• Characters whose growth feels authentic and earned\n• A story that stays with you and gently shifts your perspective\n\nWritten for anyone who believes in the transformative power of hope and the strength that comes from never giving up.",
  },
};

const BULLET_TEMPLATES: Record<string, string[]> = {
  Fiction: [
    "A compelling protagonist whose choices drive the story forward with unstoppable momentum",
    "Rich world-building that creates an immersive reading experience from the very first page",
    "Dialogue that crackles with authenticity and reveals character through every exchange",
    "A plot structure that balances tension with moments of genuine reflection and discovery",
    "An ending that satisfies while leaving readers thinking about the story for days afterward",
  ],
  default: [
    "Practical insights backed by real-world experience and proven results",
    "A clear framework that readers can apply immediately to their own situations",
    "Engaging writing that makes complex concepts accessible and actionable",
    "Case studies and examples that bring every principle to life",
    "A comprehensive resource that rewards both first reading and repeated reference",
  ],
};

const BlurbWriter = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Fiction");
  const [synopsis, setSynopsis] = useState("");
  const [tone, setTone] = useState("Exciting");
  const [targetReader, setTargetReader] = useState("");
  const [blurb, setBlurb] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  const charCount = synopsis.length;

  const generate = async () => {
    if (!title.trim()) { toast.error("Enter a book title"); return; }
    setGenerating(true);
    setBlurb("");
    setBullets([]);

    // Simulate word-by-word streaming with template-based generation
    const toneTemplates = BLURB_TEMPLATES[genre] || BLURB_TEMPLATES.Fiction;
    const template = toneTemplates[tone] || toneTemplates.Exciting;
    const fullBlurb = template.replace(/{title}/g, title.trim());
    const bulletList = BULLET_TEMPLATES[genre] || BULLET_TEMPLATES.default;

    const words = fullBlurb.split(" ");
    let current = "";
    for (let i = 0; i < words.length; i++) {
      current += (i > 0 ? " " : "") + words[i];
      setBlurb(current);
      await new Promise((r) => setTimeout(r, 30));
    }

    setBullets(bulletList);
    setGenerating(false);
    toast.success("Blurb generated");
  };

  const copyBlurb = () => {
    navigator.clipboard.writeText(blurb);
    toast.success("Blurb copied to clipboard");
  };

  const copyHtml = () => {
    const paragraphs = blurb.split("\n\n").filter(Boolean);
    const html = paragraphs.map((p) => {
      if (p.startsWith("•")) {
        const items = p.split("\n").map((l) => `<li>${l.replace(/^•\s*/, "")}</li>`).join("\n");
        return `<ul>\n${items}\n</ul>`;
      }
      return `<p>${p}</p>`;
    }).join("\n");
    navigator.clipboard.writeText(html);
    toast.success("HTML copied — paste into KDP description field");
  };

  const wc = blurb.split(/\s+/).filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — Inputs */}
      <div className="space-y-4">
        <Card className="p-5 space-y-4">
          <div className="text-sm font-bold text-foreground">Book Details</div>

          <div>
            <Label className="text-xs mb-1 block">Book Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your book title" className="h-9 text-sm" />
          </div>

          <div>
            <Label className="text-xs mb-1 block">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">First Chapter or Synopsis</Label>
            <Textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value.slice(0, 2000))}
              placeholder="Paste first chapter or synopsis..."
              className="min-h-[120px] text-sm"
            />
            <div className="text-[0.65rem] text-muted-foreground mt-1 text-right">{charCount}/2000</div>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Target Reader</Label>
            <Input value={targetReader} onChange={(e) => setTargetReader(e.target.value)} placeholder="Who is this book for?" className="h-9 text-sm" />
          </div>

          <Button onClick={generate} disabled={generating} className="w-full font-semibold">
            {generating ? <Loader2 className="animate-spin mr-1.5" size={14} /> : <Sparkles size={14} className="mr-1.5" />}
            Generate Blurb
          </Button>
        </Card>

        <Card className="p-3 bg-primary/5 border-primary/20">
          <div className="text-[0.65rem] text-muted-foreground">
            💡 Enable Lovable Cloud for AI-powered generation using real language models. Currently using template-based output.
          </div>
        </Card>
      </div>

      {/* Right — Output */}
      <div className="space-y-4">
        {blurb ? (
          <>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-foreground">Your Book Description</div>
                <Badge variant="secondary">{wc} words</Badge>
              </div>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap leading-relaxed text-sm">
                {blurb}
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={copyBlurb}>
                  <Copy size={12} className="mr-1" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setBlurb(""); generate(); }}>
                  <RefreshCw size={12} className="mr-1" /> Regenerate
                </Button>
                <Button variant="outline" size="sm" onClick={() => { const next = TONES[(TONES.indexOf(tone) + 1) % TONES.length]; setTone(next); }}>
                  <Palette size={12} className="mr-1" /> Try Different Tone
                </Button>
              </div>
            </Card>

            {/* HTML version */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">KDP HTML Format</div>
                <Button variant="ghost" size="sm" onClick={copyHtml} className="text-xs">
                  <Copy size={12} className="mr-1" /> Copy HTML
                </Button>
              </div>
              <div className="text-xs text-muted-foreground bg-background rounded-lg p-3 font-mono max-h-[200px] overflow-y-auto custom-scrollbar">
                {blurb.split("\n\n").filter(Boolean).map((p, i) => (
                  <div key={i} className="mb-1">
                    {p.startsWith("•") ? `<ul>${p.split("\n").map((l) => `<li>${l.replace(/^•\s*/, "")}</li>`).join("")}</ul>` : `<p>${p}</p>`}
                  </div>
                ))}
              </div>
            </Card>

            {/* Bullet points */}
            {bullets.length > 0 && (
              <Card className="p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">KDP Bullet Points (5)</div>
                <div className="space-y-2">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Badge variant="secondary" className="text-[0.6rem] h-5 w-5 flex items-center justify-center p-0 flex-shrink-0 mt-0.5">{i + 1}</Badge>
                      <span className="text-foreground">{b}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => {
                  navigator.clipboard.writeText(bullets.join("\n"));
                  toast.success("Bullets copied");
                }}>
                  <Copy size={12} className="mr-1" /> Copy All Bullets
                </Button>
              </Card>
            )}
          </>
        ) : (
          <Card className="p-8 text-center">
            <Sparkles size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
            <div className="text-sm font-medium text-foreground">Your blurb will appear here</div>
            <div className="text-xs text-muted-foreground mt-1">Fill in your book details and click Generate</div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlurbWriter;
