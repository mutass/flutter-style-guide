import { useState, useMemo, useRef } from "react";
import {
  Users,
  Search,
  Filter,
  Upload,
  Download,
  Phone,
  Mail,
  Trash2,
  CheckSquare,
  Star,
  TrendingUp,
  ArrowUpDown,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: "New" | "Warm" | "Hot" | "Cold" | "Converted";
  score: number;
  consent: string;
  date: string;
  notes: string;
  selected?: boolean;
}

const initialLeads: Lead[] = [
  { id: "1", name: "Marcus Williams", email: "marcus.w@outlook.com", phone: "+1 (555) 234-5678", source: "Nomad Page", stage: "Warm", score: 78, consent: "Express Written", date: "2024-03-28", notes: "Interested in KDP bundle" },
  { id: "2", name: "Jana Adeyemi", email: "jana.a@gmail.com", phone: "+1 (555) 345-6789", source: "Chapter Teaser", stage: "New", score: 45, consent: "Express Written", date: "2024-03-27", notes: "Downloaded free chapter" },
  { id: "3", name: "Ryan Park", email: "r.park@icloud.com", phone: "+1 (555) 456-7890", source: "Pre-order", stage: "Hot", score: 92, consent: "Express Written", date: "2024-03-26", notes: "Ready to buy, follow up ASAP" },
  { id: "4", name: "Sophia Chen", email: "sophia.chen@yahoo.com", phone: "+1 (555) 567-8901", source: "Nomad Page", stage: "Converted", score: 100, consent: "Express Written", date: "2024-03-25", notes: "Purchased full bundle" },
  { id: "5", name: "David Okafor", email: "d.okafor@gmail.com", phone: "+1 (555) 678-9012", source: "Webinar", stage: "Warm", score: 65, consent: "Express Written", date: "2024-03-24", notes: "Attended live session" },
  { id: "6", name: "Emma Rodriguez", email: "emma.r@hotmail.com", phone: "+1 (555) 789-0123", source: "Chapter Teaser", stage: "Cold", score: 22, consent: "Implied", date: "2024-03-23", notes: "No response in 14 days" },
  { id: "7", name: "James Taylor", email: "j.taylor@proton.me", phone: "+1 (555) 890-1234", source: "Pre-order", stage: "Hot", score: 88, consent: "Express Written", date: "2024-03-22", notes: "Requested pricing info" },
  { id: "8", name: "Aisha Khan", email: "a.khan@gmail.com", phone: "+1 (555) 901-2345", source: "Nomad Page", stage: "New", score: 35, consent: "Express Written", date: "2024-03-21", notes: "Signed up via landing page" },
  { id: "9", name: "Michael Brown", email: "m.brown@outlook.com", phone: "+1 (555) 012-3456", source: "Webinar", stage: "Warm", score: 71, consent: "Express Written", date: "2024-03-20", notes: "Asked about group pricing" },
  { id: "10", name: "Lisa Nguyen", email: "l.nguyen@icloud.com", phone: "+1 (555) 123-4567", source: "Chapter Teaser", stage: "New", score: 40, consent: "Implied", date: "2024-03-19", notes: "Opened 3 emails" },
];

const stages = ["All", "New", "Warm", "Hot", "Cold", "Converted"] as const;
const sources = ["All", "Nomad Page", "Chapter Teaser", "Pre-order", "Webinar"] as const;

const stageBadge: Record<string, string> = {
  New: "bg-[rgba(255,255,255,0.06)] text-muted",
  Warm: "bg-gold/10 text-gold",
  Hot: "bg-coral/10 text-coral",
  Cold: "bg-primary/10 text-primary",
  Converted: "bg-emerald/10 text-emerald",
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-emerald";
  if (score >= 50) return "text-gold";
  return "text-muted";
};

const scoreBar = (score: number) => {
  if (score >= 80) return "bg-emerald";
  if (score >= 50) return "bg-gold";
  return "bg-muted";
};

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "score" | "date">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [alert, setAlert] = useState<{ msg: string; type: string } | null>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  const showAlert = (msg: string, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const filtered = useMemo(() => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q));
    }
    if (stageFilter !== "All") result = result.filter(l => l.stage === stageFilter);
    if (sourceFilter !== "All") result = result.filter(l => l.source === sourceFilter);
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      else if (sortBy === "score") cmp = a.score - b.score;
      else cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortDir === "desc" ? -cmp : cmp;
    });
    return result;
  }, [leads, search, stageFilter, sourceFilter, sortBy, sortDir]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(l => l.id)));
    }
  };

  const bulkDelete = () => {
    if (selectedIds.size === 0) return;
    setLeads(prev => prev.filter(l => !selectedIds.has(l.id)));
    showAlert(`Deleted ${selectedIds.size} lead(s).`, "success");
    setSelectedIds(new Set());
  };

  const bulkUpdateStage = (stage: Lead["stage"]) => {
    if (selectedIds.size === 0) return;
    setLeads(prev => prev.map(l => selectedIds.has(l.id) ? { ...l, stage } : l));
    showAlert(`Updated ${selectedIds.size} lead(s) to ${stage}.`, "success");
    setSelectedIds(new Set());
  };

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const text = reader.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) {
        showAlert("CSV file appears empty or invalid.", "info");
        return;
      }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const nameIdx = headers.findIndex(h => h.includes("name"));
      const emailIdx = headers.findIndex(h => h.includes("email"));
      const phoneIdx = headers.findIndex(h => h.includes("phone"));
      const sourceIdx = headers.findIndex(h => h.includes("source"));

      if (nameIdx === -1 || emailIdx === -1) {
        showAlert("CSV must have 'name' and 'email' columns.", "info");
        return;
      }

      const newLeads: Lead[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim());
        if (!cols[nameIdx] || !cols[emailIdx]) continue;
        newLeads.push({
          id: `csv-${Date.now()}-${i}`,
          name: cols[nameIdx],
          email: cols[emailIdx],
          phone: phoneIdx >= 0 ? cols[phoneIdx] || "" : "",
          source: sourceIdx >= 0 ? cols[sourceIdx] || "CSV Import" : "CSV Import",
          stage: "New",
          score: Math.floor(Math.random() * 40) + 20,
          consent: "Implied",
          date: new Date().toISOString().split("T")[0],
          notes: "Imported from CSV",
        });
      }
      setLeads(prev => [...prev, ...newLeads]);
      showAlert(`Imported ${newLeads.length} leads from CSV.`, "success");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const exportCSV = () => {
    const rows = [["Name", "Email", "Phone", "Source", "Stage", "Score", "Consent", "Date", "Notes"]];
    const data = selectedIds.size > 0 ? filtered.filter(l => selectedIds.has(l.id)) : filtered;
    data.forEach(l => rows.push([l.name, l.email, l.phone, l.source, l.stage, String(l.score), l.consent, l.date, l.notes]));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads_export.csv"; a.click();
    URL.revokeObjectURL(url);
    showAlert(`Exported ${data.length} leads.`, "success");
  };

  const toggleSort = (col: "name" | "score" | "date") => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const stageStats = useMemo(() => {
    const counts: Record<string, number> = { New: 0, Warm: 0, Hot: 0, Cold: 0, Converted: 0 };
    leads.forEach(l => counts[l.stage]++);
    return counts;
  }, [leads]);

  const avgScore = useMemo(() => {
    if (leads.length === 0) return 0;
    return Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length);
  }, [leads]);

  return (
    <div>
      {/* Alert */}
      {alert && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl mb-5 text-sm font-medium animate-fade-up ${
          alert.type === "success" ? "bg-emerald/10 border-l-[3px] border-l-emerald text-emerald" : "bg-primary/[0.08] border-l-[3px] border-l-primary text-primary"
        }`}>
          {alert.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {alert.msg}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
          <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-1">Total Leads</div>
          <div className="text-2xl font-black text-foreground">{leads.length}</div>
        </div>
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
          <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-1">Avg Score</div>
          <div className={`text-2xl font-black ${scoreColor(avgScore)}`}>{avgScore}</div>
        </div>
        {Object.entries(stageStats).slice(0, 4).map(([stage, count]) => (
          <div key={stage} className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
            <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-1">{stage}</div>
            <div className="text-2xl font-black text-foreground">{count}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 flex-1 min-w-[200px]">
            <Search size={14} className="text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted/50 focus:outline-none flex-1"
            />
            {search && <X size={14} className="text-muted cursor-pointer hover:text-foreground" onClick={() => setSearch("")} />}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-secondary border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground"
            }`}
          >
            <Filter size={13} /> Filters
          </button>

          {/* Import / Export */}
          <button onClick={() => csvRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-secondary border border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground transition-all">
            <Upload size={13} /> Import CSV
          </button>
          <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={importCSV} />
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-secondary border border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground transition-all">
            <Download size={13} /> Export
          </button>
        </div>

        {/* Filter Row */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)] animate-fade-up">
            <div>
              <label className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-1 block">Stage</label>
              <div className="flex gap-1">
                {stages.map(s => (
                  <button
                    key={s}
                    onClick={() => setStageFilter(s)}
                    className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-semibold transition-all ${
                      stageFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-1 block">Source</label>
              <div className="flex gap-1 flex-wrap">
                {sources.map(s => (
                  <button
                    key={s}
                    onClick={() => setSourceFilter(s)}
                    className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-semibold transition-all ${
                      sourceFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/[0.08] border border-primary/20 rounded-xl px-4 py-3 mb-4 flex items-center justify-between animate-fade-up">
          <span className="text-sm font-semibold text-primary">{selectedIds.size} selected</span>
          <div className="flex gap-2">
            <button onClick={() => bulkUpdateStage("Hot")} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-coral/10 text-coral hover:bg-coral/20 transition-all">Mark Hot</button>
            <button onClick={() => bulkUpdateStage("Warm")} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold/10 text-gold hover:bg-gold/20 transition-all">Mark Warm</button>
            <button onClick={() => bulkUpdateStage("Cold")} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-all">Mark Cold</button>
            <button onClick={bulkDelete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all flex items-center gap-1">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Lead Table */}
      <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/[0.03]">
                <th className="px-4 py-2.5 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="accent-[hsl(186,100%,50%)] w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted text-left cursor-pointer hover:text-foreground" onClick={() => toggleSort("name")}>
                  <span className="flex items-center gap-1">Lead <ArrowUpDown size={10} /></span>
                </th>
                <th className="px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted text-left">Source</th>
                <th className="px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted text-left">Stage</th>
                <th className="px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted text-left cursor-pointer hover:text-foreground" onClick={() => toggleSort("score")}>
                  <span className="flex items-center gap-1">Score <ArrowUpDown size={10} /></span>
                </th>
                <th className="px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted text-left">Consent</th>
                <th className="px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted text-left cursor-pointer hover:text-foreground" onClick={() => toggleSort("date")}>
                  <span className="flex items-center gap-1">Date <ArrowUpDown size={10} /></span>
                </th>
                <th className="px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted">
                    <Users size={32} className="mx-auto mb-2 opacity-30" />
                    <div className="text-sm font-semibold">No leads found</div>
                    <div className="text-xs mt-1">Try adjusting your filters or import a CSV.</div>
                  </td>
                </tr>
              ) : filtered.map((lead) => {
                const initials = lead.name.split(" ").map(n => n[0]).join("").slice(0, 2);
                const colors = ["from-primary to-cyan-2", "from-indigo-400 to-indigo-600", "from-emerald-400 to-emerald-600", "from-gold to-amber-500", "from-coral to-rose-500"];
                const colorIdx = parseInt(lead.id.replace(/\D/g, "")) % colors.length;
                return (
                  <tr key={lead.id} className={`border-t border-[rgba(255,255,255,0.06)] transition-colors hover:bg-primary/[0.03] ${selectedIds.has(lead.id) ? "bg-primary/[0.05]" : ""}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="accent-[hsl(186,100%,50%)] w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center font-extrabold text-[0.6rem] text-primary-foreground flex-shrink-0`}>{initials}</div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{lead.name}</div>
                          <div className="text-[0.65rem] text-muted">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-semibold bg-[rgba(255,255,255,0.06)] text-muted">{lead.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-semibold ${stageBadge[lead.stage]}`}>{lead.stage}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${scoreBar(lead.score)}`} style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${scoreColor(lead.score)}`}>{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${
                        lead.consent === "Express Written" ? "bg-emerald/10 text-emerald" : "bg-gold/10 text-gold"
                      }`}>
                        {lead.consent === "Express Written" ? "✓" : "~"} {lead.consent}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{lead.date}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all" title="Call">
                          <Phone size={12} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.06)] text-muted hover:text-foreground transition-all" title="Email">
                          <Mail size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="text-xs text-muted">
            Showing {filtered.length} of {leads.length} leads
          </div>
          <div className="text-xs text-muted flex items-center gap-1">
            <Star size={11} className="text-gold" /> Scores auto-calculated based on engagement
          </div>
        </div>
      </div>
    </div>
  );
}
