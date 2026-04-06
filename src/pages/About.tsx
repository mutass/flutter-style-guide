import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, TrendingUp, Heart } from "lucide-react";

const values = [
  { icon: Heart, title: "Author First", desc: "Everything built around the publishing workflow. Every feature exists because an author needed it." },
  { icon: TrendingUp, title: "Revenue Focused", desc: "Every feature tied to book sales, not vanity metrics. We measure success by your royalties." },
  { icon: Shield, title: "Compliant by Design", desc: "TCPA consent, AES-256 encryption, opt-out built into every call. Your readers' trust is non-negotiable." },
];

const team = [
  { initials: "JR", name: "James R.", role: "Founder & CEO" },
  { initials: "SK", name: "Sarah K.", role: "Head of Product" },
  { initials: "MT", name: "Mike T.", role: "Lead Engineer" },
  { initials: "LC", name: "Lisa C.", role: "Marketing Director" },
];

export default function About() {
  const navigate = useNavigate();
  useEffect(() => { document.title = "About Us — Amazon Unlocked"; }, []);

  return (
    <div className="min-h-screen bg-background" style={{ background: "var(--gradient-body)" }}>
      <nav className="flex justify-between items-center px-6 md:px-15 h-[70px] sticky top-0 z-[200] border-b border-primary/[0.12]" style={{ background: "rgba(5,10,26,0.75)", backdropFilter: "blur(20px)" }}>
        <div className="font-black text-lg tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-primary">Amazon</span> <span className="text-foreground">Unlocked</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate("/")} className="bg-transparent border border-primary/[0.12] text-foreground px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:border-primary hover:text-primary">Home</button>
        </div>
      </nav>

      <section className="text-center pt-20 pb-16 px-6">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4">
          Built for Authors Who Are <span className="text-primary">Serious About Revenue</span>
        </h1>
        <p className="text-muted text-base max-w-[600px] mx-auto leading-relaxed">
          Amazon Unlocked is the only KDP platform that combines professional manuscript formatting with a full marketing automation engine — lead capture, email sequences, and AI voice calls.
        </p>
      </section>

      <section className="max-w-[800px] mx-auto px-6 pb-16">
        <div className="bg-card border border-border rounded-xl p-8 text-center mb-16">
          <div className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">Our Mission</div>
          <p className="text-lg text-foreground leading-relaxed font-medium">
            We believe self-published authors deserve the same marketing infrastructure as major publishers. We built the tools to make that possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {values.map((v) => (
            <div key={v.title} className="bg-card border border-border rounded-xl p-6">
              <v.icon size={24} className="text-primary mb-3" />
              <div className="font-bold text-foreground mb-2">{v.title}</div>
              <div className="text-sm text-muted leading-relaxed">{v.desc}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">The Team</div>
          <p className="text-muted text-sm max-w-[500px] mx-auto">Built by a team of authors, developers, and marketers who got tired of watching great books fail because of bad marketing.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {team.map((t) => (
            <div key={t.initials} className="bg-card border border-border rounded-xl p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyan-2 flex items-center justify-center text-xl font-black text-primary-foreground mx-auto mb-3">{t.initials}</div>
              <div className="font-bold text-foreground text-sm">{t.name}</div>
              <div className="text-xs text-muted">{t.role}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground px-10 py-3.5 rounded-lg font-extrabold text-base transition-all hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">
            Start Your Free Account →
          </button>
        </div>
      </section>
    </div>
  );
}
