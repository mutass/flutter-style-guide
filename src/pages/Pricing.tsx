import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Shield, CreditCard, RefreshCw, HelpCircle, Phone, Mail, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tiers = [
  {
    name: "Writer",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: null,
    cta: "Start Free — No Card Needed",
    ctaVariant: "outline" as const,
    note: "No credit card required. Upgrade anytime.",
    plan: null,
    features: [
      "PDF Engine — eBook only, up to 3 exports/month",
      "Royalty Calculator — unlimited",
      "Spine Width Calculator — unlimited",
      "Upload Checklist — read only",
      "Keyword Finder — 3 searches per day",
      "Cover Checker — 3 checks per month",
    ],
    excluded: [
      "No AI calls",
      "No SMS messages",
      "No email sequences",
      "No lead CRM",
      "No landing pages",
    ],
  },
  {
    name: "Author",
    monthlyPrice: 29,
    annualPrice: 23,
    badge: "Most Popular",
    cta: "Start 7-Day Free Trial",
    ctaVariant: "default" as const,
    note: "No credit card required for trial.",
    plan: "author",
    features: [
      "Everything in Writer",
      "PDF Engine — eBook + Paperback, unlimited exports",
      "Landing Page Builder — all 4 templates",
      "Lead CRM — up to 500 leads",
      "Email Sequences — up to 3 active, 500 emails/month",
      "Cover Checker — unlimited",
      "Price & BSR Tracker — up to 5 books",
      "Keyword Finder — unlimited",
    ],
    excluded: [
      "No AI voice calls",
      "No SMS messages",
    ],
  },
  {
    name: "Publisher",
    monthlyPrice: 79,
    annualPrice: 63,
    badge: null,
    cta: "Start 7-Day Free Trial",
    ctaVariant: "default" as const,
    note: "Includes 200 call minutes + 300 SMS. Additional usage billed separately.",
    plan: "publisher",
    features: [
      "Everything in Author",
      "AI Voice Agent (Sarah) — 200 minutes/month included",
      "SMS sequences — 300 messages/month included",
      "Lead CRM — unlimited leads",
      "Email Sequences — unlimited, 2,000 emails/month",
      "Landing Pages — unlimited, custom color, remove branding",
      "Price Tracker — unlimited books",
      "Priority support — 4 hour response",
      "White-label PDF — remove branding from exports",
    ],
    excluded: [],
  },
];

const addOns = [
  { icon: Phone, title: "Extra Call Minutes", price: "$8", unit: "per 100 minutes", detail: "~$0.08/min — covers Twilio cost + margin" },
  { icon: Mail, title: "Extra SMS Messages", price: "$5", unit: "per 500 messages", detail: "~$0.01/msg — covers Twilio cost + margin" },
  { icon: Zap, title: "Extra Email Sends", price: "$4", unit: "per 1,000 emails", detail: "Scale your email outreach as needed" },
];

const guarantees = [
  { icon: Shield, label: "AES-256 encryption" },
  { icon: Shield, label: "TCPA compliant AI calls" },
  { icon: RefreshCw, label: "Cancel anytime" },
  { icon: CreditCard, label: "30-day money-back guarantee" },
  { icon: Shield, label: "No setup fees" },
  { icon: Shield, label: "GDPR ready" },
];

const comparisonRows = [
  { feature: "PDF Engine exports", writer: "3/month (eBook)", author: "Unlimited", publisher: "Unlimited" },
  { feature: "Landing page templates", writer: "—", author: "4 templates", publisher: "Unlimited + custom" },
  { feature: "Lead CRM capacity", writer: "—", author: "500 leads", publisher: "Unlimited" },
  { feature: "Email sequences", writer: "—", author: "3 active", publisher: "Unlimited" },
  { feature: "Emails per month", writer: "—", author: "500", publisher: "2,000" },
  { feature: "AI call minutes", writer: "—", author: "—", publisher: "200 included" },
  { feature: "SMS messages", writer: "—", author: "—", publisher: "300 included" },
  { feature: "Cover checker", writer: "3/month", author: "Unlimited", publisher: "Unlimited" },
  { feature: "Keyword searches", writer: "3/day", author: "Unlimited", publisher: "Unlimited" },
  { feature: "Price tracker books", writer: "—", author: "5 books", publisher: "Unlimited" },
  { feature: "White-label PDF", writer: "✗", author: "✗", publisher: "✓" },
  { feature: "Priority support", writer: "✗", author: "✗", publisher: "✓" },
];

const faqs = [
  { q: "Why do AI calls cost extra above the included minutes?", a: "AI voice calls use Twilio's voice API plus real-time AI processing. Each minute costs us money in infrastructure. The included minutes cover typical author usage — power users can top up as needed." },
  { q: "What happens if I run out of call minutes mid-month?", a: "Your AI calling pauses automatically. You will get an email notification and can top up instantly from your account. We never charge you without warning." },
  { q: "Can I use my own Twilio account?", a: "Not currently. We manage all Twilio infrastructure to ensure TCPA compliance and call quality. This is planned for a future enterprise tier." },
  { q: "Is there a free trial for Publisher?", a: "Yes — 7 days free, no credit card needed. You get 20 AI call minutes and 50 SMS messages during the trial to test the full pipeline." },
  { q: "What counts as a \"call minute\"?", a: "From the moment your lead answers to the moment the call ends. Unanswered calls or calls under 6 seconds are not charged." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your account settings with one click. You keep access until the end of your billing period. No cancellation fees." },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Pricing — Amazon Unlocked";
  }, []);

  return (
    <div className="min-h-screen bg-background" style={{ background: "var(--gradient-body)" }}>
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 md:px-15 h-[70px] sticky top-0 z-[200] border-b border-primary/[0.12]" style={{ background: "rgba(5,10,26,0.75)", backdropFilter: "blur(20px)" }}>
        <div className="font-black text-lg tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-primary">Amazon</span> <span className="text-foreground">Unlocked</span>
        </div>
        <div className="hidden md:flex items-center gap-0.5">
          {[{ label: "Unlock", path: "/" }, { label: "About Us", path: "/about" }, { label: "Marketing", path: "/" }, { label: "Pricing", path: "/pricing" }, { label: "KDP Sales", path: "/" }].map((link) => (
            <a key={link.label} onClick={() => navigate(link.path)} className={`text-sm font-medium px-4 py-1.5 rounded-full border border-transparent transition-all cursor-pointer ${link.label === "Pricing" ? "bg-primary/[0.12] border-primary/[0.2] text-primary" : "text-foreground hover:border-primary/[0.12] hover:bg-primary/[0.06]"}`}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate("/")} className="bg-transparent border border-primary/[0.12] text-foreground px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:border-primary hover:text-primary">Login</button>
          <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:shadow-[0_0_24px_rgba(0,229,255,0.4)] hover:-translate-y-0.5">Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-20 pb-8 px-6">
        <div className="inline-flex items-center gap-2 bg-primary/[0.08] border border-primary/[0.2] rounded-full px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4">
          Choose Your <span className="text-primary">Plan</span>
        </h1>
        <p className="text-muted text-base max-w-[520px] mx-auto mb-8 leading-relaxed">
          Start free. Upgrade when you're ready. AI calls and SMS are usage-based so you only pay for what you use.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-semibold ${!annual ? "text-foreground" : "text-muted"}`}>Monthly</span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span className={`text-sm font-semibold ${annual ? "text-foreground" : "text-muted"}`}>Annual</span>
          {annual && <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Save 20%</Badge>}
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            const isPopular = tier.badge === "Most Popular";
            return (
              <Card key={tier.name} className={`relative p-7 flex flex-col ${isPopular ? "border-primary/40 shadow-[0_0_40px_rgba(0,229,255,0.1)]" : "border-border"}`}>
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-bold text-xs px-4">
                    Most Popular
                  </Badge>
                )}
                <div className="text-lg font-bold text-foreground mb-1">{tier.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-foreground">{price === 0 ? "Free" : `$${price}`}</span>
                  {price > 0 && <span className="text-sm text-muted">/month</span>}
                </div>
                {annual && price > 0 && (
                  <div className="text-xs text-muted mb-2">Billed annually (${price * 12}/year)</div>
                )}
                {!annual && price === 0 && <div className="text-xs text-muted mb-2">Forever free</div>}
                {!annual && price > 0 && <div className="text-xs text-muted mb-2">Billed monthly</div>}

                <Button
                  variant={tier.ctaVariant}
                  className={`w-full mb-2 font-bold ${isPopular ? "bg-primary text-primary-foreground hover:shadow-[0_0_24px_rgba(0,229,255,0.3)]" : ""}`}
                  onClick={() => navigate(tier.plan ? `/signup?plan=${tier.plan}` : "/signup")}
                >
                  {tier.cta}
                </Button>
                <div className="text-[0.65rem] text-muted text-center mb-5">{tier.note}</div>

                <div className="space-y-2.5 flex-1">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <Check size={14} className="text-emerald mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </div>
                  ))}
                  {tier.excluded.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <X size={14} className="text-muted mt-0.5 flex-shrink-0" />
                      <span className="text-muted">{f}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Add-ons */}
      <section className="max-w-[1100px] mx-auto px-6 pb-16">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-extrabold text-foreground">Need more calls or messages?</h2>
        </div>
        <p className="text-center text-muted text-sm max-w-[560px] mx-auto mb-8">
          Publisher plan includes 200 call minutes and 300 SMS per month. Buy more anytime — no contract.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[800px] mx-auto">
          {addOns.map((addon) => (
            <div key={addon.title} className="bg-card border border-border rounded-xl p-5 text-center">
              <addon.icon size={24} className="text-primary mx-auto mb-3" />
              <div className="font-bold text-foreground mb-1">{addon.title}</div>
              <div className="text-2xl font-black text-primary mb-0.5">{addon.price}</div>
              <div className="text-xs text-muted mb-2">{addon.unit}</div>
              <div className="text-[0.65rem] text-muted">{addon.detail}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-[0.65rem] text-muted mt-4">AI call costs include connection, AI processing, and TCPA compliance logging.</p>
      </section>

      {/* All plans include */}
      <section className="border-y border-primary/[0.12] py-10 px-6" style={{ background: "rgba(5,10,26,0.65)" }}>
        <div className="text-center text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary mb-6">All plans include</div>
        <div className="flex justify-center flex-wrap gap-6 max-w-[900px] mx-auto">
          {guarantees.map((g) => (
            <div key={g.label} className="flex items-center gap-2 text-sm text-muted">
              <g.icon size={16} className="text-emerald" />
              {g.label}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="max-w-[900px] mx-auto py-20 px-6">
        <h2 className="text-center text-2xl font-extrabold text-foreground mb-10">Full Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-sm font-semibold text-muted py-3 px-4">Feature</th>
                <th className="text-center text-sm font-semibold text-muted py-3 px-3">Writer</th>
                <th className="text-center text-sm font-semibold text-muted py-3 px-3">Author</th>
                <th className="text-center text-sm font-semibold text-primary py-3 px-3 bg-primary/5 rounded-t-lg">Publisher</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="text-sm text-foreground py-3 px-4">{row.feature}</td>
                  <td className="text-center text-sm text-muted py-3 px-3">{row.writer}</td>
                  <td className="text-center text-sm text-muted py-3 px-3">{row.author}</td>
                  <td className="text-center text-sm py-3 px-3 bg-primary/5">
                    <span className={row.publisher === "✓" ? "text-emerald font-bold" : row.publisher === "✗" ? "text-muted" : "text-foreground font-medium"}>
                      {row.publisher}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[700px] mx-auto py-20 px-6">
        <div className="text-center text-[0.68rem] font-bold uppercase tracking-[0.15em] text-primary mb-3">FAQ</div>
        <h2 className="text-center text-3xl font-extrabold text-foreground mb-10">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-5">
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/[0.12] px-6 md:px-16 pt-16 pb-8" style={{ background: "hsl(222 50% 6%)" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1100px] mx-auto">
          <div>
            <div className="text-xl font-black mb-3.5"><span className="text-primary">Amazon</span> Unlocked</div>
            <p className="text-sm text-muted leading-relaxed max-w-[280px]">The all-in-one KDP marketing suite.</p>
          </div>
          {[
            { title: "Product", links: [{ label: "Dashboard", path: "/" }, { label: "Manuscript Engine", path: "/" }, { label: "Landing Pages", path: "/" }, { label: "AI Agent", path: "/" }, { label: "Pricing", path: "/pricing" }] },
            { title: "Resources", links: [{ label: "Documentation", path: "/" }, { label: "API Reference", path: "/" }, { label: "Blog", path: "/blog" }] },
            { title: "Company", links: [{ label: "About", path: "/about" }, { label: "Contact", path: "/contact" }, { label: "Privacy", path: "/privacy" }, { label: "Terms", path: "/terms" }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-primary mb-4">{col.title}</h4>
              {col.links.map(link => (
                <a key={link.label} onClick={() => navigate(link.path)} className="block text-sm text-muted mb-2.5 cursor-pointer transition-colors hover:text-foreground">{link.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="max-w-[1100px] mx-auto mt-11 pt-5 border-t border-primary/[0.12] text-center">
          <p className="text-xs text-muted">© 2026 Amazon Unlocked. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
