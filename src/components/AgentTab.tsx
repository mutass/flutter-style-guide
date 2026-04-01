import { Bot, CircleDot, Lock, Phone, Shield, Wifi } from "lucide-react";

const infoBlocks = [
  { label: "Connected Lead", value: "Marcus Williams", sub: "Ready for handshake", subColor: "text-emerald" },
  { label: "Compliance", value: "Opt-Out Enabled", sub: "TCPA Automated Mode", subColor: "text-muted" },
  { label: "Session", value: "Twilio Ready", sub: "Voice API Connected", subColor: "text-muted" },
  { label: "Encryption", value: "AES-256", sub: "Active", subColor: "text-emerald" },
];

export default function AgentTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-4">
      {/* Left: Hub */}
      <div className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[15px] p-7">
        <h3 className="text-lg font-extrabold text-foreground mb-2">AI Voice Automation Hub</h3>
        <p className="text-sm text-muted leading-relaxed">
          Twilio Voice API with real-time AI script generation. All calls are TCPA-compliant with automated opt-out handling.
        </p>
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          {infoBlocks.map((b, i) => (
            <div key={i} className="bg-secondary border border-[rgba(255,255,255,0.06)] rounded-lg p-4">
              <div className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted mb-1">{b.label}</div>
              <div className="text-sm font-bold text-foreground">{b.value}</div>
              <div className={`text-[0.7rem] mt-0.5 ${b.subColor}`}>{b.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Sarah Card */}
      <div className="bg-card border border-primary/20 rounded-[15px] p-6 flex flex-col items-center text-center relative overflow-hidden">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 65%)" }}
        />
        <div className="w-[72px] h-[72px] rounded-full border-2 border-primary bg-gradient-to-br from-primary to-cyan-2 flex items-center justify-center text-2xl font-black text-primary-foreground relative z-[1] mb-3">
          SA
        </div>
        <div className="font-black text-base text-foreground relative z-[1]">AI AGENT SARAH</div>
        <div className="text-xs text-muted mt-0.5 mb-3.5 relative z-[1]">Twilio Synthesis · Voice AI</div>

        <span className="inline-flex items-center gap-1.5 bg-emerald/10 text-emerald px-3 py-1 rounded-full text-[0.67rem] font-bold mb-4 relative z-[1]">
          <span className="w-1 h-1 rounded-full bg-emerald" /> Online &amp; Ready
        </span>

        <div className="bg-secondary border-l-[3px] border-l-primary rounded-r-lg p-3 text-left text-xs text-muted leading-relaxed italic mb-4 w-full relative z-[1]">
          "Hello Marcus, I noticed you were reading the Nomad teaser. Would you like the full Amazon manuscript strategy?"
        </div>

        <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-extrabold text-sm transition-all hover:brightness-110 hover:shadow-[0_8px_26px_rgba(0,229,255,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 relative z-[1]">
          <Bot size={15} /> START AI CALL SEQUENCE
        </button>
      </div>
    </div>
  );
}
