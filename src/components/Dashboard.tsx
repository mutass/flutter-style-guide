import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Mail,
  Globe,
  FileText,
  Headphones,
  Phone,
  Lock,
  DollarSign,
  Image,
  Search,
  LineChart,
  CheckSquare,
  Ruler,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
  Crown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AgentTab from "./AgentTab";
import LandingPageBuilder from "./LandingPageBuilder";
import PdfEngine from "./pdf-engine/PdfEngine";
import LeadsTab from "./LeadsTab";
import EmailCallsTab from "./EmailCallsTab";
import RoyaltyCalculator from "./royalty-calculator/RoyaltyCalculator";
import CoverChecker from "./cover-checker/CoverChecker";
import KeywordFinder from "./keyword-finder/KeywordFinder";
import PriceTracker from "./price-tracker/PriceTracker";
import UploadChecklist from "./upload-checklist/UploadChecklist";
import SpineCalculator from "./spine-calculator/SpineCalculator";

interface DashboardProps {
  onLogout: () => void;
}

const navSections = [
  {
    label: "Overview",
    highlight: false,
    items: [
      { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Marketing Engine",
    highlight: true,
    items: [
      { id: "agent", icon: Headphones, label: "AI Call Agent", live: true },
      { id: "email", icon: Mail, label: "Email & Sequences" },
      { id: "leads", icon: Users, label: "Leads CRM" },
      { id: "pages", icon: Globe, label: "Landing Pages" },
    ],
  },
  {
    label: "Publishing Tools",
    highlight: false,
    items: [
      { id: "pdf", icon: FileText, label: "PDF Engine" },
      { id: "cover", icon: Image, label: "Cover Checker" },
      { id: "royalty", icon: DollarSign, label: "Royalty Calculator" },
      { id: "keywords", icon: Search, label: "Keyword Finder" },
      { id: "spine", icon: Ruler, label: "Spine Calculator" },
      { id: "checklist", icon: CheckSquare, label: "Upload Checklist" },
      { id: "tracker", icon: LineChart, label: "Price Tracker" },
    ],
  },
];

const pageTitles: Record<string, [string, string]> = {
  dashboard: ["Author Dashboard", "Marketing pipeline overview · 21 sales this month"],
  pdf: ["PDF Engine", "Format manuscripts for KDP eBook and Paperback upload"],
  cover: ["Cover Checker", "Validate your cover against Amazon KDP requirements"],
  spine: ["Spine Calculator", "Get exact spine width for your trim size and page count"],
  checklist: ["Upload Checklist", "Step-by-step pre-submission checklist"],
  royalty: ["Royalty Calculator", "Calculate your exact earnings per sale on Amazon"],
  keywords: ["Keyword Finder", "Generate 7 optimised KDP backend keywords"],
  tracker: ["Price Tracker", "Log price changes and track Best Sellers Rank over time"],
  pages: ["Landing Page Builder", "Create sales pages for your books"],
  leads: ["Leads CRM", "248 active leads · 62% answer rate · 8.4% conversion"],
  email: ["Email & Sequences", "Automated follow-up sequences for every lead in your pipeline"],
  agent: ["AI Call Agent", "Automated voice outreach — TCPA compliant · Twilio powered"],
};

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  agent: AgentTab,
  pages: LandingPageBuilder,
  pdf: PdfEngine,
  leads: LeadsTab,
  email: EmailCallsTab,
  royalty: RoyaltyCalculator,
  cover: CoverChecker,
  keywords: KeywordFinder,
  tracker: PriceTracker,
  checklist: UploadChecklist,
  spine: SpineCalculator,
};

const heroMetrics = [
  { label: "Active Leads", value: "248", sub: "↑ 14% vs last month", trend: "up" },
  { label: "Call Answer Rate", value: "62%", sub: "High efficiency", trend: "up" },
  { label: "Email Open Rate", value: "41%", sub: "Above industry avg", trend: "up" },
  { label: "Conversion Rate", value: "8.4%", sub: "↑ 2.1% this month", trend: "up" },
];

const secondaryMetrics = [
  { label: "Manuscripts", value: "12", sub: "3 processing" },
  { label: "PDF Exports", value: "34", sub: "This month" },
  { label: "Landing Pages Live", value: "3", sub: "Active now" },
];

const pipelineSteps = [
  { label: "Landing Page", count: "1,240", icon: Globe },
  { label: "Lead Captured", count: "248", icon: Users },
  { label: "Email Sent", count: "189", icon: Mail },
  { label: "AI Call Made", count: "143", icon: Phone },
  { label: "Sale Converted", count: "21", icon: TrendingUp },
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

const quickActions = [
  { id: "agent", icon: Headphones, title: "Launch AI Calls", desc: "Start automated voice outreach" },
  { id: "email", icon: Mail, title: "Create email sequence", desc: "Set up automated follow-ups" },
  { id: "leads", icon: Users, title: "View leads", desc: "Manage your reader pipeline" },
  { id: "pdf", icon: FileText, title: "Format a manuscript", desc: "Convert .docx to KDP-ready PDF" },
];

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, sub] = pageTitles[activeTab] || ["Author Dashboard", "Marketing pipeline overview"];
  const navigate = useNavigate();

  useEffect(() => {
    const label = pageTitles[activeTab]?.[0] || "Dashboard";
    document.title = `${label} — KDP Unlocked`;
  }, [activeTab]);

  const TabComponent = TAB_COMPONENTS[activeTab];

  const switchTab = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen w-full flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static z-[301] w-[248px] flex-shrink-0 border-r border-[rgba(255,255,255,0.06)] flex flex-col p-6 px-3.5 overflow-y-auto custom-scrollbar h-full transition-transform duration-200`} style={{ background: "hsl(222 50% 6%)" }}>
        <div className="flex items-center justify-between mb-8">
          <div className="font-black text-base tracking-tight px-2.5">
            <span className="text-primary">Amazon</span> <span className="text-foreground">Unlocked</span>
          </div>
          <button className="md:hidden text-muted hover:text-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {navSections.map((section) => (
          <div key={section.label}>
            <div className={`px-2.5 mt-4 mb-1.5 font-bold uppercase tracking-[0.12em] ${
              section.highlight
                ? "text-primary text-[0.72rem]"
                : "text-muted text-[0.62rem]"
            }`}>
              {section.label}
            </div>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-sm font-medium cursor-pointer transition-all mb-0.5 border border-transparent w-full text-left ${
                  activeTab === item.id
                    ? "text-primary bg-primary/10 border-primary/20 font-semibold"
                    : "text-muted hover:text-foreground hover:bg-primary/[0.05]"
                }`}
              >
                <item.icon size={16} />
                {item.label}
                {"live" in item && item.live && (
                  <span className="ml-auto flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-emerald">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
                    </span>
                    LIVE
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}

        <div className="mt-auto space-y-2">
          <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
            <div>
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-0.5">Current Plan</div>
              <div className="text-xs font-bold text-foreground">Starter Plan</div>
            </div>
            <button onClick={() => navigate("/pricing")} className="text-[0.65rem] font-bold text-accent hover:underline flex items-center gap-0.5">
              <Crown size={11} /> Upgrade
            </button>
          </div>
          <div className="bg-emerald/[0.06] border border-emerald/[0.15] rounded-lg p-3">
            <div className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-muted mb-1">Security</div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald">
              <Lock size={12} />
              AES-256 Active
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Topbar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-muted hover:text-foreground" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-foreground">{title}</div>
              <div className="text-xs text-muted mt-0.5">{sub}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/pricing")}
              className="hidden sm:flex items-center gap-1.5 border border-accent/30 text-accent bg-accent/5 px-4 py-2 rounded-lg font-bold text-xs transition-all hover:border-accent hover:bg-accent/10"
            >
              <Crown size={13} /> Upgrade Plan
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-card border border-[rgba(255,255,255,0.06)] rounded-full px-3.5 py-1.5 cursor-pointer transition-all hover:border-primary/30">
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
        <div className={`flex-1 overflow-y-auto ${activeTab === "pages" || activeTab === "pdf" ? "" : "p-4 md:p-8"} custom-scrollbar`}>
          {activeTab === "dashboard" && <DashboardContent onSwitchTab={switchTab} />}
          {TabComponent && <TabComponent />}
        </div>
      </main>
    </div>
  );
};

function DashboardContent({ onSwitchTab }: { onSwitchTab: (id: string) => void }) {
  return (
    <>
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {heroMetrics.map((m, i) => (
          <div key={i} className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[13px] p-5 transition-all hover:border-primary/20 hover:-translate-y-0.5 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="text-[0.63rem] font-bold uppercase tracking-[0.1em] text-muted mb-2">{m.label}</div>
            <div className="text-3xl font-black tracking-tight text-foreground">{m.value}</div>
            <div className={`text-[0.7rem] mt-1 flex items-center gap-1 ${m.trend === "up" ? "text-emerald" : "text-muted"}`}>
              <TrendingUp size={12} />
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {secondaryMetrics.map((m, i) => (
          <div key={i} className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[10px] p-4">
            <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-1">{m.label}</div>
            <div className="text-xl font-bold text-foreground">{m.value}</div>
            <div className="text-[0.65rem] text-muted">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Marketing Pipeline */}
      <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[13px] p-5 mb-6">
        <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted mb-4">Marketing Pipeline</div>
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {pipelineSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-1 flex-shrink-0">
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full border ${
                i < 4 ? "bg-primary/10 border-primary/20 text-primary" : "bg-card border-[rgba(255,255,255,0.1)] text-muted"
              }`}>
                <step.icon size={14} />
                <div>
                  <div className="text-[0.6rem] font-bold uppercase tracking-wider">{step.label}</div>
                  <div className="text-sm font-black">{step.count}</div>
                </div>
              </div>
              {i < pipelineSteps.length - 1 && (
                <ArrowRight size={14} className="text-muted/40 flex-shrink-0 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <div className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted mb-3">Quick Actions</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((qa) => (
            <button
              key={qa.id}
              onClick={() => onSwitchTab(qa.id)}
              className="bg-card border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-left transition-all hover:border-primary/25 hover:-translate-y-0.5 group flex items-center gap-3 w-full"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <qa.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground">{qa.title}</div>
                <div className="text-xs text-muted truncate">{qa.desc}</div>
              </div>
              <ChevronRight size={14} className="text-muted group-hover:text-primary transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
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

export default Dashboard;
