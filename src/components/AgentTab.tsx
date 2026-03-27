import { useState } from "react";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Volume2,
  Mic,
  Shield,
  Zap,
  BarChart3,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

const callScripts = [
  {
    id: "warm-intro",
    name: "Warm Lead Introduction",
    description: "First contact with leads who downloaded a chapter teaser",
    script: `"Hi [NAME], this is Sarah calling on behalf of [AUTHOR]. I noticed you downloaded a preview of their latest book — I'd love to hear what you thought! Did any chapter stand out to you?"`,
    tags: ["New Leads", "Chapter Teaser"],
    successRate: 68,
  },
  {
    id: "follow-up",
    name: "Follow-Up & Review Ask",
    description: "Re-engage readers who purchased but haven't left a review",
    script: `"Hey [NAME], thanks so much for grabbing a copy of [BOOK]! I'm reaching out because your opinion really matters — would you be open to leaving a quick review on Amazon? It makes a huge difference for independent authors."`,
    tags: ["Buyers", "Review Request"],
    successRate: 42,
  },
  {
    id: "pre-order",
    name: "Pre-Order Announcement",
    description: "Notify hot leads about upcoming book launches",
    script: `"Hi [NAME], exciting news! [AUTHOR]'s new book [TITLE] is now available for pre-order at a special early-bird price. As one of their most engaged readers, I wanted to make sure you heard first. Can I send you the link?"`,
    tags: ["Hot Leads", "Launch"],
    successRate: 74,
  },
];

const recentCalls = [
  { name: "Marcus Williams", duration: "2:34", status: "completed", time: "12 min ago" },
  { name: "Jana Adeyemi", duration: "1:12", status: "no-answer", time: "28 min ago" },
  { name: "Ryan Park", duration: "4:07", status: "completed", time: "1 hr ago" },
  { name: "Taylor Chen", duration: "0:45", status: "voicemail", time: "2 hr ago" },
  { name: "Priya Sharma", duration: "3:21", status: "completed", time: "3 hr ago" },
];

const statusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle size={13} className="text-emerald" />;
    case "no-answer": return <PhoneOff size={13} className="text-coral" />;
    case "voicemail": return <MessageSquare size={13} className="text-gold" />;
    default: return null;
  }
};

const statusBadge = (status: string) => {
  switch (status) {
    case "completed": return "bg-emerald/10 text-emerald";
    case "no-answer": return "bg-coral/10 text-coral";
    case "voicemail": return "bg-gold/10 text-gold";
    default: return "bg-muted/10 text-muted";
  }
};

export default function AgentTab() {
  const [activeScript, setActiveScript] = useState("warm-intro");
  const [agentActive, setAgentActive] = useState(true);
  const [autoCall, setAutoCall] = useState(true);
  const [tcpaOptOut, setTcpaOptOut] = useState(true);
  const [callSpeed, setCallSpeed] = useState(75);
  const [voiceStyle, setVoiceStyle] = useState("professional");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-4">
      {/* Left: Main content */}
      <div className="space-y-4">
        {/* Agent Hub - Stats */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-lg text-foreground tracking-tight">Agent Performance</h3>
              <p className="text-xs text-muted mt-0.5">Last 7 days overview</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${agentActive ? "bg-emerald/10 text-emerald border border-emerald/20" : "bg-coral/10 text-coral border border-coral/20"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${agentActive ? "bg-emerald shadow-[0_0_6px_hsl(var(--emerald))]" : "bg-coral"}`} />
                {agentActive ? "Active" : "Paused"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { label: "Calls Today", value: "47", sub: "+12 vs yesterday", icon: Phone },
              { label: "Avg Duration", value: "2:18", sub: "Target: 2:00+", icon: Clock },
              { label: "Answer Rate", value: "62%", sub: "+5% this week", icon: PhoneCall },
              { label: "Conversions", value: "14", sub: "29.8% CVR", icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={13} className="text-primary" />
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted">{stat.label}</span>
                </div>
                <div className="text-xl font-black text-foreground tracking-tight">{stat.value}</div>
                <div className="text-[0.65rem] text-emerald mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call Scripts */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
            <div className="font-bold text-base text-foreground">Call Scripts</div>
            <button className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:brightness-110">+ New Script</button>
          </div>
          <div className="p-4 space-y-3">
            {callScripts.map((script) => (
              <div
                key={script.id}
                onClick={() => setActiveScript(script.id)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  activeScript === script.id
                    ? "border-primary/30 bg-primary/[0.05]"
                    : "border-[rgba(255,255,255,0.06)] hover:border-primary/15 hover:bg-primary/[0.02]"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-foreground">{script.name}</div>
                    <div className="text-xs text-muted mt-0.5">{script.description}</div>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald/10 px-2 py-0.5 rounded-full">
                    <BarChart3 size={11} className="text-emerald" />
                    <span className="text-[0.65rem] font-bold text-emerald">{script.successRate}%</span>
                  </div>
                </div>
                {activeScript === script.id && (
                  <div className="mt-3">
                    <div className="bg-secondary border-l-[3px] border-l-primary rounded-r-lg p-3 text-sm text-muted leading-relaxed italic">
                      {script.script}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {script.tags.map(tag => (
                        <span key={tag} className="bg-primary/[0.07] border border-primary/15 text-primary rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold">{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110 flex items-center gap-1.5">
                        <Play size={12} /> Test Script
                      </button>
                      <button className="bg-transparent text-muted border border-[rgba(255,255,255,0.06)] px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center gap-1.5">
                        <Settings size={12} /> Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
            <div className="font-bold text-base text-foreground">Recent Calls</div>
            <button className="bg-transparent text-muted border border-[rgba(255,255,255,0.06)] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)]">View All</button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/[0.03]">
                {["Lead", "Duration", "Status", "Time"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-muted text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call, i) => (
                <tr key={i} className="border-t border-[rgba(255,255,255,0.06)] transition-colors hover:bg-primary/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-2 flex items-center justify-center font-extrabold text-[0.65rem] text-primary-foreground flex-shrink-0">
                        {call.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-semibold text-sm text-foreground">{call.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground">{call.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.67rem] font-semibold capitalize ${statusBadge(call.status)}`}>
                      {statusIcon(call.status)} {call.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{call.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Agent Profile Card + Config */}
      <div className="space-y-4">
        {/* Sarah Profile Card */}
        <div className="bg-card border border-primary/20 rounded-[15px] p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 65%)" }} />
          <div className="w-[72px] h-[72px] rounded-full border-2 border-primary bg-gradient-to-br from-primary to-cyan-2 flex items-center justify-center text-2xl font-black text-primary-foreground relative z-[1] mb-3">
            SA
          </div>
          <div className="font-black text-base text-foreground relative z-[1]">Sarah</div>
          <div className="text-xs text-muted mt-0.5 mb-3.5 relative z-[1]">AI Voice Agent · Twilio Powered</div>

          {/* Script preview */}
          <div className="bg-secondary border-l-[3px] border-l-primary rounded-r-lg p-3 text-left text-xs text-muted leading-relaxed italic mb-4 w-full relative z-[1]">
            "Hi! I'm Sarah, your AI calling assistant. I handle warm lead outreach, review requests, and pre-order announcements — all TCPA compliant."
          </div>

          <button
            onClick={() => setAgentActive(!agentActive)}
            className={`w-full py-3 rounded-lg font-extrabold text-sm transition-all flex items-center justify-center gap-2 relative z-[1] ${
              agentActive
                ? "bg-coral/10 border border-coral/20 text-coral hover:bg-coral/20"
                : "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-[0_8px_26px_rgba(0,229,255,0.3)]"
            }`}
          >
            {agentActive ? <><Pause size={14} /> Pause Agent</> : <><Play size={14} /> Launch Agent</>}
          </button>
        </div>

        {/* Configuration */}
        <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] p-5">
          <h4 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
            <Settings size={14} className="text-primary" /> Configuration
          </h4>

          {/* Toggle: Auto-Call */}
          <div className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.06)] mb-2">
            <div>
              <div className="text-sm font-medium text-foreground">Auto-Call New Leads</div>
              <div className="text-[0.68rem] text-muted mt-0.5">Call within 5 min of capture</div>
            </div>
            <button
              onClick={() => setAutoCall(!autoCall)}
              className={`relative w-[38px] h-[22px] rounded-full transition-all ${autoCall ? "bg-primary/15 border border-primary/40" : "bg-secondary border border-[rgba(255,255,255,0.06)]"}`}
            >
              <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-full transition-all ${autoCall ? "left-[20px] bg-primary" : "left-[3px] bg-muted"}`} />
            </button>
          </div>

          {/* Toggle: TCPA */}
          <div className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.06)] mb-2">
            <div>
              <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Shield size={12} className="text-emerald" /> TCPA Opt-Out
              </div>
              <div className="text-[0.68rem] text-muted mt-0.5">Always include opt-out prompt</div>
            </div>
            <button
              onClick={() => setTcpaOptOut(!tcpaOptOut)}
              className={`relative w-[38px] h-[22px] rounded-full transition-all ${tcpaOptOut ? "bg-primary/15 border border-primary/40" : "bg-secondary border border-[rgba(255,255,255,0.06)]"}`}
            >
              <span className={`absolute top-[3px] w-[14px] h-[14px] rounded-full transition-all ${tcpaOptOut ? "left-[20px] bg-primary" : "left-[3px] bg-muted"}`} />
            </button>
          </div>

          {/* Voice Style */}
          <div className="py-2.5 border-b border-[rgba(255,255,255,0.06)] mb-2">
            <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <Volume2 size={12} className="text-primary" /> Voice Style
            </div>
            <div className="flex gap-1.5">
              {["professional", "friendly", "urgent"].map(style => (
                <button
                  key={style}
                  onClick={() => setVoiceStyle(style)}
                  className={`px-3 py-1.5 rounded-lg text-[0.7rem] font-semibold capitalize transition-all ${
                    voiceStyle === style
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "bg-secondary border border-[rgba(255,255,255,0.06)] text-muted hover:text-foreground"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Call Speed */}
          <div className="py-2.5 mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Mic size={12} className="text-primary" /> Speech Pace
              </div>
              <span className="text-xs font-mono text-primary">{callSpeed}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={callSpeed}
              onChange={(e) => setCallSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(0,229,255,0.4)]"
            />
          </div>

          {/* Reset */}
          <button className="w-full bg-transparent text-muted border border-[rgba(255,255,255,0.06)] py-2.5 rounded-lg text-xs font-semibold transition-all hover:text-foreground hover:border-[rgba(255,255,255,0.15)] flex items-center justify-center gap-1.5 mt-2">
            <RotateCcw size={12} /> Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
