import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Mail,
  Globe,
  FileText,
  Headphones,
  Phone,
  LogOut,
  TrendingUp,
  Lock,
} from "lucide-react";
import AgentTab from "./AgentTab";
import LandingPageBuilder from "./LandingPageBuilder";
import PdfEngine from "./PdfEngine";

interface DashboardProps {
  onLogout: () => void;
}

const navSections = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Publishing",
    items: [
      { id: "pages", icon: Globe, label: "Landing Pages" },
      { id: "pdf", icon: FileText, label: "AnyWay Formatter" },
    ],
  },
  {
    label: "CRM",
    items: [
      { id: "leads", icon: Users, label: "Leads" },
      { id: "email", icon: Mail, label: "Email & Calls" },
    ],
  },
  {
    label: "Automation",
    items: [
      { id: "agent", icon: Headphones, label: "AI Call Agent" },
    ],
  },
];

const allItems = navSections.flatMap((s) => s.items);

const metrics = [
  { label: "Total Leads", value: "248", sub: "↑ 14% vs last month", trend: "up" },
  { label: "Answer Rate", value: "62%", sub: "High efficiency", trend: "up" },
  { label: "Manuscripts", value: "12", sub: "3 processing", trend: "neutral" },
  { label: "CVR Sales", value: "8.4%", sub: "Needs attention", trend: "warn" },
];

const leads = [
  { initials: "MW", name: "Marcus Williams", email: "marcus.w@outlook.com", source: "Nomad Page", consent: "Express Written", stage: "Warm", color: "from-primary to-cyan-2" },
  { initials: "JA", name: "Jana Adeyemi", email: "jana.a@gmail.com", source: "Chapter Teaser", consent: "Express Written", stage: "New", color: "from-indigo-400 to-indigo-600" },
  { initials: "RP", name: "Ryan Park", email: "r.park@icloud.com", source: "Pre-order", consent: "Express Written", stage: "Hot", color: "from-emerald-400 to-emerald-600" },
];

const stageBadge = (stage: string) => {
  const map: Record<string, string> = { Warm: "bg-gold/10 text-gold", New: "bg-[rgba(255,255,255,0.06)] text-muted", Hot: "bg-coral/10 text-coral" };
  return map[stage] || map.New;
};
const sourceBadge = (source: string) => {
  const map: Record<string, string> = { "Nomad Page": "bg-primary/10 text-primary", "Chapter Teaser": "bg-[rgba(255,255,255,0.06)] text-muted", "Pre-order": "bg-gold/10 text-gold" };
  return map[source] || "bg-[rgba(255,255,255,0.06)] text-muted";
};

const pageTitles: Record<string, [string, string]> = {
  dashboard: ["Author Dashboard", "248 active leads · 12 manuscripts"],
  pages: ["Landing Page Builder", "Create beautiful sales pages for your books"],
  pdf: ["AnyWay Formatter", "KDP-compliant manuscript formatting — no data stored"],
  leads: ["Leads Center", "Full lead management — import, filter, score, and contact all your readers"],
  email: ["CRM & Communication", "Manage email sequences and call lists for your lead pipeline"],
  agent: ["AI Call Agent", "Automated voice outreach system"],
};

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [title, sub] = pageTitles[activeTab] || ["Dashboard", ""];

  return (
    <div className="h-screen w-full flex bg-background">
      {/* Sidebar */}
      <aside className="w-[248px] flex-shrink-0 border-r border-[rgba(255,255,255,0.06)] flex flex-col p-6 px-3.5" style={{ background: "hsl(222 50% 6%)" }}>
        <div className="font-black text-base tracking-tight px-2.5 mb-8">
          <span className="text-primary">KDP</span> <span className="text-foreground">UNLOCKED</span>
        </div>

        {navSections.map((section) => (
          <div key={section.label}>
            <div className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-muted px-2.5 mt-4 mb-1.5">{section.label}</div>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-sm font-medium cursor-pointer transition-all mb-0.5 border border-transparent w-full text-left ${
                  activeTab === item.id
                    ? "text-primary bg-primary/10 border-primary/20 font-semibold"
                    : "text-muted hover:text-foreground hover:bg-primary/[0.05]"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>
        ))}

        <div className="mt-auto bg-emerald/[0.06] border border-emerald/[0.15] rounded-lg p-3">
          <div className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-muted mb-1">Security</div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald">
            <Lock size={12} />
            AES-256 Active
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
          <div>
            <div className="font-extrabold text-xl tracking-tight text-foreground">{title}</div>
            <div className="text-xs text-muted mt-0.5">{sub}</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-card border border-[rgba(255,255,255,0.06)] rounded-full px-3.5 py-1.5 cursor-pointer transition-all hover:border-primary/30">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-cyan-2 flex items-center justify-center text-xs font-bold text-primary-foreground">SA</div>
              <div>
                <div className="text-xs font-semibold text-foreground">Agent Sarah</div>
                <div className="text-[0.62rem] font-bold text-emerald">● ACTIVE</div>
              </div>
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-xs transition-all hover:brightness-110">+ Add Lead</button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto ${activeTab === "pages" ? "" : "p-8"} custom-scrollbar`}>
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "agent" && <AgentTab />}
          {activeTab === "pages" && <LandingPageBuilder />}
          {activeTab === "pdf" && <PdfEngine />}
          {!["dashboard", "agent", "pages", "pdf"].includes(activeTab) && (
            <PlaceholderTab
              icon={allItems.find((n) => n.id === activeTab)?.icon || LayoutDashboard}
              title={allItems.find((n) => n.id === activeTab)?.label || ""}
              desc={getTabDesc(activeTab)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

function DashboardContent() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[13px] p-5 transition-all hover:border-primary/20 hover:-translate-y-0.5 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="text-[0.63rem] font-bold uppercase tracking-[0.1em] text-muted mb-2">{m.label}</div>
            <div className="text-3xl font-black tracking-tight text-foreground">{m.value}</div>
            <div className={`text-[0.7rem] mt-1 flex items-center gap-1 ${m.trend === "up" ? "text-emerald" : m.trend === "warn" ? "text-gold" : "text-muted"}`}>
              {m.trend === "up" && <TrendingUp size={12} />}
              {m.sub}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="font-bold text-base text-foreground">Recent Leads</div>
          <div className="flex gap-2">
            <button className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110">Refresh</button>
            <button className="bg-transparent text-muted border border-[rgba(255,255,255,0.06)] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)]">Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/[0.03]">
                {["Lead", "Source", "Consent", "Stage", "Action"].map((h, i) => (
                  <th key={h} className={`px-4 py-2.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-muted text-left ${i === 4 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={i} className="border-t border-[rgba(255,255,255,0.06)] transition-colors hover:bg-primary/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${lead.color} flex items-center justify-center font-extrabold text-xs text-primary-foreground flex-shrink-0`}>{lead.initials}</div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{lead.name}</div>
                        <div className="text-[0.7rem] text-muted mt-0.5">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.67rem] font-semibold ${sourceBadge(lead.source)}`}>{lead.source}</span></td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.67rem] font-semibold bg-emerald/10 text-emerald">✓ {lead.consent}</span></td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.67rem] font-semibold ${stageBadge(lead.stage)}`}>{lead.stage}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-bold text-xs transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,229,255,0.25)] inline-flex items-center gap-1.5">
                      <Phone size={12} /> Call Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PlaceholderTab({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] p-14 text-center">
      <Icon size={40} className="text-primary opacity-45 mx-auto mb-3" />
      <div className="font-bold text-lg text-foreground mb-2">{title}</div>
      <div className="text-sm text-muted">{desc}</div>
    </div>
  );
}

function getTabDesc(id: string) {
  const map: Record<string, string> = {
    leads: "Full lead management — import, filter, score, and contact all your readers.",
    email: "Manage email sequences and call lists for your entire lead pipeline.",
  };
  return map[id] || "";
}

export default Dashboard;