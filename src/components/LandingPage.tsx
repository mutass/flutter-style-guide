import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  Headphones,
  Globe,
  Check,
} from "lucide-react";

interface LandingPageProps {
  onOpenApp: () => void;
}

const features = [
  { icon: FileText, title: "Manuscript Engine", desc: "Auto-detects chapters, applies KDP gutter margins, and exports 300 DPI PDF/A files fully compatible with Amazon's previewer." },
  { icon: Users, title: "Lead Capture CRM", desc: "High-conversion landing page templates collect phone numbers and emails. All leads sync in real time." },
  { icon: Headphones, title: "AI Voice Agent", desc: "Sarah — your AI agent — calls warm leads automatically with personalised scripts and TCPA opt-out built in." },
  { icon: Mail, title: "Email & SMS Sequences", desc: "Automated follow-up campaigns nurture leads from first click to Amazon purchase, review, and repeat buyer." },
  { icon: Globe, title: "Landing Page Builder", desc: "Drag-free visual builder creates high-conversion book pages with live preview, templates, and lead capture forms." },
  { icon: LayoutDashboard, title: "Analytics Dashboard", desc: "Track every conversion, call, and sale. Real-time metrics show exactly what's working across your entire catalog." },
];

const stats = [
  { num: "248+", label: "Active Leads" },
  { num: "62%", label: "Call Answer Rate" },
  { num: "12", label: "Manuscripts" },
  { num: "8.4%", label: "Conversion Rate" },
  { num: "300 DPI", label: "PDF Export Quality" },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    sub: "Forever free",
    features: ["PDF Engine (eBook only)", "Royalty Calculator", "Spine Width Calculator"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Author",
    price: "$19",
    sub: "/month",
    features: ["Unlimited PDF Engine", "Cover Checker", "Landing Page Builder"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Publisher",
    price: "$49",
    sub: "/month",
    features: ["AI Voice Agent", "Unlimited Lead CRM", "Email & SMS sequences"],
    cta: "Start Free Trial",
    popular: false,
  },
];

const LandingPage = ({ onOpenApp }: LandingPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden" style={{ background: "var(--gradient-body)" }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Orbs */}
      <div className="absolute w-[550px] h-[550px] rounded-full -top-40 -right-30 blur-[90px] pointer-events-none z-0" style={{ background: "rgba(0,80,200,0.22)" }} />
      <div className="absolute w-[380px] h-[380px] rounded-full -bottom-15 -left-20 blur-[90px] pointer-events-none z-0" style={{ background: "rgba(0,180,255,0.10)" }} />
      <div className="absolute w-[320px] h-[320px] rounded-full top-[45%] left-[32%] blur-[90px] pointer-events-none z-0" style={{ background: "rgba(10,40,120,0.35)" }} />

      {/* Nav */}
      <nav className="flex justify-between items-center px-6 md:px-15 h-[70px] sticky top-0 z-[200] border-b border-primary/[0.12]" style={{ background: "rgba(5,10,26,0.75)", backdropFilter: "blur(20px)" }}>
        <div className="font-black text-lg tracking-tight">
          <span className="text-primary">Amazon</span> <span className="text-foreground">Unlocked</span>
        </div>
        <div className="hidden md:flex items-center gap-0.5">
          {[
            { label: "Unlock", action: () => {} },
            { label: "About Us", action: () => {} },
            { label: "Marketing", action: () => {} },
            { label: "Pricing", action: () => navigate("/pricing") },
            { label: "KDP Sales", action: () => {} },
          ].map((link, i) => (
            <a key={link.label} onClick={link.action} className={`text-sm font-medium px-4 py-1.5 rounded-full border border-transparent transition-all cursor-pointer ${i === 0 ? "bg-primary/[0.12] border-primary/[0.2] text-primary" : "text-foreground hover:border-primary/[0.12] hover:bg-primary/[0.06]"}`}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={onOpenApp} className="bg-transparent border border-primary/[0.12] text-foreground px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:border-primary hover:text-primary">Login</button>
          <button onClick={onOpenApp} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:shadow-[0_0_24px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-10 pt-20 relative z-[1]">
        <div className="inline-flex items-center gap-2 bg-primary/[0.08] border border-primary/[0.2] rounded-full px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-7">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-blink" />
          KDP Marketing Suite · Now Live
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black leading-none tracking-tighter mb-1.5">
          <span className="text-primary">Amazon</span> <span className="text-foreground">Unlocked</span>
        </h1>
        <div className="text-base md:text-xl font-light text-muted uppercase tracking-[0.08em] mb-6">KDP Marketing</div>
        <p className="max-w-[540px] text-base text-muted leading-7 mb-9">
          Transform your manuscript into a revenue machine. Capture leads, automate follow-ups, and dominate Amazon's algorithm — all from one dashboard.
        </p>
        <div className="flex gap-2 justify-center flex-wrap mb-9">
          {["Amazon", "Marketing", "KDP Formatter", "AI Calls"].map(tag => (
            <span key={tag} className="bg-primary/[0.07] border border-primary/[0.15] text-primary rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide cursor-pointer transition-all hover:bg-primary/[0.15]">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2.5 bg-primary/[0.07] border border-primary/[0.18] rounded-lg px-5 py-2.5 mb-10">
          <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_10px_hsl(var(--emerald))] flex-shrink-0" />
          <span className="text-xs font-medium text-muted">Readers engaged right now</span>
          <span className="font-mono text-lg font-medium text-primary">2,136.8k</span>
        </div>
        <div className="flex gap-3.5 justify-center flex-wrap mb-16">
          <button onClick={onOpenApp} className="bg-primary text-primary-foreground px-10 py-3.5 rounded-lg font-extrabold text-base transition-all hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">
            Start 10× Sales Pipeline →
          </button>
          <button onClick={onOpenApp} className="bg-transparent border border-primary/[0.12] text-foreground px-8 py-3 rounded-lg font-semibold text-base transition-all hover:border-primary hover:text-primary">
            View Dashboard
          </button>
        </div>
      </section>

      {/* Stat bar */}
      <div className="flex justify-center border-y border-primary/[0.12] relative z-[1]" style={{ background: "rgba(5,10,26,0.65)", backdropFilter: "blur(12px)" }}>
        {stats.map((s, i) => (
          <div key={i} className={`flex-1 max-w-[220px] py-7 px-5 text-center transition-colors hover:bg-primary/[0.04] ${i < stats.length - 1 ? "border-r border-primary/[0.12]" : ""}`}>
            <div className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{s.num}</div>
            <div className="text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="py-24 px-6 md:px-16 relative overflow-hidden" style={{ background: "hsl(222 50% 6%)" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(186 100% 50%), transparent)" }} />
        <div className="text-center text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary mb-3.5">What's Inside</div>
        <h2 className="text-center text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3.5">Everything an Author Needs</h2>
        <p className="text-center text-muted text-base max-w-[500px] mx-auto mb-16 leading-relaxed">From raw draft to ranked Amazon listing — one platform handles it all.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1100px] mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-card border border-[rgba(255,255,255,0.06)] rounded-[14px] p-7 transition-all hover:border-primary/25 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-[46px] h-[46px] rounded-[11px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <f.icon size={20} />
              </div>
              <div className="text-base font-bold text-foreground mb-2">{f.title}</div>
              <div className="text-sm text-muted leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-6 md:px-16 relative overflow-hidden bg-background">
        <div className="text-center text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary mb-3.5">Pricing</div>
        <h2 className="text-center text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3.5">Simple, Transparent Pricing</h2>
        <p className="text-center text-muted text-base max-w-[460px] mx-auto mb-12 leading-relaxed">Start free. Upgrade when you're ready.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto mb-8">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`bg-card border rounded-[14px] p-6 transition-all hover:border-primary/25 hover:-translate-y-1 ${tier.popular ? "border-primary/40 shadow-[0_0_30px_rgba(0,229,255,0.08)]" : "border-[rgba(255,255,255,0.06)]"}`}>
              {tier.popular && (
                <div className="text-[0.6rem] font-bold uppercase tracking-widest text-primary mb-2">Most Popular</div>
              )}
              <div className="text-lg font-bold text-foreground">{tier.name}</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-foreground">{tier.price}</span>
                {tier.sub !== "Forever free" && <span className="text-sm text-muted">{tier.sub}</span>}
                {tier.sub === "Forever free" && <span className="text-xs text-muted ml-1">{tier.sub}</span>}
              </div>
              <div className="space-y-2 mb-5">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check size={13} className="text-emerald flex-shrink-0" />
                    <span className="text-muted">{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={onOpenApp} className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${tier.popular ? "bg-primary text-primary-foreground hover:shadow-[0_0_24px_rgba(0,229,255,0.3)]" : "bg-transparent border border-primary/[0.12] text-foreground hover:border-primary hover:text-primary"}`}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a onClick={() => navigate("/pricing")} className="text-sm font-semibold text-primary cursor-pointer hover:underline">
            See full pricing →
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-16 text-center relative overflow-hidden" style={{ background: "hsl(222 50% 6%)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,80,200,0.14) 0%, transparent 65%)" }} />
        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4 relative z-[1]">Ready to Own Your Audience?</h2>
        <p className="text-muted text-base max-w-[460px] mx-auto mb-10 leading-relaxed relative z-[1]">Stop renting readers from Amazon. Build a direct pipeline to your audience — with calls, emails, and landing pages that convert.</p>
        <button onClick={onOpenApp} className="bg-primary text-primary-foreground px-10 py-3.5 rounded-lg font-extrabold text-base transition-all hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] hover:-translate-y-0.5 relative z-[1]">
          Launch Your Dashboard →
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/[0.12] px-6 md:px-16 pt-16 pb-8" style={{ background: "hsl(222 50% 6%)" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1100px] mx-auto">
          <div>
            <div className="text-xl font-black mb-3.5"><span className="text-primary">Amazon</span> Unlocked</div>
            <p className="text-sm text-muted leading-relaxed max-w-[280px]">The all-in-one KDP marketing suite. Format manuscripts, capture leads, and close sales — from one dashboard.</p>
          </div>
          {[
            { title: "Product", links: [{ label: "Dashboard", action: onOpenApp }, { label: "Manuscript Engine", action: onOpenApp }, { label: "Landing Pages", action: onOpenApp }, { label: "AI Agent", action: onOpenApp }, { label: "Pricing", action: () => navigate("/pricing") }] },
            { title: "Resources", links: [{ label: "Documentation", action: () => {} }, { label: "API Reference", action: () => {} }, { label: "Blog", action: () => {} }, { label: "Changelog", action: () => {} }] },
            { title: "Company", links: [{ label: "About", action: () => {} }, { label: "Careers", action: () => {} }, { label: "Contact", action: () => {} }, { label: "Legal", action: () => {} }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-primary mb-4">{col.title}</h4>
              {col.links.map(link => (
                <a key={link.label} onClick={link.action} className="block text-sm text-muted mb-2.5 cursor-pointer transition-colors hover:text-foreground">{link.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="max-w-[1100px] mx-auto mt-11 pt-5 border-t border-primary/[0.12] flex justify-between items-center flex-wrap gap-3">
          <p className="text-xs text-muted">© 2026 Amazon Unlocked. All rights reserved.</p>
          <div className="flex gap-2">
            {["AES-256 Encrypted", "TCPA Compliant", "SOC 2"].map(badge => (
              <span key={badge} className="flex items-center gap-1.5 bg-primary/[0.06] border border-primary/[0.12] rounded-full px-3 py-1 text-[0.68rem] font-semibold text-muted">
                <span className="text-emerald">✓</span> {badge}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
