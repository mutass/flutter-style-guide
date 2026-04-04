import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Download, TrendingUp, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PriceEntry {
  date: string;
  price: number;
  bsr: number;
  notes: string;
}

interface TrackedBook {
  id: string;
  title: string;
  asin: string;
  format: "ebook" | "paperback";
  entries: PriceEntry[];
}

const LS_KEY = "kdp-price-tracker";

function loadBooks(): TrackedBook[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveBooks(books: TrackedBook[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(books));
}

const PriceTracker = () => {
  const [books, setBooks] = useState<TrackedBook[]>(loadBooks);
  const [activeBook, setActiveBook] = useState<string>("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAsin, setNewAsin] = useState("");
  const [newFormat, setNewFormat] = useState<"ebook" | "paperback">("ebook");

  // Entry form
  const [entryPrice, setEntryPrice] = useState("");
  const [entryBsr, setEntryBsr] = useState("");
  const [entryNotes, setEntryNotes] = useState("");

  useEffect(() => { saveBooks(books); }, [books]);
  useEffect(() => { if (!activeBook && books.length > 0) setActiveBook(books[0].id); }, [books, activeBook]);

  const book = books.find((b) => b.id === activeBook);

  const addBook = () => {
    if (!newTitle.trim()) { toast.error("Enter a title"); return; }
    if (books.length >= 10) { toast.error("Maximum 10 books"); return; }
    const nb: TrackedBook = { id: Date.now().toString(), title: newTitle.trim(), asin: newAsin.trim(), format: newFormat, entries: [] };
    setBooks([...books, nb]);
    setActiveBook(nb.id);
    setNewTitle(""); setNewAsin(""); setShowAdd(false);
    toast.success("Book added");
  };

  const addEntry = () => {
    if (!book) return;
    const price = parseFloat(entryPrice);
    const bsr = parseInt(entryBsr);
    if (isNaN(price)) { toast.error("Enter a valid price"); return; }
    const entry: PriceEntry = { date: new Date().toISOString().split("T")[0], price, bsr: isNaN(bsr) ? 0 : bsr, notes: entryNotes };
    setBooks(books.map((b) => b.id === activeBook ? { ...b, entries: [...b.entries, entry] } : b));
    setEntryPrice(""); setEntryBsr(""); setEntryNotes("");
    toast.success("Entry logged");
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter((b) => b.id !== id));
    if (activeBook === id) setActiveBook(books.find((b) => b.id !== id)?.id || "");
    toast.success("Book removed");
  };

  const exportCsv = () => {
    if (!book) return;
    const header = "Date,Price,BSR,Notes";
    const rows = book.entries.map((e) => `${e.date},${e.price},${e.bsr},"${e.notes}"`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${book.title.replace(/\s+/g, "_")}_prices.csv`;
    a.click();
    toast.success("CSV exported");
  };

  // Insights
  const bestPrice = book?.entries.filter((e) => e.bsr > 0).sort((a, b) => a.bsr - b.bsr)[0];
  const biggestImprovement = (() => {
    if (!book || book.entries.length < 2) return null;
    let best = { improvement: 0, from: 0, to: 0, price: 0 };
    for (let i = 1; i < book.entries.length; i++) {
      const prev = book.entries[i - 1];
      const curr = book.entries[i];
      if (prev.bsr > 0 && curr.bsr > 0) {
        const imp = prev.bsr - curr.bsr;
        if (imp > best.improvement) best = { improvement: imp, from: prev.bsr, to: curr.bsr, price: curr.price };
      }
    }
    return best.improvement > 0 ? best : null;
  })();

  return (
    <div className="space-y-4">
      {/* Book tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {books.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBook(b.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              activeBook === b.id ? "bg-primary/10 text-primary border-primary/20" : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {b.title}
          </button>
        ))}
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)} className="text-xs">
          <Plus size={12} className="mr-1" /> Add Book
        </Button>
      </div>

      {/* Add book form */}
      {showAdd && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Book title" className="h-9 text-sm" />
            <Input value={newAsin} onChange={(e) => setNewAsin(e.target.value)} placeholder="ASIN" className="h-9 text-sm" />
            <Select value={newFormat} onValueChange={(v) => setNewFormat(v as any)}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ebook">eBook</SelectItem>
                <SelectItem value="paperback">Paperback</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addBook} className="h-9 text-xs">Add</Button>
          </div>
        </Card>
      )}

      {book ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-foreground">{book.title}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportCsv} className="text-xs">
                    <Download size={12} className="mr-1" /> Export CSV
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteBook(book.id)} className="text-xs text-destructive">
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>

              {book.entries.length > 1 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={book.entries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(218, 25%, 20%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(218, 25%, 47%)" }} />
                    <YAxis yAxisId="price" tick={{ fontSize: 10, fill: "hsl(186, 100%, 50%)" }} />
                    <YAxis yAxisId="bsr" orientation="right" reversed tick={{ fontSize: 10, fill: "hsl(44, 90%, 61%)" }} />
                    <Tooltip contentStyle={{ background: "hsl(222, 45%, 8%)", border: "1px solid hsl(186, 100%, 50%, 0.2)", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line yAxisId="price" type="monotone" dataKey="price" stroke="hsl(186, 100%, 50%)" name="Price ($)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="bsr" type="monotone" dataKey="bsr" stroke="hsl(44, 90%, 61%)" name="BSR (↓ better)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-xs text-muted-foreground">Add at least 2 entries to see the chart</div>
              )}
            </Card>

            {/* Price log table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary/[0.03]">
                      <th className="px-4 py-2 text-left text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                      <th className="px-4 py-2 text-left text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">Price</th>
                      <th className="px-4 py-2 text-left text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">BSR</th>
                      <th className="px-4 py-2 text-left text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {book.entries.map((e, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-4 py-2 text-xs text-foreground">{e.date}</td>
                        <td className="px-4 py-2 text-xs text-primary font-semibold">${e.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-xs text-foreground">{e.bsr > 0 ? `#${e.bsr.toLocaleString()}` : "—"}</td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">{e.notes || "—"}</td>
                      </tr>
                    ))}
                    {book.entries.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-6 text-center text-xs text-muted-foreground">No entries yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right — Add entry + Insights */}
          <div className="space-y-4">
            <Card className="p-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Log New Entry</div>
              <div>
                <Label className="text-xs mb-1 block">Price ($)</Label>
                <Input type="number" step="0.01" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">BSR Rank</Label>
                <Input type="number" value={entryBsr} onChange={(e) => setEntryBsr(e.target.value)} placeholder="Optional" className="h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Notes</Label>
                <Input value={entryNotes} onChange={(e) => setEntryNotes(e.target.value)} placeholder="e.g. price drop test" className="h-9 text-sm" />
              </div>
              <Button onClick={addEntry} className="w-full text-xs font-semibold">
                <Plus size={12} className="mr-1" /> Log Entry
              </Button>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Insights</div>

              {bestPrice ? (
                <div>
                  <div className="text-xs text-muted-foreground">Best performing price</div>
                  <div className="text-lg font-bold text-primary">${bestPrice.price.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">BSR #{bestPrice.bsr.toLocaleString()}</div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">Add entries with BSR to see insights</div>
              )}

              {biggestImprovement && (
                <div>
                  <div className="text-xs text-muted-foreground">Biggest BSR improvement</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald">
                    <TrendingUp size={14} />
                    +{biggestImprovement.improvement.toLocaleString()} ranks
                  </div>
                  <div className="text-xs text-muted-foreground">
                    #{biggestImprovement.from.toLocaleString()} → #{biggestImprovement.to.toLocaleString()} at ${biggestImprovement.price.toFixed(2)}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <TrendingUp size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
          <div className="text-sm font-medium text-foreground">Add a book to start tracking prices</div>
        </Card>
      )}
    </div>
  );
};

export default PriceTracker;
